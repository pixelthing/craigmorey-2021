---
title: 2019 iPad Webdev - remote VS Code
description: 
date: 2020-01-06
tags:
  - ipadpro
  - webdev
layout: layouts/post.njk
---

::: aside.aside--less
  This is part of a review of the front-end webdev scene on iPad in 2019, detailing different methods to code in iPadOS. For the full list and more, click here. And be sure to check out the 2020 version of front-end web dev on iPad.
:::

::: aside.aside--update
#### Update 2020–04–17
Checkout [serveediter.app](https://servediter.app), a neat native app that wraps up everything mentioned below along with a super cheap VPS subscription. It’s early days but it’s much more stable than the experience I had and it looks promising.
:::

::: aside.aside--update
#### Update 2020–01–10
Reddit users have pointed me in the direction of [Visual Studio Online](https://visualstudio.microsoft.com/services/visual-studio-online/), which is Microsoft’s official online version of VS Code, and has been in public preview since November 2019. It works great in desktop browsers (including having keyboard shortcuts)-- but so far it is not letting me access it with iPadOS; it says "currently unsupported" and tries to download "undefined" on sign-in. But along with the release notes talking about testing on iPad, it seems to be a good sign that Visual Studio Online will soon be supported on iPadOS. Until then, the below method (or Owen Williams’ method) seems the only way of achieving VS Code on an iPad.
:::

::: aside.aside--update
#### Update 2021–01–04
Also check out [gitpod.io](https://gitpod.io/), an online service that also gives you a super quick way of accessing and editing github repos.
:::

::: aside
This review uses VS Code 1.39.0 In the [cdr server package release 2.1692](https://github.com/cdr/code-server/releases/tag/2.1692-vsc1.39.2)
:::

So this is a bombshell.

I can run [Microsoft VS Code](https://code.visualstudio.com/) on my iPad. Real, actual VS Code, down to the built-in git client, terminal, extensions and multi-file search. I was first alerted to the possibility by [Owen Williams](https://link.medium.com/4nycoirfU2)’ article back in June.

Well, don’t get too excited, it’s 90% the real thing.

Running VS Code (hosted) as a standalone web app.

You see, the earliest versions of VS Code were based on a fork of [GitHub’s Atom](https://atom.io/), a JS based editor. And even though VS Code has come a long way, it’s interface is still just HTML, CSS and JS, even if the heavy lifting is dealt with behind the scenes (mostly in GO?). And that means it’s essentially a web app that can be served to a web browser and even linked from your home screen as a standalone web-app.

But the problem with it being not only a web-app but a relatively unsanctioned one at that, is that the developer experience has a few downsides:
- You need to be online (or at least serve it from a separate computer).
- You need to keep it running on the server (we’ll talk about this in a moment), as well as secure from other users.
- Every time you return to the app, you briefly see a "reconnecting" dialog as the app wakes and looks for the VS code app server.
- Your experience is directly related to the speed of connection to your server.
- You can’t use any keyboard short-cuts (that’s a big ouch).
- You can’t touch/drag scroll bars.
- The settings menu is currently buggy (you can’t change any setting, but there’s a workaround here in the footnotes)
- The main hamburger menu disappears once you’ve used it (oops).
- Various repaint glitches, touch-targets not all sized for touch screen usage, other small weirdnesses of running a very complex beta web-app.

Extensions in VS Code. In terms of functionality, the hosted version is missing almost nothing over the app.

Many of these are purely beta-testing bugs, but [there’s evidence that Microsoft are actively testing this set-up with iPads](https://code.visualstudio.com/updates/v1_41#_browser-support), so expect to see improvements in the future. Could this eventually be a native app? I’d venture that getting it to work in a native app package with the file picker API etc is definitely within sight, but forking the capabilities of the app to be so very different when running natively on the iPad (eg could the iOS version do debugging, git, terminal, extensions in the same way?) are more likely to be holding Microsoft back from launching it. Who knows, but if anyone could get Apple to bend rules to suit webdev, it’s 2020 Microsoft.

Now we’ve covered the downsides, what are the benefits?
- Built in git-client, so you can pull, commit and push demo from your IDE directly on the remote server.
- Built in terminal, so you can run your Node.js toolchain on the remote server from within your IDE.
- err.. VS Code -- that means a top-tier code editor with almost endless extensions and theming.

Multi file search and replace. One of many things missing in native iOS code editor apps.

In practice, once you’re set-up and in a flow, you’re pulling, editing, saving, running Node.js tool chains all within VS Code as a standalone web-app (without need to think that it’s all happening remotely), then alt-tabbing to Safari/[Inspect Browser](https://apps.pdyn.net/inspect/) to check the results, then alt-tabbing back to VS Code exactly where you left it, to commit and push right there in the IDE. You’ll get used to briefly seeing the "reconnecting" dialogs, but on a good connection, it’s a minor annoyance. It’s surprisingly seamless.

Starting up and using VS Code on a VPS from an iPad.

### But hang on…
This is technically impressive, but in truth it has nothing to do with the iPad -- everything is happening on the server, so your precious iPad could be replaced by any web browser on any platform -- from a Chrome OS laptop to a Raspberry Pi mini-PC. It’s the browser equivalent of firing up Emacs, ssh-ing to a server and only leaving it to check the results.

That doesn’t mean it doesn’t hit our main requirement (ie, doing "real work" on my mobile device of choice), it’s just that it feels a little like cheating.

Running a simple python web server within the terminal inside VS Code.

### How to.
1. First you need a Linux server to run it from. It could be a computer on your internal network, a remote server you have access to, or most probably a VPS (a Virtual Private Server -- a remote Linux account that your rent). This will probably take some sys-admin knowledge to set-up and prepare.
1. To even start with a VPS, you’ll need a decent SSH/Mosh client on your iPad. Use [Termius](https://termius.com/) if you like a slick iOS GUI, or [Blink](https://www.blink.sh/) if you live and die by the command line (and you want the stickiest connections ever).
1. If you are using a remote server, the chances are that you will be starting up the VSCode server via an SSH connection, and if that connection is severed, your access to VSCode will eventually also time-out with your dead connection. So it’s best to make that connection as stable as possible by adding a [Mosh](https://mosh.org/) to your remote server.
1. Now you need to get the hosted VSCode binary onto your remote server. If your server supports a recent version of Docker, there’s a [simple Docker command you can run here](https://github.com/cdr/code-server). But for my VPS, it didn’t work, but [downloading, expanding and running the binary version worked](https://github.com/cdr/code-server) just fine.
1. We’re ready to test it all out. Log into the remote server and run the code-server binary (or the docker command if that’s the version you downloaded). It will start up VSCode on port 8008, and will tell you the random password to use to log-in. Because this version of VSCode is often served in public, it defaults to needing a password, before nasty people start doing nasty things to your code.
1. In Safari on your iPad you can go to the IP or domain of your remote server at port 8008, and you’ll see a log-in screen (see below). Before you enter the password, go into the Safari action/share sheet and save this web app to your homescreen. It’s not a full PWA, but it will make a standalone web app link that will give you more screen space (none of the Safari UI) and make it easier to switch between editor and browser.
1. Now you can open the VSCode web app from your homescreen and enter the random password that was shown to you in the command line when you started up the VSCode server. And suddenly you have VSCode on your iPad!
1. If you have a project already checked out on your remote server, you can open it up using "File" in the hamburger menu top-left of the VSCode screen. If you don’t yet have a project on your remote server, use an SFTP client or even a code editor like [Textastic](https://www.textasticapp.com/) to transfer your project up to the server.
1. If that project is a Git repo, VSCode will attempt to get the git status of the project (if your remote server doesn’t have an SSH key for your git service, your terminal app will be sitting there requesting your Git password).
1. One last thing. You’ll get pretty fed up quickly with that password on VSCode. If you’re running VSCode in a safe enviroment (LAN server, Raspberry Pi), the instructions to remove the password are given on the command line where you see the randomized password. Otherwise, pick a password and set it up in what they call an environment variable. On the remote server, type:
echo "export PASSWORD=YourPassword" >> /etc/profile
…where YourPassword is… well you get the idea. Next time you start up the VSCode server and get to the log-in, you won’t need to copy/paste that random password, you’ll have your own.
1. Ok, this is the last thing. Using this out in the open is still a security risk even with the password on it. I wouldn’t risk setting it up to run all the time if I can help it. Shut it down when you’ve finished your session.

The password entry for hosted VSCode as seen in a browser. By default, the password is set randomly and shown in the terminal session that started the server.

### Optional Extras
- Could I marry this workflow with a Raspberry Pi (or any local Linux computer) instead of a VPS? Heck yes, and you wouldn’t need the Mosh server or passwords every time you launch VS Code. A Raspberry Pi 4B with decent memory should be more than capable -- although I haven’t tried it… yet.
- I haven’t tried it yet, but I suspect it’s not impossible to make a siri shortcut that uses Blink to open the connection to the VPS, start up the VSCode server and then opens the standalone web app on you iPad, all in one icon tap. And then you might need another to shut the server down once you’ve finished.

Raspberry Pi 3B+ powered by an Anker battery pack. Could it be your VSCode in a box?

### Links
- [GitHub - cdr/code-server: VS Code in the browser](https://github.com/cdr/code-server)
- [Owen Williams’ Medium article on using hosted VS Code with an iPad](https://link.medium.com/4nycoirfU2)
- [Full Microsoft Visual Studio site](https://code.visualstudio.com/)

### Footnote
There’s a classic front end bug in the settings in the current version of hosted VS Code (that’s bound to be fixed soon) where you can’t interact with the settings (select menus, checkboxes,etc). It’s probably a z-index thing, you know the bug. But happily, the VS code team have done a great job with accessibility, so you can click on the settings section you want, then use the tab key to cycle through the settings options, arrow keys to use select menus, and the space key to action things like checkboxes.

:::aside.aside--less.aside--bottom
  This is part of a review of the front-end webdev scene on iPad in 2019, detailing different methods to code in iPadOS. For the full list and more, click here. And be sure to check out the 2020 version of front-end web dev on iPad.
:::