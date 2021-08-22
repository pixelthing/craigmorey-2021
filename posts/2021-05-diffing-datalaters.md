---
title: Diffing datalayer objects in GTM
description: Spotting updates worth tracking
date: 2021-05-17
status: draft
tags:
  - analytics
  - googletagmanager
layout: layouts/post.njk
hero: 
---

A large amount of the most critical work in Google Tag Manager (GTM) is in the monitoring of changes in state, particularly objects like eCommerce baskets, filter settings or user editable configurations. In these cases we generally want to know what caused a change to an object (and I'm using _"object”_ in compsci terms here), and what changes were made.

Let's take a real example. One list page that we deal with has a list of cars and a filter UI. In this app, the internal logic is not exposed to GTM, the only thing we see is a JS object that describes the current state of the filter - and when it's updated we see a new version appear: 

```js
```

How do we report what has changed if we're not told? In our case we use a helper function to diff between the previous and the newest filter object - we "diff" the two objects. We do this by firing a tag when we spot the filter was updated: 

```js
  {% raw %}objectRoot = 'preconf.filter';
  objectKeys = [
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
  var changes = {{ENV - helper function - diff object - var}}(objectRoot, objectKeys);
  if (changes && changes.length) {
    // DL push for each change
    changes.forEach(function(change) {
      dataLayer.push({
        event : 'preconf.filter.choose.' + change.key,
        'preconf.change': change.value,
        'preconf.changeold': change.valueOld,
        'preconf.changenew': change.valueNew
      });
    });
  }{% endraw %}
```

Above, we pass into the helper function:
- `objectRoot`: the part of the dataLayer that we're focusing on (in this case we looking at values in `dataLayer['preconf']`)
- `objectKeys`: a list of object keys that we're interested in if they change.

The helper function outputs any changes as an array into the variable `changes`, which we can then loop through and create our own dataLayer pushes that inform any tags of the actual changes.

So what is in this diffing helpwe function? It's... er, big. 

## The code

```js
{% raw %}function() {
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

In addition to this, we extend the object prototype with a way of interrogating a JS object with a string notation, eg returning `OBJ['filter']['price']['low'] ` by asking for `filter.price.low`. This is particularly useful for us because we use namespaces in the dataLayer with dot notation that ends up creating deep JS objects. This method is added in our case by a GTM tag at the point the page loads:

```html
<script>
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
</script>
```

So what is all this stuff doing?
1. retrieve the previous version of the object
1. retrieve the latest version of the object - direct from the dataLayer push array, not from the "final" dataLayer model held internally in GTM, because... well we'll get to that.
1. loop through the list of keys that we're interested in and figure out if they have had a value added, removed or modified.

Of course the magic lies in that last step. We have to deal with comparing objects, arrays, strings, numbers and booleans. We have to address deep objects with string notation (that's the `.byString()` prototype that helps use look up a deep object with a string like `'preconf.filter.sortBy'`).

### removing array items in GTM

But the other problem this script deals with is a weird one. A regular dataLayer value - a "type 2" - will add items to an array, but not remove them. So you can have a dataLayer such as:

```js 
dataLayer.myKey = [1,2,3]
```
...and then update it with one of the array values missing:
```js 
dataLayer.push({
  myKey: [1,2]
});
```
...when you check the dataLayer, you'll see that the key has not been removed:

```js 
dataLayer.myKey = [1,2,3]
```

[Smarter people than me can explain why this happens](), but what I'm more interested in is how to get around it.

Firstly, we can't rely on the GTMs final representation of the dataLayer - so when we talk about the "latest" object, we need to pull it from the dataLayer push object in the JS global scope, hence the line about `window.dataLayer[window.dataLayer.length - 1]`.

Secondly, we need to have a way of setting the dataLayer with the new value in a reliable way. We do this by addressing the final dataLayer directly and using a GTM method `dataLayer.set()` to change the value.




