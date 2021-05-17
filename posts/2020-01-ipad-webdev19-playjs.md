---
title: 2019 iPad Webdev - Play.js
description: 
date: 2020-01-06
tags:
  - ipadpro
  - webdev
layout: layouts/post.njk
---

> Be sure to check out the 2020 version of front-end web dev on iPad.

> This is part of a review of the front-end webdev scene on iPad in 2019, detailing different methods to code in iPadOS. For the full list and more, click here

### Update 2020–05–28
Play.js 2.0 has launched and it’s a full re-write with many of the small annoyances that I mention in this article having been fixed. Plus Vue.js is now supported out of the box. [It’s well worth checking out](https://apps.apple.com/us/app/play-js/id1423330822#?platform=ipad), and there’s a short review in this [2020 article](https://link.medium.com/8PoMYziJLcb).

[Using Play.js 1.14.1](https://playdotjs.com/)

[Play.js](https://playdotjs.com/) is so close to being my holy grail of iOS webdev apps, and if you are a React front-end dev, it might well be yours right now.

It’s not just an editor, it’s a fully integrated environment that lets you run Node.js processes and install Node.js modules. Yes really -- this is the app [I have been imagining for several years](https://blog.usejournal.com/fe-webdev-on-ipad-pro-2018-c55283f01e4c).

Two windows of play.js, running the index.js in the left window, which spawned the internal browser in the right window with the results. And bottom left is the Node.js console.

But, it has some caveats. It curently has a specific focus on three audiences: Node.js app dev, React Native dev, and React webdev (which is currently marked as in "beta"). There is wiggle room to get some other projects working, but I haven’t had much success trying to get Gulp or Vue.js projects running.

The way Play.js works is a little unconventional if you’re used to working with front-end tooling in the command line, although if you’ve used [Pythonista](http://omz-software.com/pythonista/) on iOS it might be familiar. If your project has a package.json file and an index.js file in the project root -- you click on the play button, and the dependencies will download, and the script will run in an internal browser.

It’s almost magic.

Here’s the magic in action. Press "play" and the app installs the modules and runs index.js

This is running front-end tooling locally on your iPad without any use of a remote or Virtual Private Server (VPS), and without having to limit yourself to developing a flat file site. For this reason alone (plus if you want to develop server-side node apps), play.js has quite a faithful following.

The default project menu, before you expand it. do you know which is the right React project to run?

### In practice

I have to admit that although I do almost every type of Front-End development, building production ready projects in React remains a blind side for me, so my usage of the app is a little on the surface level. I’ll come back with a new review when it supports VueX ;-)

But it essentially does what it says on the tin. The test React projects that I’ve checked out from GitHub with Working Copy are easily accessed in Play.js with "edit-in-place". If the index.js file is in the root and it has a package.json file, pressing play installs the modules and runs the Node.js tool chain.


The file sidebar. The top directory with ".." goes up a level.

The file sidebar is esoteric by design, and having "back to parent directory" buttons as ellipsis’, it would probably appeal more to Linux junkies than strict [iOS HIG](https://developer.apple.com/design/human-interface-guidelines/) followers -- but that’s ok.

Apps that have their own file list style still have their quirks. When you add new files an folders, there is no affordance that they have been successfully added -- no toast, no scrolling the file list to them, no opening them for editing. In one session, I eventually found 27 new empty files I’d created without knowing, that I would have seen if I wasn’t working in a large project that required you to scroll to see files beginning with "N" for "New_file". Small stuff, easily fixed (I hope!).

The editor has come a very long way in a year. Building a code editor is always a case of re-inventing the wheel one spoke at a time, but it has progressed from one where the undo function was actually scrambling code for me, to one which feels like it’s aiming for the best of the best. Symbol auto-suggestion seems solid, as does tabbing and syntax colouring. There’s work to be done -- it’s not my favourite code editor on the iPad (yet) -- but the rate of updates leaves no doubt that more is coming.

The traffic-light close/minimise buttons (echoing window controls in OSX) make me smile, but I wonder about the utility of any buttons you have to click twice -- once to enlarge them, a second time to use them.

The Git controls in the sidebar. Also note the traffic light buttons.

Unusually for almost any iOS code editor (please tell me if I’m wrong), it has great Git support, allowing you commit and push from within the editor. The benefit of which becomes apparent next.

Leaving the app will sometimes have iOS killing it from memory -- mainly due to memory pressure I guess. Which is a shame not just because Play.js has to then reload when you return to it, but often because it can’t auto-load the project you left it with. So you have to navigate to the project and file you were working on. The answer to this is of course to try and stay in the app and not leave it-- and the author has done amazing work with adding consoles, browsers and Git support to reduce the need to leave the app.

The in-app browser (that cleverly opens itself in a new window docked to the side of the code) doesn’t have any special functions apart from having a button to load the same page in an external browser (Safari). I wish we could specify the browser to load the results in -- being able to use [Inspect Browser](https://apps.pdyn.net/inspect/) would instead would help a great deal with debugging.

The project/app list (default view).

If I’m honest, the most confusing part for me is the project menu. By default it’s a row of unlabelled icons. You can optionally expand them to be a grid of labelled icons. I thought I was colour and icon orientated, but I still can’t get used to remembering if it was the pink or the red React project I wanted to load.

The last thing to mention is that all the example React projects in the app have the code commented that watching has been disabled due to memory constraints. Having a tool chain that isn’t able to live-reload code when a change occurs is a pain -- but I wonder if this is set because Play.js follows the iOS convention of not having a "save" button, but auto-saving on every key change. Certainly, adding watchers back in crashes the app after some quick code edits. I wonder if this is why GoCoEdit is the only IDE that does live-preview -- because it’s also the only IDE that asks you to physically click "save", so isn’t trying to update all the time you have your hands on the keyboard.

### Pros
- One iPad is all you need to run and develop your web React project. No servers, no cables, no extra computers. Online or offline.
- And you didn’t even have to type npm i
- With built in Git, you can pull and push changes without leaving the app. I can’t think of another iOS native IDE that does that.
- It’s definitely trying to look at a traditional command line bound problem and solve it in an innovative way.

### Cons
- The type of projects you can use it for are narrow in breadth (but they are very popular types of project -- React native, React web, Node.js)
- Still developing in lots of ways (functionality, UI, stability). But high goals.
- Probably not as ultimately flexible as a real Linux server.

### Optional extras
- Add a [continuous deployment (CD) workflow with Netlify](https://medium.com/p/ed9eb66579ec) to deploy to an external staging server once you’re happy with your work, just by committing your changes with a branch (or doing a merge). And you can even do that in Play.js itself, you don’t even need to fire up a Got client.

### Links
- Link to Play.js

> This is part of a review of the front-end webdev scene on iPad in 2019, detailing different methods to code in iPadOS. For the full list and more, click here