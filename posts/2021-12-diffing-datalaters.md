---
title: Diffing objects in GTM
description: Spotting state updates worth tracking
date: 2021-12-28
status: draft
tags:
  - analytics
  - googletagmanager
layout: layouts/post.njk
hero: 
---

A large amount of the most critical work in Google Tag Manager (GTM) is in the monitoring of changes in state, particularly objects like eCommerce baskets, filter settings or user editable configurations. In these cases we generally want to know what caused a change to an object (and I'm using _"object”_ in compsci terms here - ie, _a JS object_), and what changes are made to it.

Let's take a real example. One list page that we deal with at [Polestar](https://www.polestar.com) has a list of cars and a filter UI. In this app, the internal logic is not exposed to GTM, the only thing we see is a JS object that describes the current state of the filter - and when it's updated we see a new version appear: 

```js
dataLayer.push({
  event: "Preconf.List",
  preconf.totalCars: 1,
  preconf.currency: "SEK",
  preconf.filter.sort: "DeliveryDateAsc",
  preconf.filter.model: "534",
  preconf.filter.delivery: 3,
  preconf.filter.customer: "b2c",
  preconf.filter.payment: "Cash",
  preconf.filter.price.low: "555200",
  preconf.filter.price.high: "555200",
  preconf.filter.config.exterior: "All",
  preconf.filter.config.interior: "All",
  preconf.filter.config.packages: "All",
  preconf.filter.config.rims: "All",
})
```
Ok - so the dataLayer is telling us that the car list was updated - probably because the filter was changed. So what did change? The answer is we have no idea - we only know what the new state of the filter is.

In a perfect world the webapp would us us in the dataLayer what changed, not just the current state in full. But it's not a perfect world and providing that extra info is often quite a chunk of extra work for webdevs.

How do we report what has changed if we're not told? In our case we _"diff"_ between the previous and the newest filter state - spotting any changes that have occured - and then create our own dataLayer events in a GTM HTML tag. 

### Setup tag

First we need to capture the default filter state at the point that the web app has loaded and is ready. This is important as we need to know the default settings to be able to spot any changes from them

```html
{% raw %}<!-- GTM custom HTML tag, fired by a trigger when the app loads, ie the `Preconf.Load` dataLayer event (you might choose DOM ready or window loaded for this page instead) -->
<script>
  (function() {
    window.gtmFilterPrev = JSON.parse(JSON.stringify({{CONF - config - var}}));
  })();
</script>{% endraw %}
```
Note that in the above we're pulling the part of the dataLayer that we're interested in monitoring (`{% raw %}{{CONF - config - var}}{% endraw %}` - a GTM Datalayer variable that is just `preconf.filter`), and sticking it in a global scoped JS var  `gtmFilterPrev`. We'll use that var in a moment.

### The state change tag

Now we need another tag to fire each time a state update occurs (again, this is just an example, you can customize it to do what you want):

```html
{% raw %}<!-- GTM custom HTML tag, fired by a trigger that spots the above `Preconf.List` dataLayer event  -->
<script>
  (function(){
    // a name of a variable that we'll use in the global scope (ie window.gtmFilterPrev) to hold the "old" state object, so that we can diff the "new" state object against it
    var globalVar = 'gtmFilterPrev';
    // the root in the dataLayer to the keys we're interested in - eg, the monitoring the key "sort" would actually be monitoring the dataLayer value "preconf.filter.sort"
    var objectRoot = 'preconf.filter'; 
    // setup what we want to monitor in the state object (all other keys that change will be ignored)
    var objectKeys = [
      'sort',
      'model',
      'delivery',
      'customer',
      'payment',
      'config.exterior',
      'config.interior',
      'config.packages',
      'config.rims'
    ];
    // diff the filter state object in a shared helper function (a GTM JS variable)
    var changes = {{ENV - helper method - diff object - var}}(objectRoot, objectKeys, globalVar);
    // if any useful filter state changes have been found
    if (changes && changes.length) {
      // tell the dataLayer that the filter was changed meaningfully
      dataLayer.push({
        event : 'preconf.move.filter',
      });
      // create a dataLayer push to detail each change
      changes.forEach(function(change) {
        dataLayer.push({
          event : 'preconf.filter.' + change.action + '.' + change.key,
          'preconf.change': change.value,
          'preconf.changeold': change.valueOld,
          'preconf.changenew': change.valueNew
        });
      });
    })();
</script>{% endraw %}
```
The lifecycle then becomes:
- When a state update is fired (like the one detailed earlier), this tag will be triggered.
- Using a shared helper method, it will trawl through a list of predefined object keys to spot what has changed in the dataLayer. This is reported back as an array of all the monitored keys that have been updated in the array variable `changes`.
- If the `changes` var has any values in the array, we'll tell the dataLayer that a filter change has definitely occured and additionally loop through it to fire dataLayer pushes - one for every change - each listing what changed, plus the old & new value.

So what is in this magical diffing helper method? It's... er, big.

## The helper method code

This is a GTM custom JS var that returns a function - it's referred to in tha above tag by it's name in our GTM container `{% raw %}{{ENV - helper method - diff object - var}}{% endraw %}`. It can be reused by any GTM custom JS tag (or other GTM custom JS var). Here it is in full:

```js
{% raw %}/* GTM custom JS var */
function() {
  // helper method to get a deep object value with a string key 
  // (eg "filter.price.low" finds the object value OBJ['filter']['price']['low'])
  // o = the object to resolve, s = string of the key to find
  Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  }
  // this is the actual diffing helper method
  // - objectRoot: string. the root of all the keys on the dataLayer, eg if we looking for "colour" and "rims" keys sitting in "site.car.config", then that is the objectRoot
  // - objectKeys: array. keys to monitor for changes between states. eg ['colour','rims','interior.trim']
  // - globalVar: string. the name of a global scoped variable that we temporarily hold the previous state in, eg "gtmfilterPrevState"
  // - ignoreBlanks: boolean. If true, each key will ignore changes to-or-from a blank state (eg '' or undefined), only between actual values (eg, "red" to "blue"). If false, any change will be reported.
  return function(objectRoot, objectKeys, globalVar, ignoreBlanks) {
    // get the gtm JS object and all it's method
    var gtm = window.google_tag_manager[{{Container ID}}];
    // get the previous state from the global JS scope
    var prevObject = window[globalVar] || {};
    // step back through the DL pushes until we find the dataLayer push that triggered this tag
    var dataLayerStack = window.dataLayer;
    var dataLayerView;
    for (var i = dataLayerStack.length - 1; i >= 0; i-- ) {
      var dataLayerSent = dataLayerStack[i];
      if (dataLayerSent.event === {{Event}}) {
        currentPush = dataLayerSent;
        i = 0; // stop the loop here
      }
    }
    // warm up the 'changes' var by starting it as an empty array
    var changes = [];
    // loop every key that we're interested in monitoring...
    objectKeys.forEach(function(key) {
      var changeAction;
      var changeKey;
      var changeValue;
      var oldValue;
      var newValue;
      var pipeDelim;
      // the values (before & current) for the section of this event
      var prevValues;
      if (key.includes('.')) {
        prevValues = Object.byString(prevObject, key);
      } else {
        prevValues = prevObject[key];
      }
      var currentValues = currentPush[objectRoot + '.' + key];
      // some values are in the form of pipe delimited strings (eg "A01068|A00492"),
      // so treat those as arrays
      if ((typeof prevValues === 'string' && prevValues.includes('|')) || (typeof currentValues === 'string' && currentValues.includes('|'))) {
        prevValues = (typeof prevValues === 'string' ? prevValues.split('|') : '');
        currentValues = (typeof currentValues === 'string' ? currentValues.split('|') : '');
        pipeDelim = true;
      }
      // is this value (in the pre or current state) an array?
      var prevValuesIsArray = (prevValues ? Array.isArray(prevValues) : false );
      var currentValuesIsArray = (currentValues ? Array.isArray(currentValues) : false );
      // if this key doesn't exist in prev or latest, exit.
      if (prevValues === undefined
        && currentValues === undefined) {
        return;
      }
      // if we can evaluate no difference, exit.
      if (prevValues != undefined
        && currentValues != undefined) {
        // if array
        if (prevValuesIsArray && currentValuesIsArray
            && currentValues.sort().toString() === prevValues.sort().toString()) {
            return;
        // if string
        } else if (currentValues === prevValues) {
            return;
        }
      }
      // if we ignore any values that are turning to/coming from
      // undefined or "" (ie, only registering changes between values),
      // exit here if a blank is found
      if (ignoreBlanks && 
         (prevValues === undefined 
          || prevValues === '' 
          || currentValues === undefined 
          || currentValues === '')) {
        return;
      }
      // if no value before, it's a "choose" action
      if (prevValues === undefined || prevValues === '') {
        changeAction = 'choose';
        changeKey = key;
        changeValue = currentValues;
        oldValue = '';
        newValue = currentValues;

      // if value before, now gone, it's a "remove" action
      } else if (currentValues === undefined || currentValues === '') {
        changeAction = 'remove';
        changeKey = key;
        changeValue = prevValues;
        oldValue = prevValues;
        newValue = '';
        // technical problem where pushing an array with less
        // keys does not remove a key, so we address GTM direct
        gtm.dataLayer.set(objectRoot + '.' + changeKey, undefined);
      
      // we're comparing two arrays
      } else if (prevValuesIsArray && currentValuesIsArray) {
        oldValue = prevValues;
        newValue = currentValues;
        // if both 1 index each, it's a "choose"
        if (prevValues.length === 1 && currentValues.length === 1) {
          changeAction = 'choose';
          changeKey = key;
          changeValue = currentValues;
        // if we're increasing the length of the array, it's a "choose"
        } else if (currentValues.length > prevValues.length) {
          changeAction = 'choose';
          changeKey = key;
          changeValue = currentValues.filter(function(d) {
            return !prevValues.includes(d);
          });
        // else if we're decreasing the length of an array, it's a "remove"
        } else {
          changeAction = 'remove';
          changeKey = key;
          changeValue = prevValues.filter(function(d) {
            return !currentValues.includes(d);
          });
          // technical problem where pushing an array with less
          // keys does not remove a key, so we address GTM direct
          gtm.dataLayer.set(objectRoot + '.' + changeKey, undefined);
          gtm.dataLayer.set(objectRoot + '.' + changeKey, currentValues);
        }

      // if we're comparing two strings
      } else {
        changeAction = 'choose';
        changeKey = key;
        changeValue = currentValues;
        oldValue = prevValues;
        newValue = currentValues;
      }
      // if this key's values are pipe delimited srings that we treated as arrays, stick them back together
      if (pipeDelim) {
        changeValue = (changeValue !== undefined ? changeValue.join('|') : changeValue);
        oldValue = (Array.isArray(oldValue) ? oldValue.join('|') : oldValue);
        newValue = (Array.isArray(newValue) ? newValue.join('|') : newValue);
      }
      // add the change to the changes array
      var changesNode = {};
      if (changeAction) {
        changesNode = {
          action : changeAction,
          key: changeKey,
          value : changeValue,
          valueOld : oldValue,
          valueNew : newValue
        };
        changes.push(changesNode);
      }
    });
    // set the "previous state" in the global scope to the new "current state".
    var objectInDl = gtm.dataLayer.get(objectRoot);
    window[globalVar] = JSON.parse(JSON.stringify(objectInDl));
    // rurn the changes
    return changes;
  }
}{% endraw %}
```

So what is all the above stuff doing?
1. retrieve the previous version of the state object that we stored in a global JS variable that we already named (in the above case `window.gtmFilterPrev`).
1. then retrieve the latest version of the state object - and this is important - _directly from the dataLayer push array_, **not** from the "final" dataLayer model held internally in GTM, because... well we'll get to that...
1. loop through the list of keys that we're interested in and figure out if they have had a value added, removed or modified.

The magic lies in that last step. We have to deal with comparing objects, arrays, strings, numbers and booleans. We have to address deep objects with string notation (that's the `.byString()` prototype that helps use look up a deep object with a string like `'preconf.filter.sortBy'`).

### Side-issue: dealing with array values in the dataLayer

The diff helper method also has to deal with one particularly weird problem. A regular dataLayer value - a _"version 2"_ dataLayer - will add items to an array, but not remove them. So for instance a list of filter checkboxes could be represented in a dataLayer as such:

```js 
{
  filtersChecked: [1,2,3]
}
```
...and then a dataLayer event could show one of the checkboxes has been unchecked:
```js 
dataLayer.push({
  event: 'Preconf.List.Updated',
  filtersChecked: [1,2],
  carsShown: 7
});
```
...when you check the dataLayer, you'll see that the third checkbox has not been removed:

```js 
{
  filtersChecked: [1,2,3]
}
```

[Smarter people than me can explain why this happens](https://www.simoahava.com/gtm-tips/data-layer-variable-versions-explained/), but I'm more interested in how to get around it.

The version 2 dataLayer problem gives us two problems to solve:

- Firstly, we can't rely on the GTMs final representation of the dataLayer - a dataLayer push event might _say_ that a value is being removed from an array, but the final dataLayer won't reflect that. So when we talk about the "latest" state object, we need to pull it from _the dataLayer push array in the JS global scope_ (ie, the array you see if you just type in `dataLayer` into the browser console). Hence the routine in the helper method that steps back through the dataLayer pushes to find the event that triggered the tag in the first place (because you can't assume it was the "last" dataLayer push - there's an amount of ansynchronicity in GTM that means it's not always true).
- Secondly, we need to have a way of setting the _real_ array value on the dataLayer in a reliable way. We do this by addressing the final dataLayer directly and using a GTM method `dataLayer.set()`, to change the value in JS. We use it first to _unset_ an array value (by setting it as `undefined`), then reset to the correct value - this way we're guaranteed the final dataLayer reflects the original push, even if we're removing values from an array.

### Ok, all this is in-place, what now?

You now have new dataLayer events that tell you when state changes that you're interested in occur and specifically what has changed:
```js
{
  event: 'preconf.move.filter'
}
{
  event : 'preconf.filter.choose.model',
  'preconf.change': 'Leasing',
  'preconf.changeold': 'Cash',
  'preconf.changenew': 'Leasing' // almost always the same as preconf.change, but not always...
}
{
  event : 'preconf.filter.remove.rims',
  'preconf.change': 'RX11111', // with "remove" actions, the change is reported as the option removed, not the new value - which is empty - err, because it was removed.
  'preconf.changeold': 'RX11111',
  'preconf.changenew': '' 
}
```
Note that in this example, the tag we wrote sends a single event `preconf.move.filter` to tell tags that a filter change occured (and remember we determine which `objectKeys` we count as a change), and then a dataLayer event detailing each change that was part of that event. In this case a single user event had several effects - swapping to leasing also meant that the user lost their choice of wheels (just an example, not an actual behaviour).

You can use these events to trigger analytics, optimisation or marketing tags only when something important changes. That's a lot more useful than triggering a tag everytime a state change occurs and _still_ not be able to tell analytics _what_ changed.

Importantly, this helps us remove any events that show no changes at all. If you've ever worked with anaytics in complex single-page-applications such as React or Vue, you'll know that they are sometimes built to refresh state on completely unrelated events - so the app will fire multiple dataLayer events even though the state actually hasn't changed. With this diffing method, your tags can now be triggered only on a meaningful change, instead recording dataLayer events unrelated to user actions.

Being a helper method means that we can reuse the same pattern in lots of different situations - list page filters, driving range calculators, car configuration states - all referring to the same JS code in a GTM var, to diff any updates to state objects across the site.

### Epilogue

At [Polestar](https://www.polestar.com), we consider this as much a part of good developer relations as it is a technical solution. We need dev teams to assist us analysts in getting useful and reliable dataLayer pushes into their web apps. But they have backlogs and pressure that often leave any extra work for analytics way down the priority list. 

However, devs often have a JS state object already in the app (eg Flux, JSON, etc), so we have the option of asking them to just place it into a dataLayer push - and we can take it from there. There's no extra complexity that they need to add to their code, because we carry out the diffs in GTM. We can then use any dev time that we saved to ask them for other more specific requests. 

As an added bonus, when the web app code inevitably changes and a new option appears in the state object, we don't need to re-schedule more web app dev-time to update the dataLayer push - if it's just their state object they're pushing, the extra key just appears in the dataLayer, and we just need to tweak our tag to recognise it.