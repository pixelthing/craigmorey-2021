---
title: FE webdev on iPad (2019)
description: Not there yet. But there's hope.
date: 2020-01-05
tags:
  - ipadpro
  - webdev
layout: layouts/post.njk
hero: 2020-01-ipadwebdev
---

:::aside.aside--less
Be sure to check out the 2020 version of front-end web dev on iPad.
:::

What a difference a year makes.

Last year I lead the 2018 round-up by saying that I could not recommend iOS for doing front-end web-dev unless your project fitted a very narrow list of criteria. A year later and that list of use-cases is not only wider, but the work you can get done is far deeper. We’re getting there.

What has changed has been a combination of things. iPadOS has – for sure – solved a lot of the fundamental problems that previously infuriated the simplest of workflows. But apps (almost exclusively one-person indie apps) have been incrementally developing to fill the gaps, and the innovative workflows discovered by iPad users have been pretty amazing.

Don’t be fooled – if I was coming to this platform for the first time as a professional web developer, I would still find iOS extremely limited and frustrating. But having seen where we’ve come from, I’m much more positive about the future.

This is a journey that – as yet – still has no clear destination. But it’s getting more pleasant by the month.

:::picture.post__img--wide 2020-01-ipad-webdev19-1
GoCoEdit and a Brydge 10.5" (the best keyboard for using on your lap)
:::

### Hardware
In 2019, the regular iPads have essentially jumped a tier. All non-pro iPads are now different price-point compromises of the old 10.5" pro, with out-of-the-box keyboard and pen support. The 2019 iPad Air in particular is a Pro in all but name, but they are all "real-work" ready.

In the iPad Pro range, the top-end has remained unchanged. Or has it? Because the promised USB-C ecosystem is finally emerging and has collided with the new iPadOS. You can now plug your iPad into 5k monitors, hard drives, mice, microphones, USB-sticks, Raspberry Pis, plus a multitude of cheap, powerful, compact power supplies. And with either store-shelf or iPad-bespoke hubs, even with several peripherals at the same time. Your year-old iPad Pro had a free hardware upgrade in 2019.

:::picture.post__img--wide 2020-01-ipad-webdev19-2
Felt iPad carry case with dongles (HDMI, USB3.0, SD card) and Moko foldable stand.
:::

### iOS is forked for the iPad
iPadOS13 made the biggest difference to our ability to get things done this year. We’ve already talked about how the USB-C IO upgrades were nice for those with the latest iPad Pros. And the files app finally understands that you need to get files on and off your iPad in multiple ways. So many smaller details have made life easier for a developer, from the icons not re-arranging on rotating the screen, to Siri shortcuts being supercharged, to no-lag text selection, to keyboard commands everywhere.

But the biggest plus is the new Safari, not just purely for it’s "desktop class browsing" but because of the multitude of online tools that this has enabled. From [Jira](https://www.atlassian.com/software/jira) and [Google Analytics](https://analytics.google.com/) to [glitch.com](https://glitch.com/) and the hosted version of Visual Code, it’s made the iPad exponentially more capable. It’s like suddenly getting 80% of a ChromeOS tablet on top of your iPad.

Not everything is super rosey. The multi-tasking is powerful but cognitively taxing. The sandboxing means that apps still have to jump through crazy hoops to work together in a logical way. Background processes are still killed ridiculously early. iPad Pro RAM is unrealistically low compared to the cheapest of laptops. The command line is still _verboten_. App Store rules are still vague and punitive.

:::picture.post__img--wide 2020-01-ipad-webdev19-3
A reminder to myself.
:::

### One browser, and still only one
One thing that didn’t change this year was the range of browsers on the platform. WebKit is still the only rendering engine available on iOS, Safari still has no devtools and you still can’t have Safari Technical Preview on iOS.

:::picture 2020-01-ipad-webdev19-4.png
:::

The [Google engineer Alex Russell](https://twitter.com/slightlylate) has strong views on Safari and iOS – and a lot of fan boys (like me) can get twitter-rage as a response. But although I might not always agree, I like Alex. Not only is he smart but he backs up points with data, and that should always deserve your consideration, whether you agree with his conclusions or not.

And on one point, Alex is always right. Having one browser engine on iOS is a mistake. Quite apart from being an anti-trust suit in the waiting, the entire web capability of the platform is locked down to the decisions made in a single meeting room in Cupertino. Fairs fair, that weekly backlog meeting of project managers pretty much delivered the mobile web -- fully formed -- back in 2007 and has continued to push it forward. But now it’s time to let others have a competing voice.

If we also had Chromium on iOS, we wouldn’t be celebrating finally using "real" GoogleDocs in 2019, because we’d have had it years ago. We might also have 4K YouTube and devtools. And so would Safari, probably (because; competition). All of that would mean selling more iPads to pros. And Safari would still rule for most iPad users because even for a default it’s capable, fast, has low battery consumption, and it’s the webview in every single social app that you own. Do it, you cowards (it’s a meme, I don’t really talk or think like that).

:::picture.post__img--wide 2020-01-ipad-webdev19-5
We live in an imperfect world. The 9 month old crack on my 10.5". At least it’s undetectable by touch over most of the screen. Here’s hoping the 2020 iPad Pro is coming soon.
:::

### Methods to develop sites on iPad
Enough of the fundamentals. Let’s take some apps, some projects in source control, and mash them up into a workflow.

There are plenty of apps that carry out individual parts of a developer’s workflow just fine. This – after all – is how you often string together a workflow on a desktop OS; an editor, a browser, a git client, a server, etc. But iOS constraints mean single-function apps are often not productive. This is because if you need more than two apps in your flow, one will need to be in the background – at least part of the time – and background apps are killed ruthlessly after 3 minutes. This has lead to apps often having second or third talents that are best not to kill unexpectedly; for example editor apps having a terminal, or web server, or most often – both. It means one or two apps can stay in the foreground whilst they carry out the functions of many.

Killing background processes is an artificial constraint of the OS – iPads are no longer the resource constrained devices they used to be, so it would be good if Apple allowed more categories of apps to remain in the background in some way like audio apps can.

Next we also need apps to open files via the OS level "edit in place" API so that an IDE can work directly on files in a local repo (and just to be difficult, this API changed in iOS13, so any app that previously supported it needs an update). I consider this the basic requirement now of any pro app.

:::picture.post__img--wide 2020-01-ipad-webdev19-6
Microsoft VS Code running plug-ins on an iPad? Well, yes - kind of.
:::

The following list of workflows is absolutely not a prescription for the best ways of working, or even to scratch the breadth of ways to do front-end web development on an iPad. Like last year, consider them recipes – a little light inspiration to consider remixing to your own taste.

And because they deserve they’re own space to understand their pros and cons, each is linked to their own article or screencast.
- Working with a remote server or Virtual Private Server (VPS)
- One way to get around iOS not running a a command line and a front-end tool chain like Node.js, is to work with a server hosted elsewhere. This results in workflows that are based around a remote server or a VPS.
- Full review: VPS, Microsoft VS Code (Hosted version), remote Git
- VPS, Emacs, remote Git (I don’t have much to say apart from use Blink and Mosh, they’re awesome)
- Full review: Continuous Deployment with Netlify, Github hooks, Working Copy, Textastic
- Full review: AWS S3, Panic Coda
- Screencast from 2018: VPS, Working Copy, Textastic (using Textastic to manually-upload)
- Screencast from 2018: VPS, Working Copy, Textastic (using Working Copy to auto-upload)

:::picture.post__img--wide 2020-01-ipad-webdev19-7
Raspberry Pi 3B+ with Anker 10Ah battery pack. Pilot biro grip on the Apple Pencil.
:::

### Working on a semi-remote server
- Full review: Raspberry Pi as a replacement for a VPS.
### Working fully local on the iPad
- Full review: Node.js/React: Working Copy, Play.js
- Full review: Flat websites: Working Copy, GoCoEdit
Screencast from 2018: Flat websites: Working Copy (preview server), Textastic
- Screencast from 2018: Flat websites: Working Copy (webDAV server), Textastic
- Screencast from 2018: Flat websites: Textastic (preview server)
- Screencast from 2018: Flat websites: Panic Coda (preview server)

:::picture.post__img--wide 2020-01-ipad-webdev19-8
MacBook Pro 13" 2014, MacBook Air 2019, MacBook Air 11" 2011, iPad Pro 10.5". Which is fastest?
:::

### Honourable mentions
There are a few other apps that have caught my eye this year, and are worth mentioning. I’m sure you could probably add many more for particular areas you work in – for instance there is a huge range of dedicated GitHub apps that let you monitor pull-requests and the like, documentation apps like [Dash](https://kapeli.com/dash_ios), and full IDEs for languages such as Python ([Pythonista](http://omz-software.com/pythonista/)) and PHP ([Draftcode](https://solesignal.com/draftcode/)).
- [Working Copy](https://workingcopyapp.com/): still the best Git client on iOS, thankfully the most accomplished at integrating all the latest iOS APIs, because it’s the hub of most web-dev work on the iPad.
- [Secure Shellfish](https://secureshellfish.app/): from the developer of Working Copy, it makes SFTP servers appear as if they were just another drive in your Files app (or your app file picker).
- [Inspect browser](https://apps.pdyn.net/inspect/): The closest thing to Chrome dev-tools you’ll get on iOS, and getting closer all the time.
- [Termius](https://termius.com/), [Blink](https://www.blink.sh/): Termius is the SSH tool for cross platform pros that prefer a GUI. Blink is for the genuine command line geeks who never want to see as much as a button, and is freakishly good at keeping a Mosh connection open -- it defies explanation.
- [Kodex](https://kodex.app/): A great standalone code editor. It doesn’t really fit any of my work (yet), but it’s has promise.

:::picture 2020-01-ipad-webdev19-9
Play.js running a web React project, with it’s browser showing the result on the right. This really is Node.js running locally on iPadOS -- a major step forward.
:::

### What we’re missing
Play.js might have finally brought Node.js and React (web) development to iOS, but it’s not (yet) a replacement for other tool chains. There’s still no way of locally running Gulp, Grunt, Rollup, Vue, Docker, K8s, etc, on an iPad, and that’s a lot of holes. If you need any of these, you’ll currently need to think about something like a VPS.

In the IDE apps, we’re still missing the basic capability of multi-file text search/replace. After all, the hardest task in programming is naming things. The tag-complete/auto-suggest is of variable quality across IDEs and app extension systems will not get traction on the platform if it remains this small (Coda had one, unfortunately it didn’t have many plug-ins).

All of the above things do exist in the hosted version of VS Code, as detailed above, largely because it all happens remotely on a Linux server. However it also comes with its own drawbacks – not least not currently having any keyboard shortcuts.

But at least we’re getting there in the IDE space. When it comes to Browser developer tools, we’re still a way off. The great [Inspect Browser](https://apps.pdyn.net/inspect/) is still gaining new functionality steadily, but we’re still a long way from having the same insight into what a web page is doing like we have on desktop. In particular, we’re missing perf tools, heap measurements, JS debugger, indexedDB storage viewing, PWA tools, code line references in console logs, and more.

:::picture 2020-01-ipad-webdev19-10
Don’t feel locked into landscape mode -- the iPad is more flexible than that. (Textastic on screen)
:::

### "the iOS way"
Apple still doesn’t appear to see the web development industry as part of the "Pro" in iPad Pro. They continue to lay obstructions that discourage web developers to do much more than dabble in iOS. This is never better demonstrated than by Carlos Vidal, the author of the Play.js app where he describes the struggle to build a web development IDE, with NPM:

> On top of this, in an attempt to support most of the npm features, Apple threw away the work of two months by rejecting the binary and asking me to go back to the drawing board and offer that experience "the iOS way". (footnote 1)

Play.js is the closest thing to a local Node.js/NPM environment on iOS, and does it in a way that’s very far from carrying out `brew install` and `npm i` at a bash prompt. Write a package.json file, hit "play" and it’ll do the rest – it’s as close to the iOS way as you could be with a Node.js project.

The positive person in me says that this hard-arse stance has actually led to new ways of looking at workflows that we never even considered reevaluating before. Play.js is the embodiment of this.

Alternatively you could ask what the kind of direction is that to give. Leaving enigmatic platitudes that provide no guidance as an epitaph to months of work is not exactly going to inspire a generation of after-work app developers to enable a thriving industry and – in conclusion – sell more iPads. "Help us to help you", I would plead to Apple.

:::picture 2020-01-ipad-webdev19-11
On the charger in our hall. its just a bread bin with some holes and a three-way socket inside.
:::

### Conclusion, and the question remains.
So with all this hassle, let’s be honest, making iOS a webdev platform is still pushing at boundaries that don’t necessarily have a need to be pushed.

The latest generation of powerful ultra-light notebooks with familiar desktop OS’s (Windows, Mac, Linux) would allow you to drop your existing workflow straight into a more portable world.

Microsoft Surface (or similiar) devices would give you a transformable tablet that had a heavyweight OS. [Microsoft has embraced Linux](https://www.howtogeek.com/424886/windows-10s-linux-kernel-is-now-available/) in an extraordinary way in 2019, allowing you to marry .NET development with node/NPM based front-end pipelines on a single device.

[Google Chrome OS has actively courted web developers](https://youtu.be/3CWUAisN-vo) with an impressive Linux based flow (Docker/Kubernates? no problem). The [Google Pixel](https://www.google.com/chromebook/device/google-pixelbook/) is still attractive, even if most ChromeOS hardware is cheap & education orientated and their experiment in building a convertible slate has had [crushingly bad reviews](https://youtu.be/HOh6d_r63Bw).

So with all these alternative options already available, the question remains. Why bother trying to stretch the envelope of iOS to do web development when even Apple seem to be actively discouraging it?

It’s not an easy one to logically explain away. But I find it a pleasure to use an iPad. It’s genuinely light, connected and increasingly capable of most tasks, plus Windows and ChromeOS (and their app ecosystems) suck at being tablets. So if the iPad is my preferred device to grab and go – whether to the Coffee shop or Columbia – why would I want to also take another computer on the off-chance I need to fix a bug and re-deploy, or even build that project from scratch that I’ve been itching to try? My iPad is definitely powerful enough, so why not?

The truth is that most good ideas in tech were just fanboys playing around with what were considered "bad" ideas, until they reached a tipping point and suddenly everyone was doing it. So who’s to say we don’t discover a "new norm" here? God knows we could do with rethinking web-dev tooling and abstracting some of it away. That’s exactly what play.js has done.

This could still be an evolutionary dead-end – but we don’t know that until we push and see how far we get. And with the progress I’ve seen in the last few years, I believe we could soon see a point when Apple understands what the iPad’s place is in this industry (just as they did with writing, photography and film).

If that happens, all bets are off.

### Links
- [Christine Dodrill’s 2018 article on Emacs and Textastic on the iPad](https://christine.website/blog/coding-on-an-ipad-2018-04-14-2018)
- [Shane Dowling’s 2018 article on using GoCoEdit, Vim & Emacs on the iPad](https://link.medium.com/J1C6zSKgU2)
- [Jannis Hermanns 2017 article on developing remotely with an iPad](https://jann.is/ipad-pro-for-programming/)
- [Greg Jorgensen’s 2018 article about coding on the iPad…](http://typicalprogrammer.com/working-on-an-ipad-pro-as-my-main-computer)
- [… and the Hacker News thread it resulted in.](https://news.ycombinator.com/item?id=16741522)
- [iPad Pro Reddit](https://reddit.com/r/iPadPro)
- [Stuart Hall’s 2016 article that started it all off (for me)](https://stories.appbot.co/hey-apple-i-tried-the-ipad-pro-as-a-dev-machine-its-almost-awesome-830e424bbed3)
- [Tech Craft YouTube channel, covering Pro iPad usage](https://www.youtube.com/channel/UCT-GpMtIFhX9EMA0Eauevhw)
- [iPadPros Podcast](https://ipadpros.net/)
- [Christopher Lawley’s tech/YouTube blog "The untitled site", which often covers coding on the iPad](https://theuntitledsite.com/)
- [My own article on the tricky business of choosing an iPad keyboard](https://medium.com/@pixelthing/a-perfect-ipad-keyboard-doesnt-exist-a4cbcc127bfa)

:::picture.post__img--wide 2020-01-ipad-webdev19-12
Apple Magic Keyboard in a Fintie wrap & stand with an iPad Pro 10.5"
:::

### Footnotes
Quote is directly taken from a Patreon page which is not currently live on the web -- but is reproduced with kind permission from the author.

:::aside.aside--less.aside--bottom
Be sure to check out the 2020 version of front-end web dev on iPad.
:::