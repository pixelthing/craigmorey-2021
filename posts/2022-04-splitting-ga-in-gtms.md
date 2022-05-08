---
title: Splitting GA events in GTMS
description: Double GA tracking without double streams
date: 2022-04-28
status: draft
tags:
  - analytics
  - gtm
  - googleanalytics
  - ga4
layout: layouts/post.njk
hero: 2022-04-splitting-ga-in-gtms-hero
---

I haven’t seen this anywhere yet, but I’d be pretty surprised if someone hasn’t tried or perfected it somewhere.

## The problem of running GA twice.

So many GA installations are currently running both GA Universal Analytics (UA) and the new, shiny GA4, whilst transitioning from the old to the new. We’ve found it invaluable to learn as much about GA4 before we rely on it fully, whilst building up some months of data so we don’t start from zero when we eventually push the button.

And like many others, this transition phase will continue running for many months - even with a sunset date for UA, there exists no GA4 roadmap to try and guess when it will be feature complete enough for our analysts to rely on it solely.

But running these two systems in parallel seems mighty wasteful. We have a GTM container sitting in the users browser, bloated with both GA/UA and GA4 tags. We have all the CPU cycles expended on two sets of tags and and most importantly double the amount of HTTP requests sent off to GA. This is a tax on the browser and an anchor around the neck of the website experience. Analytics should never get in the way of the experience - but if your connection or computer is slow (and I find running GTM debug as the ultimate simulation of a slow device), that’s exactly what we can become.

This is what it looks like:


And for what benefit? To send two streams of analytics events that are 90% the same information, just in slightly different formats.

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

- gau_ec
- gau_ea
- gau_el
- gau_ev

Doing this for each GA4 event tag in the client GTM is a pain - but at the end of it, I could remove 100 GA/UA tags from the GTM container, which made it easier to swallow.

On the GTM server, we do a similar thing to the page view, we add a GA/UA tag that consumes the data in the GA4 client and drops it all into the correct position.

## Splitting UA Transactions

Transactions are the most complex events, but at least there’s normally just the one (or at least few) to deal with. Unfortunately this project wrapped before I could attempt it, but I’d previously written client-side JS to translate UA simple ecommerce transaction objects into GA4 ones, so writing something to do the reverse on the GTM server-side didn’t seem too hard.

If anyone is really interested, I’ll give it a go.

## Comparing the resulting packets

So does it work? The easiest way is to check in the GTM debug of the GTM server - to see what the outbound packets to the Google Analytics servers look like. This way we can run the regular GTMS, copy the URL, then splitting version and copy the URL. Now we have signals to the Google Analytics collection endpoint, before and after.

Putting them into a spreadsheet and cleaning them up, we can see the which params are exactly the same and which we’re missing. First thing to note is that all the GA4 params are passed through to the UA URL. UA will ignore anything it can't use, so over-supplying GA4 params won't make any difference - but it's up to us to add any additional ones that UA needs, and that's what our server-side GTM tags are doing in the split process.


If you've never fallen down the hole of GA measurement protocol parameters, don't. It's wide, deep and ever changing. Here are some resources you might want to use. But it threw-up some really interesting differences.
- UA used to send some environment parameters that GA4 has dropped. Some understandably are archaic such as Java support, Flash version, Screen depth (eg 24bit), so their loss is not a problem to most. 
- One environment parameter that seems to have been dropped between UA and GA4 is `&vp=` - viewport size. Is is different from `&sr=` screen resolution because it reports the size of the canvas the website is drawn in, not the size of the whole screen. On mobile devices the difference is pretty minimal - probably the height of the buttons in your browser interface, but on desktop it could be a big difference as people view sites in windowed browsers that could be a fraction of the real-estate of a 4K monitor. Google Analytics UA never revealed viewport size data in standard reporting, so I guess that's why it hasn't been carried over to GA4. But it seems a strange ommission - to a front-end designer/UX/developer, both numbers are useful for analysis - removing a useful dimension that you never exposed, therefore no-one used, seems the opposite to a logical decision.
- a few parameters that we were missing were essentially analytics for GA, like the SDK number and a versification code. Neither of them will effect your results.
- It's interesting that one thing that both URLs sent were hashes of the GTM config id - I'm assuming the original UA event sent a hashed id of the GTM container in the client, whereas the split event overwrote that with one describing the GTM server-side container. Either way, they won't affect your analytics.
- there always seems to be the parameters that no one on Google seems aware of, `&_z=`,  `&_r=`. They could be marketing info or they could be internal analytics, it's hard to tell.
- and then there's marketing parameters

## The problem with marketing

This is the nail in the coffin for our clever plan, but it might not be the case forever, or for you. When comparing the POST urls for the original UA page vew and our split version, a few parameters jumped out:

1. `&a=`
1. `&_gid=`
1. `&jid=`/`&gjid=`
1. `&xa-ga-mp2-...=`

The first few are a mix of adsense and doubleclick links in GA, whilst the `&xa-ga-mp2-...=` parameters are ActiveCampaign email links which might have been added by our Salesforce Cloud Integration. These are all generated because of links to the martech stack added to the GA UA property by our marketing department.

What they do precisely and what would happen if they were removed is a bit unclear to a non-martech head like myself, but after talking with people in the know, the answer was "nothing good" would come of it. We needed the parameters to link across to out marketing platforms and report on effectiveness, so removing them was not an option. The alternative solution of switching these GA connections across to GA4 was also a non-starter - as with most things GA4, the solutions are _not quite ready_. We could look into moving some of these systems into GTM server-side, but that would also take marketing lots of time to understand what they could and couldn't achieve, what was ready and what would break, so that too was not an option.

Or not yet.

## Conclusion

So our brave battle plan falls as it meets real action (twas ever thus). Until Marketing can find a solution for movign away from UA, we will have to continue to double sending GA/UA and GA4 events from the client, which as an ex-front-end dev interested in #webperf, feels a bit icky.

If Marketing solutions are ready in GA4/GTMS and our team move to them, we could consider this plan again, but at that point we'd hopefully be much closer to switching off UA altogether, so there might be no point.

But - and this is a big but - our situation _might_ not be your situation, and that's why I've left this article here, in case you might find some value in this method of sending to two generations of GA analytics from only one analytics stream.

