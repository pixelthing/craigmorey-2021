---
title: GTM server-side GA splitting
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

# The problem of running GA twice.

So many GA installations are currently transitioning between GA Universal Analytics and GA4, and running them in parallel. We’ve found it invaluable to learn as much about GA4 before we rely on it fully, whilst building up some months of data so we don’t start from zero.

But like many, this transition will continue running for many months - even with a sunset date for UA, we have no GA4 roadmap to try and guess when it will be feature complete enough for us at Polestar to rely on solely (that’s a whole other conversation).

Running these two systems in parallel seems mighty wasteful. We have a GTM container sitting in the users browser, bloated with both GA/UA and GA4 tags. We have all the CPU cycles expended on two sets of tags and and most importantly twice the amount of HTTP requests sent off to GA. This is a tax on the browser and an anchor around the neck of the website experience. Analytics should never get in the way of the experience - but if your connection or computer is slow (and I find running GTM debug as the ultimate simulation of a slow device), that’s exactly what we can become.

And for what benefit? To send two streams of analytics events that are 90% the same information, just in different formats.

As soon as we got a GTM server up and running I was itching to try out a way to keep my two GAs, but with only one stream from the browser to the server.

# Splitting GA on the server