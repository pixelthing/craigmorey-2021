---
title: Splitting GA events in GTMS
description: Double GA tracking without double streams
date: 2022-04-28
status: draft
tags:
  - analytics
  - googletagmanager
  - googleanalytics
  - ga4
layout: layouts/post.njk
hero: 2019-08-rc-cars-frog-ultimate-1
---

I haven’t seen this anywhere yet, but I’d be pretty surprised if someone hasn’t tried or perfected it somewhere.

## The problem of running GA twice.

So many GA installations are currently transitioning between GA Universal Analytics and GA4, and running them in parallel. We’ve found it invaluable to learn as much about GA4 before we rely on it fully, whilst building up some months of data so we don’t start from zero.

But like many, this transition will continue running for many months - even with a sunset date for UA, we have no GA4 roadmap to try and guess when it will be feature complete enough for us at Polestar to rely on solely (that’s a whole other conversation).

Running these two systems in parallel seems mighty wasteful. We have a GTM container sitting in the users browser, bloated with both GA/UA and GA4 tags. We have all the CPU cycles expended on two sets of tags and and most importantly twice the amount of HTTP requests sent off to GA. This is a tax on the browser and an anchor around the neck of the website experience. Analytics should never get in the way of the experience - but if your connection or computer is slow (and I find running GTM debug as the ultimate simulation of a slow device), that’s exactly what we can become.

This is what it looks like:


And for what benefit? To send two streams of analytics events that are 90% the same information, just in different formats.

As soon as we got a GTM server up and running - primarily for anonymisation of data before sending it on - I was itching to try out a way to keep my two GAs, but with only one stream from the browser to the server.

## Splitting GA on the server

This is the idea. We send only one analytics stream from the browser to the GTM server. We use the GA4 stream because we can add so much additional data into it, including things like the UA style event category, action, label and value. 

On the server, we run the regular tags that pass through the GA4 events on to the Google Analytics servers. But in addition, we run tags that retrieve the additional GA4 parameters, and pass them into GA Universal Analytics events that are then sent on to the Google Analytics servers.

This is what it looks like:

## Splitting UA Page views

UA Page views are the simplest to deal with because all the detail needed for them is already in a GA4 `page_view` event. We simply create a tag in the GTMS server that pulls params out of the the GA4 client and insert them into a GA/UA tag. Actually, we don’t really need to do this manually, as URL parameters are passed through from the incoming client to the outgoing tag, and the GA4 URL parameters work in GA/UA - so we get all this for free. But for sanity checking and easy reading of the process, I like to add them in anyway (you could also do any PII cleaning on them at this stage too).

The GTMS tag for splitting page views is as so (ignore the CDs for now):

## Splitting UA Events

Events are slightly more complex as they have four optional components, the event category (ec), action (ea), label (el) and value (ev). So I added up to four additional parameters to all my existing GA4 events in the client-side GTM container, essentially sending the UA event payload in these GA4 dimensions.

- gua_ec
- gua_ea
- gua_el
- gua_ev

Doing this for each GA4 event tag in the client GTM is a pain - but at the end of it, I managed to wipe out 100 GA/UA tags from the GTM container, which made it easier to swallow.

On the GTM server, we do a similar thing to the page view, we add a GA/UA tag that consumes the data in the GA4 client and drops it all into the correct position.

## Splitting UA Transactions

Transactions are the most complex events, but at least there’s normally just the one (or at least few) to deal with. Unfortunately this project wrapped before I could attempt it, but I’d previously written client-side JS to translate UA simple ecommerce transaction objects into GA4 ones, so writing something to do the reverse on the GTM server-side didn’t seem too hard.

If anyone is really interested, I’ll give it a go.

## Comparing the resulting packets

So does it work? The easiest way of checking is to check in the GTM debug of the GTM server - to see what the outbound packets to the Google Analytics servers look like. This way we can run the regular GTMS, copy the URL, then splitting version and copy the URL. Now we have signals to the Google Analytics collection endpoint, before and after.

Putting them into a spreadsheet and cleaning them up, we can see the which params are exactly the same and which we’re missing.

## The problem with marketing

## 

