---
title: Splitting GA events in GTMS
description: Twice the GA tracking without twice the streams
date: 2022-04-28
tags:
  - analytics
  - gtm
  - ga4
layout: layouts/post.njk
hero: 2022-04-splitting-ga-in-gtms-hero
---

::: aside
I haven’t seen this anywhere yet, but I’d be pretty surprised if someone hasn’t tried or perfected it somewhere.
:::

Many Digital analytics teams are currently running both GA Universal Analytics (GA/UA) and the new, shiny GA4, whilst transitioning from the old to the new. We’ve found it invaluable to learn as much about GA4 before we rely on it fully, whilst building up some backstory of data so we don’t start from zero when we eventually push the button.

And like many others, this transition phase will continue running for many months - even with a sunset date for UA, there exists no GA4 roadmap to try and guess when it will be feature complete enough for our analysts to rely on it solely.

But running these two systems in parallel seems mighty wasteful. We have a GTM container sitting in the users’ browser, bloated with both GA/UA and GA4 tags. We have all the CPU cycles expended on two sets of JS tags and and just as importantly double the amount of HTTP requests sent off to GA. This is a tax on the browser and a potential anchor around the neck of the website experience. Analytics should never get in the way of the experience - but if your connection or computer is slow (and I find running GTM tag assistant as the ultimate simulation of a slow device), that’s exactly what we can become.

This is what double sending GA/UA & GA4 events looks like:

:::picture 2022-04-splitting-ga-in-gtms-flow1
The two analytics streams from a browser to GTM server to GA
:::

> why send two streams of analytics events that are 95% the same data?

As soon as we got a GTM server up and running (primarily for anonymisation of data before sending it on to GA) I was itching to try out a way to keep my two GAs, but with only one stream from the browser to the server.

## Splitting GA on the server

This is the idea. We send only one GA4 analytics stream from the browser to the GTM server and we remove all the GA/UA tags from the client container so no “old” GA events are sent from the client. So, one stream up. 

On the GTM server, we run the regular tags that pass through the GA4 events on to the Google Analytics servers. But in addition, we run some customised tags that parse the same GA4 events into GA/UA ones that are then sent onwards.

Hence two streams from one. We get our old faithful GA/UA and the future proof GA4 stream with half the traffic.

This is what it looks like:

:::picture 2022-04-splitting-ga-in-gtms-flow2
The single GA4 analytics stream being split on the GTM server
:::

## Splitting UA Page views

UA Page views events are the simplest to deal with because all the detail needed for them is already in a GA4 `page_view` event. We create a tag in the GTMS server that pulls params out of the the GA4 client and insert them into a GA/UA tag. Actually, we don’t event need to parse the page location and such, as URL parameters are passed through from the incoming client to the outgoing tag, and the GA4 URL parameters for pageviews work in GA/UA - so we get all this for free.

The GTMS tag for splitting page views is as below (ignore the CDs for now):

:::picture 2022-04-splitting-ga-in-gtms-tag1
The GTM server-side tag for sending a GA/UA page view from a GA4
:::

## Splitting UA Events

Events are slightly more complex as they have four optional components, the event category (ec), action (ea), label (el) and value (ev). So I added up to four additional dimensions to all my existing GA4 events in the client-side GTM container, essentially encoding a regular GA/UA event payload in these GA4 dimensions.

- gau_ec
- gau_ea
- gau_el
- gau_ev

Doing this for each GA4 event tag in the client GTM is a pain - but at the end of it, I could remove 100 GA/UA tags from the GTM container, which made the work easier to swallow.

On the GTM server, we do a similar thing to the page view, we add a GA/UA tag that consumes the data in the GA4 client and drops it all into the correct position. The tag looks like so:

:::picture 2022-04-splitting-ga-in-gtms-tag2
The GTM server-side tag for sending a GA/UA event from a GA4
:::

## Splitting UA Transactions

Transactions are the most complex events, but at least there’s normally just the one (or at least only a few) to deal with. Unfortunately this project wrapped before I could attempt it, but I’d previously written client-side JS to translate UA simple ecommerce transaction objects into GA4 ones, so writing something to do the reverse on the GTM server-side didn’t seem too hard.

If anyone is really interested, I’ll give it a go.

## Comparing the resulting packets

So does it work? Well, during testing we definitely saw GA/UA page views and events just as we expected, despite the web browser never sending any.

But we needed to look closer into any hidden differences in the packets we were sending. We used the GTM tag assistant (ie debug) of the GTM server, here we can see what the outbound packets to the Google Analytics servers look like. Then we ran the regular production GTMS container (double-sending GA/UA & GA4), followed by our custom splitting version - in a temporary GTM workspace - and compared the two outgoing URLs.

::: aside
The cookies set by the `gtag.js` script at the client are interchangeable between GA/UA and GA4, so passing the cookie from a GA4 event over to a GA/UA event is no problem.
:::

Putting the URL parameters into a spreadsheet and cleaning them up, we can see which params are exactly the same and which ones we’re missing. First thing to note is that all the GA4 params are passed through to the GA/UA URL. GA/UA will ignore anything it can't use, so over-supplying GA4 params won't make any difference - there’s no need to remove them just for GA/UA. On the other hand, it's up to us to add any additional parameters that GA/UA needs, and that's what our server-side GTM tags are doing in the splitting process.

:::picture 2022-04-splitting-ga-in-gtms-compare
Comparing the measurement protocol URL from a normal UA pageview and one via splitting.
:::

Doing this means falling down the hole of GA measurement protocol parameters. These are littered with lots of official params that have appeared or been deprecated over time, plus lots of third party martech ones that are not documented so well. [Here are](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters) [some resources](https://www.thyngster.com/ga4-measurement-protocol-cheatsheet/) [you might want to use](https://cheatography.com/dmpg-tom/cheat-sheets/google-universal-analytics-url-collect-parameters/). 

Looking through them showed some interesting differences:
- GA/UA sends some tech/environment parameters that GA4 has since dropped. Most are archaic, such as Java support, Flash version, Screen depth (eg 24bit), so their loss is not a problem. 
- One tech/environment parameter that I was surprised to see dropped in GA4 is `&vp=` - viewport size. It is different from `&sr=` screen resolution because it reports the size of the canvas the website is drawn in, not the size of the whole screen. Both of these are useful to developers & designers. Google Analytics UA never revealed viewport size data in standard reporting, so I guess that's why it hasn't been carried over to GA4. But it seems a strange omission - removing a useful dimension that was never used because you never told anyone about it. It seems the opposite of the correct course of action - there must be some other reason for why it was removed?
- A few parameters that we were missing were essentially analytics for GA, like the SDK number and a verification code. Neither of them will effect your results.
- It's interesting that one thing that both URLs sent were hashes of the GTM config ID - I'm assuming the original UA event sent a hashed id of the GTM container in the client, whereas the split event overwrote that with one describing the GTM server-side container. Either way, they won't affect your analytics.
- There always seems to be the parameters that no one seems aware of, `&_z=`,  `&_r=`. They could be marketing info or they could be internal analytics, it's hard to tell.

> and then there's marketing link parameters…

## The problem with marketing

This was the last nail in the coffin for our clever plan, but it might not be the case forever, or for you. When comparing the POST urls for the original UA page vew and our split version, a few parameters jumped out:

1. `&a=`
1. `&_gid=`
1. `&jid=`/`&gjid=`
1. `&xa-ga-mp2-...=`

The first few are a mix of Adsense and Doubleclick links in GA, whilst the `&xa-ga-mp2-...=` parameters are ActiveCampaign email links which might have been added by a Salesforce Cloud integration. These are all generated because of links to the martech stack added to the GA UA property by our marketing department.

What they do precisely and what would happen if they were removed is a bit unclear to a non-martech person like myself, but after talking with smart people, the answer was _“nothing good”_ would come of it. We needed the parameters to link across to out marketing platforms and report on campaign effectiveness, so removing them was not an option. 

The alternative solution of switching these GA/UA connections to marketing systems across to GA4 was also a non-starter - as with most things GA4, the solutions are _not quite ready_. 

Lastly we could look into moving some of these marketing systems into GTM server-side tags, but that would also take our Marketing dept lots of time to understand what they could and couldn't achieve, what was ready and what would break, so that too was not an option.

Or not yet.

## Conclusion

So our brave battle plan falls as it meets real action (twas ever thus). Until Marketing can find a solution for moving away from GA/UA, we will have to continue to double sending GA/UA _and_ GA4 events from the browser, and as I am an ex-front-end dev interested in #webperf, that feels a bit icky.

If marketing solutions are ready in GA4/GTMS and our team give the ok to move to them, we could consider this plan again, but at that point we'd hopefully be much closer to switching off GA/UA altogether, so there might be no point.

But - and this is a big but - our situation _might_ not be your situation, and that's why I've left this article here, in case you might find some value in this method of sending to two generations of GA analytics from only one analytics stream.

