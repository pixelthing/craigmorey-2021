---
title: 2019 iPad Webdev: Panic Coda/AWS
description: 
date: 2020-01-06
tags:
  - ipadpro
  - webdev
layout: layouts/post.njk
---

> Be sure to check out the 2020 version of front-end web dev on iPad.

> This is part of a review of the front-end webdev scene on iPad in 2019, detailing different methods to code in iPadOS. For the full list and more, click here

[Using GoCoEdit 16.1](https://gocoedit.app/)

What an extraordinary conundrum GoCoEdit is.

It’s about as far from a conventional iOS app as it’s possible to make, but it is one of the most complete native IDEs -- in terms of features -- there is on the platform.

In truth it’s a clever combination of hundreds of hours of work and several different OSS libraries -- primarily [Codemirror](https://codemirror.net/), a mature JS based code editor (and don’t snigger, it’s used in Chrome & Firefox devtools, plus [Brackets](http://brackets.io/), [Codeanywhere](https://codeanywhere.com/) and [Jupyter](https://jupyter.org/)).

GoCoEdit’s interesting take on UI. Are those buttons wrapped CSS flexbox?

This OSS base is possibly one of the reasons the app feels so un-iPad-like. The file-list sidebar looks more like a Java app than an iPadOS one, with very few gestures anywhere (there’s no swiping items in lists, for example), dialogs and menu items are in unusual, uppercase, non-rounded rectangles, and every piece of UI is in a very un-iOS monospace font. I almost discarded it as a hobby project before I gave it a chance, because I mistakenly interpreted "different" as "amateurish".

But I’m glad I did give it some time, because it has masses of thought put into it’s workflow, and lots of hidden depths.

Despite not looking like the usual sidebar, it does support OS level file drag and drop, allowing you to copy folders directly into (and out of) it. Dragging folders from the "files" app into the file list works fine and you can drag them into the "external" heading, but they don’t seem to be "edit in place" because if I make any changes, Working Copy doesn’t recognise them, so the files must have been copied -- not linked? It could just be a mistake that you can drag them into "external" at all.

"Edit in place" is definitely available in the "open from" option at the top of the file sidebar, and it correctly allows me to edit files in a checked-out Working Copy repo and commit/push any changes back (In WC, not in GoCoEdit itself), painlessly.

GoCoEdit’s auto-suggest is spot on, here offering the correct symbols to a Vue.js object.

It also has keyboard shortcuts that have been thoroughly considered to keep your hands away from the screen, as well as a code snippet system that lets you speed up repetitive tasks. On top of that it supports Siri Shortcuts, including having it’s own x-callback hooks. This is an app that is obviously in heavy use by the developer, it seems to scratch so many specific itches, it can only be so.

The editor interface itself is one of the most full-featured anywhere on iOS. It has auto-complete that is not only accurate (closing the correct tag for instance) but auto-suggests from symbols in the page/script/style sheet you’re editing. Line breaks auto-tab the next line in a useful and predictable manner. The extra symbol keyboard is one of the most comprehensive and easiest to use, and has a mysterious "dot" in the middle that acts like the iOS13 draggable caret -- hold down and drag your finger and the text selection caret moves with your finger, double tap it and it selects the line.

That does bring us to text selection, which is closer to the custom style in Panic Coda than to the new standard style in iOS13. Holding your finger down on any piece of text brings up a rectangular magnified loupe of the text. The blue bars at the start and end of a text selection don’t have the customary dots on them (an iOS13 problem?), and the context pop-over when you select text doesn’t have a "select all" option, a weird omission. But’s easier to think that this is a keyboard driven app -- selecting a whole doc of code is easier with command-A.

Unusually for any iOS app, GoCo doesn’t continuously auto-save but requires you to tap "save" to commit a change to it (either by command-s or by tapping the tick-mark in the top right -- yellow is unsaved, green is saved).

GoCoEdit editing a project directly from Working Copy, with live preview in Safari on the right.

GoCoEdit has a built in preview flat-file web server, and also offers an internal browser to show the results of your code. The in-app browser is modal, so it takes over the screen, but closing it leaves you back exactly where you left the editor (not always the case in some editors). The browser has a very limited responsive view, and a console that at least displays script line references and shallow JS objects -- so not bad at all.

But GoCoEdit also lets you choose Safari or Chrome to preview in as well, and this is where it gets really interesting. Many iOS code editors can start up an internal web server that other browsers can use, but GoCoEdit uses the standard port 80 -- not random ports as with most other apps. This makes it easier to test oAuth based apps -- which often require a predetermined host and port, and is the single feature that has made it my go-to editor for the moment.

GoCoEdit previewing a page in Safari on the right. Note that the app’s action menu shows "Safari" with a lightning symbol, indicating that it’s in live-preview mode, so will refresh on every save.

The sugar on the top is the extra option of live preview. If you dock Safari to the side of GoCoEdit, you can makes changes to the code, and every time you hit save, the browser automatically reloads the page. If you keep Safari in the slide-over sheet, every time you hit save, Safari sweeps in from the right as it’s re-loading -- giving you instand feedback without stealing your screen space. If you switch to another app and then return to GoCoEdit, you will be greeted with a red toast saying "live preview disabled", but all it takes is hitting the "Safari" button in the top right action menu and you’re connected again.

I love this live-preview feature.

Of course, Safari has no devtools, so I’d love to see an option in GoCoEdit to have the same behaviour with Inspect Browser.

The custom button row in GoCoEdit. The centre dot moves the text selection carat, similar to a how a ThinkPad "pointing stick" works.

I find myself reminded of the early days of Sublime Text, where the user interface -- especially, as here, the file sidebar-- was so un Mac-like it made me cringe, but the utility of the application was undeniable.

If I had a 12.9" iPad I’d be tempted to be greedy and ask for vertical split panes so I could see two files at the same time (or multi-window usage as Textastic is working on), even if here on my 10.5", that would be a crazy idea. But the app is that productive that I’m almost beyond complaining about the basics and I’m starting to ask for more features. Multi-file search and replace would be good though.

Development of the app seems to be continuing with several updates since iOS 13, so I hope it will continue apace. But this is heroic effort from yet another lone talented developer (so give them a break). The approach taken in this app, of leaning on OSS libraries and bridging them with custom code has allowed it’s feature count to leapfrog some other IDEs in the short term (take tag-closing or auto-suggest as an example), although as iOS11/12/13 has proved to many apps, staying away from the standard UIKit way of building the interface can quickly leave you behind when updates break your code. I hope that’s not the case here, there is some real pro-level functionality in this app, mixed in with some of the latest APIs (iOS13 "edit in place", drag and drop, Siri Shortcuts).

It’s well worth the $€£10. And I don’t often say this, but leave a good review on the app store, it seems to be lacking a bit of exposure compared with the other IDEs.

I’m going to give it a go -- for a source controlled flat file project, it seems to be the whole package. It’s just… idiosyncratic.

### Pros
- Integrated terminal
- Internal server & browser for flat file preview, with live preview to external browsers.
- Access to remote cloud services (dropbox, Google Drive, Onedrive, FTP/SFTP)
- "edit in place" making it compatible with Git clients like Working Copy, and drag’n’drop copying in and out of the file list.
- 19 common themes (molokai, material, solarized, etc, plus the ability to make custom ones)
- Multi-caret editing
- Good tag completion and auto-suggesting from x symbols.
- Siri shortcuts with x-callback

### Cons
- "Unusual" user interface design.
- A little slow at returning to the foreground after iOS has killed it in the background.
- No multi-file search & replace.

### Links
- [Link to GoCoEdit website](https://gocoedit.app/)

> This is part of a review of the front-end webdev scene on iPad in 2019, detailing different methods to code in iPadOS. For the full list and more, click here