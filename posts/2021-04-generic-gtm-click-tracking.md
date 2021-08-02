---
title: Generic click tracking in GTM
description: multi-use tags to make your life easier
date: 2021-04-24
tags:
  - datananalysis
  - googletagmanager
layout: layouts/post.njk
hero: 2021-06-gettinganalyticsdev2
---

The larger a GTM container becomes, the more you realise that many tags, triggers and variables are doing roughly the same job. So it's worthwhile refectoring some of them away into some generic tags that make your life easier. 

This article details one such technique to reduce most of your click tracking to a simple pattern, so all it takes is a small piece of markup to start collecting data. At Polestar, we use it on reusable React components, so that devs and editors have the ability to roll them out without needing to do any work in GTM at all.

## 1. The markup

```html
<button data-track="click:MyCategory:MyLabel">
  <span class="arrow-icon"></span>
  <span class="btn-text">Click me!</span>
</button>
```

## 2. The trigger

## 3. The event variables

```js
function() {
  // the try catch is only to stop any browser-based bugs from causing disruptions to the site. It's also helpful for debugging
  try {
    // quick exit - if this variable is not called for a click event, stop here
    if (!{{Event}}.includes('click')) {
      return;
    }
    // quick exit - if this variable is not called for a click event on the correct element, stop here (same as above, but the first quick exit needs a tiny amount less time/CPU as it doesn't need to do do the querySelector - #webperf)
    if (!{{Click Element}}.matches('[data-track^="click:"],[data-track^="click:"] *')) {
      return;
    }
    var clickRoot,labelComplete,labelNode,labelTranslated;
    clickRoot = {{ENV - helper function - find closest}}({{Click Element}},'[data-track^="click:"]');
    if (!clickRoot) {
      return 'unknown';
    }
    labelComplete = clickRoot.getAttribute('data-track');
    labelNode = (labelComplete ? labelComplete.split(':')[1] : '');
    return labelNode;

  } catch(err) {
    console.error('ENV - generic click tracking - category - var', err, {{Event}});
  }
}
```

## 4. Putting it together into the tag


## Extending the idea