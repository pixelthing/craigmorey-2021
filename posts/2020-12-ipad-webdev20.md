---
title: Web dev with an iPad in 2020
description: A brief update on what you can get done with iPadOS.
date: 2020-12-30
tags:
  - webdev
  - ipadpro
layout: layouts/post.njk
hero: 2020-12-ipadwebdev
---

At this time of the year I normally go deep on what’s changed if you’re a front-end web developer with an iPad. This year, I’m not going to do that, largely because I don’t have a set-up that’s representative of a 2020 iPad Pro (I have a 10.5”), but also because this year of all years, I think I’m justified in taking time off over the christmas holiday and not spending it explaining every possible workflow. 

But 2020 - despite feeling like a flat curve of time - has been surprisingly busy in the iPad world. Here are some highlights that effect you as a developer with an iPad in the hand.


### iOS13.4 & Magic keyboard
I know that iOS14.4 is already appearing as a Public beta, but it was only back in March that the previous point4 upgrade dropped with the largest change for Pro iPads since the pencil. We received pointer support and (eventually) the Magic keyboard, which further blurred the lines between MacBook and iPad, both in functionality, and - for some - less favourably in portability.

> Text workers such as us developers could stop smudging our fingers at a screen, hoping for accurate text selection

Instead, we could finally position a cursor accurately. Plus the magic keyboard was a quantum leap over the previous fabric design (if you don’t mind the reduction in crumb and liquid protection), and came with a killer trackpad built in, on top of a unique design.

The innovative cursor morphing felt very iOS, but it had split reviews. Apps supported the new pointer in slightly esoteric ways - not surprising considering the many ways text selection has worked in only a short period of time on this platform. But I don’t doubt that this is the single biggest - and most unexpected - Pro iPad upgrade this year.

### M1 Macs
The M1 is a watershed for Macintosh. But it’s also probably a turning point for iPads. Will the next iPad Pro have an under-clocked M1 8GB under an “A14X” moniker? If future Macs get a touch screen - seeing as they already run iOS apps - do MacBooks get to be an iPad Pro Pro? Will having M1 compiled pro apps on MacOS increase the amount that make the jump to iOS?

**But the big point this makes is that MacOS isn’t going anywhere**, and the Mac’s positioning as “the truck” (in Steve Jobs parlance) compared to iOS’ “car” is not changing. M1 Macs finally made it clear that Apple is never going to ride to the rescue and suddenly make the iPad an open, developer-friendly platform - they already have a roadmapped platform for that. So this is it, some small incremental improvements in the environment and ow volume third party apps are what you’re getting. iPadOS is finally becoming a neat secondary dev platform, but forget the idea that it could ever be anything more.

However, could there be a meeting point in five years where the two OS’ merge (in some sense), even if the hardware stays on two tracks? Well, the M1 definitely makes this more - not less - possible.

### iPad Air 4th gen
All agreed that the iPad Pro 2020 was a very mild tweak of the two year old 2018 Pro. So the big upgrade in 2020 was the iPad Air. If you can live without the 120Hz screen and FaceID, it’s basically the 2020 Pro, but 40% quicker in single core and only 10% slower in multi-core. And you could throw in another basic iPad on top before you get to the price of current Pro. 

If you can find an original 2018 Pro for a good price - and there’s still a lot out there - it’s a much closer run thing. But it’s a good sign that the Pro experience is continuing to move down the range, and that the 2021 Pro has got to raise the bar again to justify its price.

### Code by the Baselab
This is the app surprise of the year for me. It started as a simple enough little playground project - lets take the interface of VSCode and see if it can be reproduced in SwiftUI. But with continual updates, it has progressed in nine months to the point that it’s pretty damned close in core functionality to it’s role model. It has intellisense style hints & suggestions, a command palette, and code running options including node.js and python. There are still some problems that need attention, but this could be the star of next year’s IDE crowd at this rate - it’s certainly got my attention.

:::picture 2020-12-ipad-webdev20-1
Code app by The BaseLab
:::

### PlayJS 2.0
Play.js 1.0 was innovative and quirky, but more importantly was the only way you could build a node.js or React project on iOS. This year, a complete rewrite resulted in v2.0, ironing out a lot of the quirks and adding a whole lot of functionality. Between enabling vue.js and next.js projects, to having the best devtools outside of inspect browser, Play.js has grown beyond expectations in 2020. Every aspect has improved, but the biggest thing you notice is that it fits together better, and looks and feels like a top tier iOS app. I even like that it has in-app optional tip payment - if you buy and use these apps over years, there’s no better way to say thanks for the updates.

:::picture 2020-12-ipad-webdev20-2
play.js
:::

### The Apple store small business program
Almost all the apps mentioned in this article are from one-person or small-team developers. A large amount of these teams only build apps as a side-job, because the volumes just don’t make full-time app development financially viable. With the advent of the small business program (which reduces Apple’s cut from 30% to 15%), the developers effectively get a 20% pay rise. That might not make them rich, but it might mean it’s worthwhile to carry on maintaining these apps, or even devote more time to them - and surprise us all with the results. 

## Honourable mentions

### Working Copy
Still the hub of any source control project on iOS, this year the git client/IDE gained loads of functionality including stashing, large file support, direct file editing in Textastic, and a reliable way of running background servers (yay).

### Shellfish
The other essential app from Andreas, author of Working Copy, Shellfish pivoted in 2020 from being “just” an invaluable file provider for ssh and sftp connections into also being one of the most extraordinary ssh clients on any platform. Drag-n-drop files from a shell? Shellfish can do that.

### Textastic
Textastic remains the best all round IDE on iPadOS, it’s mature, well integrated and has just enough functionality to deal with most types of work, without having too much to get in the way. This year it can now work in multiple windows and became even closer integrated with Working Copy.

### Serveeditor
Last year I got deep into installing VSCode onto a remote server to use it as an IDE on iPad, and since then someone has made it exactly this process into a Native (well, ish) app, including a subscription to the server so you don’t need to do a thing. And it works pretty well. Not all of the problems with using a remote application in a local setting are fixed - or could be - but at it’s core it really is actual VSCode running on an iPad, and that’s impressive.

### Inspect browser
Still the best option for web devtools on iOS, and still coming out with additional functionality and interface updates. Building an entire browser just so that you can add devtools to it is an insane amount of work that you undertake only if you didn’t realise how much work was involved when you started - support them as much as you can so that they continue on this crazy quest that is so essential to any web dev on iPadOS.

:::picture 2020-12-ipad-webdev20-3
Inspect Browser
:::

## What we still need

It seems almost unbelievable to me that only a couple of years ago, I was clutching for the basic apps to do some part of my job on an iPad. Now almost all of those holes have been filled.

It’s at a point where the solving of the major blockages just throws iPadOS’ fundamental workflow quirks into sharp relief. And the main one is the the same one I had three years ago;

**_iOS is ruthless at killing background processes._**

iOS works quite differently from MacOS - it was built for limited CPU, limited memory and minimal battery drain. As such, iOS is built around being super efficient at saving an app state to storage when you leave it for more than a few minutes, then re-hydrating it when you return - so quickly that you barely notice it. This works great for your native photo editing app, but it’s not so good for many electron or webview-based apps, and just impossible for running dev servers unless you keep them in the foreground continually.

> We need to have an API that allows at least some part of them to run in the background.

If we want to run dev servers or node toolchains in apps like Play.js or Working Copy on an iPad, we need to have an API that allows at least some part of them to run in the background. Hacks like pinging for location to prevent the app being killed must be replaced with a better solution. Music apps like Spotify have had an exception to allow background processing for years, and we need it now.

The other solution is the least talked about iPad Pro update of 2020 - 6GB of RAM. Even with the 4GB on my 10.5”, flicking between heavy web apps has tabs reloading because they were purged from memory after only minutes (thereby losing scroll position, page state, text caret position and even login tokens). More memory has always been the big difference between consumer and Pro computers - iPads are no exception - I’d love to see 8GB in the 2021 Pro.

---

Of course we could still do with a real command line. A sandboxed environment - possibly virtualised now that iPadOS allows that (and the M1 even has accelerators for it). Come on Apple, ISH and aShell show the way - let me run straight nodeJS on your Pro devices.

Just to put the cherry on the top, Docker, Homebrew and countless other packages are being compiled at this moment for the M1 - which is essentially an iOS A14 chip with some extras. If Apple just provided the iOS sandbox for them to play in...

---

Devtools are absolutely essential to the web development process and it’s still not possible in Safari on iPad unless you connect up to a Mac. Apple don’t look like they’re going to suddenly include devtools in Safari on iPadOS - so we have either the do it ourself option with apps such as Inspect Browser, or the hope that Apple will eventually allow other browser engines onto the platform, so that big vendors such as Google or Firefox have the opportunity to fill the gap. Even that is a hope on top of a hope (Chrome doesn’t even support devtools on Android, even if it does on ChromeOS), but I still feel that Apple will have their hand forced by regulators to open up to other browsers at some point.

---

The 12.9” iPad with Magic keyboard is the same weight as a MacBook Pro. The 11” is much more portable but screen space is really tight to work off for any period. What I want is to have real monitor spanning in iOS, not the half strength support we currently have. With pointer support in iOS, we don’t need touch monitors, in fact any USB3 screen would do. We know the GPU can do it. We just need the support in iOS.

A super compact, powerful computer on the go, and a large screen experience at the desktop.

---

Have a good 2021...