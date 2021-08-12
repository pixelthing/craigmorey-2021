---
title: Making GTM better
description: A few tweaks from Google would really improve my day.
date: 2020-05-20
tags:
  - analytics
  - googletagmanager
layout: layouts/post.njk
hero: 2020-05-makinggtmbetter
---

:::aside.aside--update
### 2020-10-24
GTM now has a brand new Tag Assistant workflow that touches almost every part of the GTM UI. It definitely addresses some of the fundamental problems I saw, but other smaller fustrations remain. Progress!
:::


Google Tag Manager is a strange beast. Its purpose is essentially abstraction -- to provide a layer between a website and multiple types of site measurement. It’s been used brilliantly, loosely, badly and plain-old abusively in many cases, but it is trying to make it possible for non-developers to (for instance) be able to quickly set-up Google Analytics tracking on a button, as well as experts to set up more in-depth measurement. But like all interfaces that try and simplify things without losing complex functionality, it can quickly dissolve into very domain specific language that seems unintelligible from the outside.

And that’s where I am at the moment, using GTM to try and build logical tags of reliable data from horribly un-semantic, React-built spaghetti-code web sites that needs lots of custom JS in GTM to interpret them.

Because I was a front-end developer in a previous life with some UX background, I understand that no UI/UX is perfect and there is always more that you learn the more you fix it. I’d like to think I could make a few suggestions to the GTM team at Google that would make my day (and hopefully yours) much easier:

- Having a "preview" button in a tag/trigger/var panel (plus a "save" button in the expanded code panel) would save a huge amount of time in the round trip of trying to build or debug something (see below). The current roundtrip for doing this is an unnecessary cognitive load, I often get back to the tagged page and wonder what it was I changed because of all the steps I’d taken since I’d made the change. Plus it’s a huge time-sink when you multiply it by the many, many times a day you have to carry out a round trip. Imagine a button saving 30 minutes off your day, every day -- that would be worth celebrating.

https://youtu.be/F6sPK9tOUC4

The edit-preview-edit round trip (sorry, you’ll need sound -- haven’t captioned it yet)

- Similar to the above -- I really like the orange banner that reminds me I’m in preview mode -- it’s good use of "ugly" UX (forgive me -- I mean "in your face" is not often pretty, but it’s useful). But I can’t count how many times I have been looking at a tagged page and have been confused as to why some tag isn’t working, before wondering if I actually refreshed the preview state or not. I’d suggest making the preview button and refresh link aware of the status of updates, as below:

:::picture 2020-05-making-gtm-better-1.png
The preview button and preview refresh link if no changes since the last refresh.
:::

:::picture 2020-05-making-gtm-better-2.png
Suggested preview button and refresh link style if updates have been made and not yet previewed.
:::

- Could the debug panel in the tagged page also be made aware of changes that have been previewed, and even have an optional setting to hot-reload the page if the preview is refreshed?

:::picture 2020-05-making-gtm-better-3.png
Suggestion for the a "reload" button in the debug panel to be aware of preview refreshes, prompting you to re-load the page to see the update.
:::

- Working on laptop screens means a lot of scrolling up and down to click on the "preview" button, and then down a long list to try and find the tag or variable you were working on. I’d debate that the preview button should be sticky to the top of the window, even if it does take up a small amount of screen space. Suggestion: a height-based CSS media query resulting in relative positioned preview button/bar up until about 500px viewport height, and then position:sticky for any taller. This would not steal space from the smallest viewports but provide a better UX for most laptops.

- Alternatively, or additionally, to the above point, highlight the last tags, triggers and variables you were working on in the lists (eg, a yellow row highlight, as below) to reduce cognitive load when scrolling through a long list and assisting you to quickly return to the items you are currently editing.

:::picture 2020-05-making-gtm-better-4.png
Highlighting items that have recently been updated to make them easier to return to in a long list.
:::

- Really important: In lists of tags/triggers/variables, I wish columns remembered the way I sorted them. When I’m at my busiest, I like the columns sorted by "last edited" -- that way I can see the items I’m working on right now. But I have to click the column twice every time I come back to the list because they always return to ascending name order. And honestly -- about those two clicks -- I’d debate there are more people who are developing tags and want to see the latest tags first (and so first click should be latest first), and less people trying to root out old tags (as is currently, with first click resulting in oldest first). But I’m hoping Google could correct me on that by consulting their own metrics of GTM usage.

:::picture 2020-05-making-gtm-better-5.png
I wish every time I came back to this list, it was still sorted as "last edited first".
:::

- The two tables of variables. Having them split into "Built-in" and "User defined" (as below) still confuses me many times a day -- I often search for the variable I’m working on in the top table, and then realise my mistake and have to do it all over again in the bottom table -- because that’s the chemical memory I have learnt from the other lists. I’d debate the benefit of splitting the tables at all. They could be just be mixed up together and then we can have another column for "built-in/user" (and an icon, text boldness or text colour could also discriminate clearly between the two types). If the difference between the two types was of utmost important to an GTM dev/admin, you could sort by that column -- and if column sorting was remembered (as in the point above), that would essentially give you the same UI as you have now, only as a user setting instead of a default.

:::picture 2020-05-making-gtm-better-6.png
The Variables panel -- split into "Built-in" and "User-defined". My nemesis.
:::

- The trigger list has a column for "number of tags using this trigger" (see below). Please, please could we have a similar column in the variables list ("number of times this variable is used") -- it helps us clean the vars as we prune older tags, and sweep up discarded vars whilst we are developing new tags. It would also help us understand quickly if we were using more built-in variables than we needed.

:::picture 2020-05-making-gtm-better-7.png
The "usage number" in the trigger list. Could we have this in the Variable list too?
:::

- Having a name search across all tags/triggers/vars. Often I’m developing tags which work in concert with triggers and vars, so I name them in a similar way, eg "accordion-click-tag", "accordion-click-trigger". But to see them all, I need to go into three different panels (tags, triggers, vars). You might say that they would all appear together in the "overview" panel, but thats only the case if I’ve made changes to all three of them since the last deploy.
Search (and even at a push -- replace) across all content in text fields & custom JS. On a regular basis I know that I have already built a method somewhere in my workspace, but I’m not able to find it without opening up lots of tags or vars. We can see from the amazing job GTM does with tokenising and auto-replacing var names in our custom scripts that the content is indexed, so could we search that index as well?

- Copying and pasting from the data layer in the debug panel. You can’t, and it’s a real pain:

https://youtu.be/dJmlalz4Yks

- I love that I can be editing a tag, click on the trigger at the of the panel bottom, edit the trigger in a slide-over panel, then return instantly to the tag. This is how the slide-over panel UI of GTM really wins. But so often I’d like to have the same ability to do this with moustached variables in text fields or in custom JS. Consider the one below. Sometimes I’d simply like to check what {{ENV -- car}} actually is, and sometimes I know I’ve got to edit it before I save this tag. But that means closing this tag (often in a half finished state), loading the list of variables, finding the variable you want, opening it, reviewing or editing the var, saving it, loading the list of tags, finding the tag you want, and finally reopening it in a new panel. That’s quite a round trip -- considering if I wanted to review the trigger for the same tag, I’d just click it then close it. My suggestion is a contextual menu to open the variable in a new slide-over. All the code to build that UI is in the GTM web app already. Quickest UX win ever.

:::picture 2020-05-making-gtm-better-8.png
I wish I could inspect {{ENV -Car}} without spending the next two minutes clicking buttons.
:::

- Here’s a real loopy idea. Tabs. So you can work on the tag, trigger and vars all at the same time, without having to jump between panels. I know it’s probably a UI convention that doesn’t work well with the "endless slide-over panels" UI that exists in GTM -- and maybe the previous point would reduce the need for it -- but just consider the workflow efficiencies. Some of us are working around this already with multiple tabs in the browser -- and that can only lead to bad syncing and state problems.