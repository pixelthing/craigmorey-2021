---
title: Diffing datalayer objects in GTM
description: Spotting updates worth tracking
date: 2021-05-17
tags:
  - datananalysis
  - googletagmanager
layout: layouts/post.njk
hero: 2021-05-diffing-datalayers-hero
---

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


```js
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
