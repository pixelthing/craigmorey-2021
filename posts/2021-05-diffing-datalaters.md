---
title: Diffing objects in GTM
description: Spotting state updates worth tracking
date: 2021-05-17
status: draft
tags:
  - analytics
  - googletagmanager
layout: layouts/post.njk
hero: 
---

A large amount of the most critical work in Google Tag Manager (GTM) is in the monitoring of changes in state, particularly objects like eCommerce baskets, filter settings or user editable configurations. In these cases we generally want to know what caused a change to an object (and I'm using _"object”_ in compsci terms here - ie, _a JS object_), and what changes are made to it.

Let's take a real example. One list page that we deal with has a list of cars and a filter UI. In this app, the internal logic is not exposed to GTM, the only thing we see is a JS object that describes the current state of the filter - and when it's updated we see a new version appear: 

```js
```
In a perfect world the webapp would give us a dataLayer detailing what changed, not just the current state in full. But it's not a perfect world and providing that extra info is often quite a chunk of extra work for webdevs.

How do we report what has changed if we're not told? In our case we _"diff"_ between the previous and the newest filter state - spotting any changes that have occured. We do this by triggering a tag when the above dataLayer push occurs. Before I describe how it works, here's the tag itself: 

```html
  {% raw %}objectRoot = 'preconf.filter';
  <!-- tag fired by a trigger that spots a `filterUpdated` dataLayer event  -->
  <script>
    (function(){
      // a name of a variable that we'll use in the global scope (ie window.gtmFilterPrev) to hold the "old" state object, so that we can diff the "new" state object against it
      var globalVar = 'gtmFilterPrev';
      // setup what we want to monitor in the state object
      var objectRoot = 'preconf.filter'; // the root in the dataLayer to the keys we're interested in - eg, the monitoring the key "sort" would actually be monitoring the dataLayer value "preconf.filter.sort"
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
      var changes = {{ENV - helper function - diff object - var}}(objectRoot, objectKeys);
      // if any useful filter state changes have been found
      if (changes && changes.length) {
        // create a dataLayer push for each change
        changes.forEach(function(change) {
          dataLayer.push({
            event : 'preconf.filter.choose.' + change.key,
            'preconf.change': change.value,
            'preconf.changeold': change.valueOld,
            'preconf.changenew': change.valueNew
          });
        });
      })();
  </script>
  }{% endraw %}
```
The lifecycle then becomes:
- When a state update is fired (like the one detailed earlier), this tag will be triggered.
- Using a shared helper function, it will trawl through a list of predefined object keys to spot what has changed in the dataLayer. This is reported back as an array of all the monitored keys that have been updated in the array variable `changes`.
- If the `changes` var has any values in the array, we'll loop through it to fire subsequent dataLayer pushes - one for each change - each listing what changed, plus the old & new value.

So what is in this magical diffing helper method? It's... er, big. 

## The code

```js
{% raw %}function() {
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
  return function(objectRoot, objectKeys, globalVar) {
    var gtm = window.google_tag_manager[{{Container ID}}];
    var prevObject = window[globalVar] || {};
    var currentPush = window.dataLayer[window.dataLayer.length - 1];
    //console.log('---')
    //console.log('prevObject',prevObject)
    //console.log('currentPush',currentPush)
    var changes = [];
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
        // NOTE!!! This uses a method Object.byString() 
        // that needs you to load a helper method var
        // "ENV - helper function - resolve object from string - tag"
        // to be loaded before this is carried out. It's 
        // suggested you do it at app/container load if you
        // intend to use this!
        if (!Object.byString || typeof Object.byString !== 'function') {
          //console.log('method Object.byString() not available, make sure it\'s helper var "ENV - helper function - resolve object from string - tag" is loaded before this diff is run',object,Object.byString,typeof Object.byString);
          return;
        }
        prevValues = Object.byString(prevObject, key);
      } else {
        prevValues = prevObject[key];
      }
      var currentValues = currentPush[objectRoot + '.' + key];
      //console.log('-prevValues',key,prevValues)
      //console.log('-currentValues',key,currentValues)
      
      // some values are in the form of pipe delimited strings (eg "A01068|A00492")
      // so treat those as arrays
      if ((typeof prevValues === 'string' && prevValues.includes('|')) || (typeof currentValues === 'string' && currentValues.includes('|'))) {
        prevValues = (typeof prevValues === 'string' ? prevValues.split('|') : '');
        currentValues = (typeof currentValues === 'string' ? currentValues.split('|') : '');
        pipeDelim = true;
      }
      var prevValuesIsArray = (prevValues ? Array.isArray(prevValues) : false );
      var currentValuesIsArray = (currentValues ? Array.isArray(currentValues) : false );
      
      //console.log('+prevValues',key,prevValues)
      //console.log('+prevValuesIsArray',key,prevValuesIsArray)
      //console.log('+currentValues',key,currentValues)
      //console.log('+currentValuesIsArray',key,currentValuesIsArray)
      
      // if this key doesn't exist in prev or latest, exit.
      if (prevValues === undefined
        && currentValues === undefined) {
        return;
      }
      // if we can evaluate no difference, skip.
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
      // if any of the values are pipe delimited arrays, stick them back together
      if (pipeDelim) {
        changeValue = (changeValue !== undefined ? changeValue.join('|') : changeValue);
        oldValue = (Array.isArray(oldValue) ? oldValue.join('|') : oldValue);
        newValue = (Array.isArray(newValue) ? newValue.join('|') : newValue);
      }
      // add the change to the list
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
    var objectInDl = gtm.dataLayer.get(objectRoot);
    //console.log('**objectInDl',objectInDl)
    window[globalVar] = JSON.parse(JSON.stringify(objectInDl));
    return changes;
  }
}{% endraw %}
```

So what is all the above stuff doing?
1. retrieve the previous version of the state object that we stored in a global JS variable that we already named (in the above case `window.gtmFilterPrev`).
1. then retrieve the latest version of the state object - and this is important - _directly from the dataLayer push array_, **not** from the "final" dataLayer model held internally in GTM, because... well we'll get to that...
1. loop through the list of keys that we're interested in and figure out if they have had a value added, removed or modified.

The magic lies in that last step. We have to deal with comparing objects, arrays, strings, numbers and booleans. We have to address deep objects with string notation (that's the `.byString()` prototype that helps use look up a deep object with a string like `'preconf.filter.sortBy'`).

### Dealing with array values in the dataLayer

The diff helper method also has to deal with one particularly weird problem. A regular dataLayer value - a _"version 2"_ dataLayer - will add items to an array, but not remove them. So for instance a list of filter checkboxes could be represented in a dataLayer as such:

```js 
{
  filtersChecked: [1,2,3]
}
```
...and then a dataLayer event could show one of the checkboxes has been unchecked:
```js 
dataLayer.push({
  event: filterUpdated,
  filtersChecked: [1,2]
});
```
...when you check the dataLayer, you'll see that the key has not been removed:

```js 
{
  filtersChecked: [1,2,3]
}
```

[Smarter people than me can explain why this happens](https://www.simoahava.com/gtm-tips/data-layer-variable-versions-explained/), but I'm more interested in how to get around it.

The version 2 dataLayer problem gives us two problems to solve:

- Firstly, we can't rely on the GTMs final representation of the dataLayer - a dataLayer push event might _say_ that a value is being removed from an array, but the final dataLayer won't reflect that. So when we talk about the "latest" state object, we need to pull it from _the dataLayer push array in the JS global scope_ (ie, the array you see if you just type in `dataLayer` into the browser console). Hence the routine in the helper method that steps back through the dataLayer pushes to find the event that triggered the tag in the first place (because you can't assume it was the "last" dataLayer push - there's an amount of ansynchronicity in GTM that means it's not always true).
- Secondly, we need to have a way of setting the _real_ array value on the dataLayer in a reliable way. We do this by addressing the final dataLayer directly and using a GTM method `dataLayer.set()`, to change the value in JS. We use it first to _unset_ an array value (by setting it as `undefined`), then reset to the correct value - this way we're guaranteed the final dataLayer reflects the original push, even if we're removing values from an array.

### That's all well and good, but what do you do it it?

Anything you want. You now have new dataLayer events that tell you when state changes and what has changed:
```js
{
  event : 'preconf.filter.choose.model,
  'preconf.change': 'Polestar2',
  'preconf.changeold': 'Polestar1',
  'preconf.changenew': 'Polestar2' // almost always the same as preconf.change, but not always...
};
```
You can use these events to trigger analytics, optimisation or marketing tags only when something you've predefined (in the `objectKeys` settings in the tag) as important, changes. That's a lot more useful than triggering a tag everytime a state change occurs - even if nothing interesting has changed - and _still_ not be able to tell analytics _what_ changed.

Being a helper method means that we can reuse the same pattern in lots of different situations - list page filters, driving range calculators, car configuration states - all referring to the same JS code, to diff any updates to a state object.

### Conclusion

At Polestar, we consider this as much a part of good developer relations as it is a technical solution. We need dev teams to assist us analysts in getting useful and reliable dataLayer pushes into their web apps. But they have backlogs and pressure that often leave any extra work for analytics way down the priority list. By offering to diff a state object on the GTM side instead of their side, we have the option of asking them to just place a state object (that probably already exists - eg Flux, JSON, etc) into a dataLayer push - and we can take it from there. We can then use any dev time saved to ask them for other more specific requests. 

As an added bonus, when the web app code changes and a new option appears in the state object, we don't need to re-schedule more web app team dev-time to update the dataLayer push - if it's just their state object they're pushing, the extra key just appears in the dataLayer, and we just need to tweak our tag to recognise it.