---
title: Honest on-screen timing in GTM
description: Skewed average on-screen time sucks
date: 2021-09-01
tags:
  - analytics
  - gtm
layout: layouts/post.njk
hero: 2021-09-gtm-onscreentime
---

One question that UX & PMs often ask about in analytics is "how long is a user on page before they do X action". This has always been something thats easy to set up but results in thoroughly underwhelming results, the average time often seems absurdly long.

The average appears crazy because there is a very long tail of extremely high recorded on-screen times. The reason being that plenty of users will hide a tab, walk away from their computer and let it sleep, or switch to other applications before returning to the page. The time between page load and click event will therefore be very, very long - when our expectations are that it will only be when the page has the users attention.

Here we're going to explain one way to get around this to have a useful on-screen page time, by spotting when the window is - and is not - in front of the user.

## How it works

- At page load time, we do a bit of set-up in a custom HTML tag. This does two things - first it sets a timer (I like using `performance.now()` because it can be used to give a good indication of when the page actually first appeared - not when the GTM container loaded). This value appears on the DL as `meta.time.start`. The second thing is to set up some event listeners to spot when the page is hidden or unhidden.

```html
{% raw %}<!-- GTM custom HTML tag triggered by page load-->
<script>
  (function() {
    // start a timer. Set here direct on the DL to reduce DL event noise.
    var gtm = window.google_tag_manager[{{Container ID}}];
    gtm.dataLayer.set('meta.time.start', performance.now());
    
    // Handle page visibility change - send a DL push when it changed
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }
    function handleVisibilityChange() {
      if (document[hidden]) {
        window.dataLayer.push({
  	    event: 'pagehidden'
  	  });
      } else {
        window.dataLayer.push({
  	    event: 'pageunhidden'
  	  });
      }
    }
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  })();
</script>{% endraw %}  
```
- When the user hides the window (either by selecting another tab, hiding the browser, obscuring the window, sleeping the computer, etc), a `window.hidden` JS event is sent by the browser and our eventListener above swaps this for a `pagehidden`DL push. A GTM custom HTML tag takes another `performance.now()` measurement at this point. You’ll see this in the dataLayer as `meta.time.hiddenlast`.
```html
{% raw %}<!-- GTM custom HTML tag triggered by the pagehidden DL event -->
<script>
  (function() {
    var gtm = window.google_tag_manager[{{Container ID}}];
    gtm.dataLayer.set('meta.time.hiddenlast',performance.now());
  })();
</script>{% endraw %}
```
- When the user returns to the window, a similar event is fired, and a final GTM custom HTML tag takes a third `performance.now()` measurement, does some calcs and adds the time away (including any previous time away) to the dataLayer as `meta.time.hiddentotal`.
```html
{% raw %}<!-- GTM custom HTML tag triggered by the pageunhidden DL event -->
<script>
  (function() {
    var gtm = window.google_tag_manager[{{Container ID}}];
    var timeNow = performance.now();
    var timeLast = gtm.dataLayer.get('meta.time.hiddenlast') || 0;
    var timeTotalSoFar = gtm.dataLayer.get('meta.time.hiddentotal') || 0;
    var timeTotalNow = (timeNow - timeLast) + timeTotalSoFar;
    gtm.dataLayer.set('meta.time.hiddenlast',0);
    gtm.dataLayer.set('meta.time.hiddentotal',timeTotalNow);
  })();
</script>{% endraw %}
```
- The last piece of the puzzle is a GTM variable that calculates the total time since the page was loaded, minus all the time it was hidden. I've also changed from milliseconds (in decimals) into seconds, because do we really need that level of accuracy - plus how big a number do we want to store in GA? 
**NB** this number is rounded DOWN, so if the value is 0, it means the time on-screen is between 0 & 1 second. 
```js
{% raw %}/* GTM custom JS variable */
function() {
  var gtm = window.google_tag_manager[{{Container ID}}];
  var timeStarted = gtm.dataLayer.get('meta.time.start') || 0;
  var timeHidden = gtm.dataLayer.get('meta.time.hiddentotal') || 0;
  var timeOnScreen = performance.now() - timeStarted - timeHidden;
  timeOnScreen = Math.floor(timeOnScreen / 1000);
  return timeOnScreen;
}{% endraw %}
```

You can use this variable in any tracking tags to be an honest value of page onscreen time, or use it in further calculations you might want to carry out.

## SPAs

As usual Single Page Applications (SPAs) tend to ruin the party. The above tags and variables only work in a "regular" multi page application, because when the user moves between pages, the timer is not reset. To get around this, if you are running this in an SPA, you'll need a further GTM custom HTML tag to "clean up" when a virtual page view occurs (often spotted from a `history` event, but check what works best in your application). Note that we're using `undefined` to remove some of the DL keys.
```html
{% raw %}<!-- GTM custom HTML tag triggered by a history event, or similar in your app -->
<script>
  (function(){
    var gtm = window.google_tag_manager[{{Container ID}}];
    // timing
    gtm.dataLayer.set('meta.time.start', performance.now());
    gtm.dataLayer.set('meta.time.hiddenlast', undefined);
    gtm.dataLayer.set('meta.time.hiddentotal', undefined);
  })();
</script>{% endraw %}
```

Be a little wary of setting dataLayer values in the `.dataLayer.set()` method - I use it here because we have so many events in the DL that I'm trying not to confuse the event flow with small maintenance jobs. But doing it this way can make debugging difficult - you could end up looking at GTM debugging for hours, wondering why you're setting a DL value, only to find it set as something else in the final DL - not realising a variable is updating the DL out of sight.

## That's it

There are any number of reasons you might want to collect good page onscreen timings. I'm hoping to use it to undertand the time that users spend in different sections of a page, or in pop-over dialogs, and also to uncover how people struggle in long forms. 

But what I'm really looking forward to is usable, understandable averages and numbers that I can use in some more honest distribution analysis.


