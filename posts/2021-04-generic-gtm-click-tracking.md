---
title: Generic click tracking in GTM
description: Multi-use tags to make your life easier
date: 2021-04-24
tags:
  - analytics
  - gtm
layout: layouts/post.njk
hero: 2021-04-generic-gtm-click-tracking-hero
---

The larger a Google Tag Manager (GTM) container becomes, the more you realise that many tags, triggers and variables are doing roughly the same job. So it's worthwhile refactoring some of them away into a few generic tags that make your life easier. 

This article details one such technique to reduce most of your click tracking to a simple reusable pattern, so all it takes is a small piece of markup to start collecting data. At <a href="https://www.polestar.com?utm_campaign=craigs.blog" target="_blank" rel="noopener">Polestar</a>, we use it on reusable React components, so that devs and editors have the ability to roll them out without needing to do any work in GTM at all.

## 1. The markup

```html
<button data-track="click:MyCategory:MyLabel">
  <span class="arrow-icon"></span>
  <span class="btn-text">Click me!</span>
</button>
```

The markup is just a data attribute of the element thats clickable/tappable. Here its a button, but it could just as easily be an anchor, input or div (please don't). The markup inside is incidental, it's just here to remind you that markup is not always clean, and that javascript sees the actual target element you click, which might be a child of the element you _think_ you're clicking (we'll cover that later).

I don't like using ids, aria or classes to target GTM triggers - or even existing data attributes like `data-tmpl`. They're too easily refactored away by some future front-end dev for perfectly valid reasons - and then you're left wondering where the data went. Instead, I like data attributes that clearly separate themselves in purpose from other markup, that way anyone looking to tweak or re-write the code has a good chance of retaining the analytics.

The attribute value is a colon separated list of:
- event action
- event category
- event label

This is tailored towards Google Universal Analytics, but could just as easily be consumed by GA4 hit event tags. 

the action always starts with "click" (but could, for instance, be `click_tab`), but the other two can be set to whatever you like. And there's no reason you shouldn't add event value, or in-tag text substitutions (see "extending the idea" later).

That's it. Easy enough for any developer to drop into an HTML component. All you need now are the GTM tags/triggers/vars to consume it.

## 2. The trigger

:::picture 2021-04-generic-gtm-click-tracking-1
:::

The trigger is an element click with a couple of simple CSS selectors, comma separated. 

```css
[data-track^="click"],[data-track^="click"] *
```

The first part is a CSS attribute selector for the click element we labelled in the markup, the second is to catch any clicks on any child elements inside the first element, such as icons, text wrappers and so on.

## 3. The event variables

You remember that we said their were three parts to the attribute value in the markup? To capture each one of those, we need three GTM custom JS variables. Below is the one to collect the event category:

```js
{% raw %}function() {
  // the try/catch is only to stop any browser-based bugs from causing disruptions to the site. It's also helpful for debugging
  try {
    // quick exit - if this variable is not called for a click event, stop here
    if (!{{Event}}.includes('click')) {
      return;
    }
    // quick exit - if this variable is not called for a click event on the correct element, stop here (same as above, but the first quick exit needs a tiny amount less time/CPU as it doesn't need to do do the querySelector - #webperf)
    if (!{{Click Element}}.matches('[data-track^="click"],[data-track^="click"] *')) {
      return;
    }
    var clickRoot,labelComplete,labelNode,labelTranslated;
    // clickRoot assumes you might have clicked on a child element of the button that we want to focus on. So it uses a helper function to step back up the DOM tree to find it.
    // This helper function could be replaced by the .closest() method, but that is only supported in ES6, so won't compile in GTM (which only supports ES5), so think of this helper function as a polyfill.
    // Read the Simo Ahava article on this helper function (link in description)
    clickRoot = {{ENV - helper function - find closest}}({{Click Element}},'[data-track^="click:"]');
    if (!clickRoot) {
      return 'unknown';
    }
    // now get the value of the attribute
    labelComplete = clickRoot.getAttribute('data-track');
    // and finally split it into an array and get the second (index1) node
    labelNode = (labelComplete ? labelComplete.split(':')[1] : '');
    return labelNode;

  } catch(err) {
    console.error('ENV - generic click tracking - category - var', err, {{Event}});
  }
}
{% endraw %}

```

Similar GTM variables wil be needed for action and label - the only difference will be the number in the `labelNode` line, `[0]` for the action, `[2]` for the label.

Note this code uses a helper function that needs it's own GTM var - this is explained in detail in this [Simo Ahava article](https://www.google.se/amp/s/www.simoahava.com/amp/analytics/capturing-the-correct-element-in-google-tag-manager/).

Also note that there are a couple of "quick exits" at the start of the function. GTM variables are evaluated _every single time a event occurs in GTM_, so I find it best to ruthlessly limit what events get beyond the first couple of lines, to reduce the amount of uneccessary CPU cycles spent.

## 4. Putting it together in a tag

Now we have a triggers, and values to use in the form of GTM variables, we can can build the tag to send data to GA. As mentioned, this is a Universal Analytics tag, but it could easily be a GA4 hit event too.

:::picture 2021-04-generic-gtm-click-tracking-2
:::

Now you have this tag set up, you might never have to make another tag again to track a button click...

## Extending the idea

At Polestar we've used variations on this technique to create a suite of generic trackers, from CTA clicks to email and download clicks. 

It means that the need to build many simple tracking tasks can be decoupled from the business of building a large, multi-team site. A dev team can build a new landing page, drop in and label a standard CTA component, and the first we in Web Analytics know about it is when the data starts coming in.

We've extended it in several ways, for instance by adding text substitution to the values that can inject dataLayer values. This way, we can have a dumb piece of markup such as:
```html
<button data-track="click:[MODEL]_config:blue_btn"></button>
```

... that substitutes `[MODEL]` with the car model that is held in the dataLayer model. In the above example we receive a GA event category of `ps2_config`. 

This sort of substitution can be done by just replacing the `return` line in the custom variable code with a few more lines of code:
```js
{% raw %}// this block of code replaces the "return" line in any of the GTM variables where you want substitution.
labelTranslated = labelNode;
if (labelNode.includes('[MODEL]')) {
  // below we swap [MODEL] with a dataLayer value held in a GTM variable.
  labelTranslated = labelNode.replace('[MODEL]', {{ENV - car model (short)}})
}
return labelTranslated;
{% endraw %}
```

I'm sure you can think of potential uses for similar substitutions.

