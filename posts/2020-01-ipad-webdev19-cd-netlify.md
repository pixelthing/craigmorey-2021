---
title: 2019 iPad Webdev - CD with Netlify
description: 
date: 2020-01-06
tags:
  - ipadpro
  - webdev
layout: layouts/post.njk
---

> Be sure to check out the 2020 version of front-end web dev on iPad.

> This is part of a review of the front-end webdev scene on iPad in 2019, detailing different methods to code in iPadOS. For the full list and more, click here

For web developers using an iPad, it’s best to think of this method as deploying your site to a VPS (virtual private server, a remote Linux account that you rent), without all that command line system administration nonsense. [Netlify.com](https://www.netlify.com/) can do the things your iPad is bad at (Node.js tool chains, web serving), without you having to ever SSH to a server.

The process of getting code to pixels can be summed up as:
1. checking out a repo and editing it on your iPad
1. pushing the changes on you iPad back to GitHub/GitLab/BitBucket/etc
1. somewhere in the cloud, the new change in a your repo triggers your tool chain to run and deploy the results to a web server.

Netlify deploy status (in Safari -- on left) and Inspect Browser showing the deployed site (right)

What we’re using (or "creatively" mis-using) is a Continuous Deployment (CD) system. CD is used to take the pain out of deploying to a staging or production server, the idea being that if the deploy is a simple switch – instead of a long email requesting a sys-admin’s time – there’s minimal friction stopping your site from being kept up-to-date and fresh.

Netlify (among other services) wrap this CD service up with a web server and CDN, making the whole process as simple as signing up for one free (within limits) service.

Although CD is generally used at a specific milestone – for example you’ve finished fiddling with the dev server and want to send it to staging – there’s no reason why we can’t use it for the fiddling part. In effect, Netlify can be our development server.

### How to
(using Netlify, but other CD providers would be similar)
1. Have your project in one of the hosted Git services that Netlify works with (eg, GitHub, GitLab, BitBucket)
1. Sign-up to Netlify, connect your new account to the hosted Git provider.
1. In Netlify, select the project from your Git provider that you want to connect, the branch whose changes will trigger the deploy, the command line to run (eg gulp build), and the resulting folder of files to deploy to the web server.
1. Back on your iPad, check out your project with your Git client (eg Working Copy), and either edit the files in that, or in a code editor.
1. When you’ve made a change you want to see the result of, commit and push it. This will trigger Netlify to run a deploy.
1. Monitor your deploy in your Netlify account in Safari. Full deploy logs are available there for debugging.

Build settings for a project in Netlify

### In practice
I liked this method a lot. It was particularly good if you’re really mobile with only a sporadic internet connection – I found myself making small gulpfile changes in Working Copy on my iPhone whilst travelling with my family on a bus, knowing that if I get 30 seconds in the next few miles, I could check if the deploy worked. You can change a line of code locally, commit and push and know some server somewhere isn’t reliant on your connection to it to do it’s job.

Getting the first deploy on the server can take a while, but subsequent deploys are very quick; if not as instant as a local installation, they are generally closer to the speed of your toolchain rather than any latencies between servers.

However it still adds one more step to a round trip. If I were running Gulp locally, it would be re-compiling as soon as I hit save. With the CD method here, you additionally need to commit (with a message unless you’re an animal) and push before you have the momentary wait to see the results.

But the biggest problem I found was juggling all these elements constantly. I ended up with using Working Copy to push a change (and so trigger a deploy) and Textastic or GoCoEdit as the code editor, editing the files in Working Copy. On top of that I had two tabs or windows of Safari, one for viewing the resulting website, and one open with the Netlify deploy status, so I could be sure the deploy had succeeded and I was looking at the right version of the site.

Working Copy (left), Textastic (center), two Safari windows (in slide-over -- right) with the deployed site and deploy status.

I ended up with the code editor taking the most screen space, Working Copy docked to the left, and Safari in the slide-over window on the right so I could optionally view or dismiss it, and so I could rotate between the two Safari windows. It sort of worked – but the cognitive load of four windows and how and when to view them made me miss the simplicity of old-fashioned windows. Removing one element would make it so much easier – if I could push direct from any iOS editor without having to return to the Git client (nope), or if Netlify had an app that could just show a notification every time it deployed (nope). When I could, I just used the code editor in Working Copy – if you’re doing some bug fixing and need a quick turn-around, I’d recommend it, but it’s not quite the right IDE for long coding projects (not yet, anyway?).

### Pros
- We get a server that can run our tooling and web server, all in one free (!) service.
- We never have to configure or upgrade that server (or even need to know how to)
- We have a very simple and reliable way of pushing new code to the server.
- Your connection to the internet doesn’t need to be super reliable or fast. Pushing changes to GitHub generally involves relatively small numbers of text files, and deploy progress can be monitored only when you choose to, as it all happens in the cloud.

### Cons
- You have to be online, at least enough to push Git commits.
- Your project needs to be a repo in GitHub/GitLab/BitBucket.
- You have to be ok with regularly pushing changes to a branch just to see the results of them, where you might normally be refining them before you push.
- Every code round-trip needs one additional step -- to commit and push the change.
- Not a responsive workflow if you’re constantly updating large files.
- As mentioned already, there’s quite a lot of windows to control, you need a code editor and a Git client on the iPad, and need at least two browser tabs for the Netlify deploy status and the deployed site.

### Optional extras
- You could add a CD process like Netlify on top of the [VPS/Visual Code method](https://medium.com/p/18f482f3a976), where pushing a commit directly in VSCode triggers a deploy, but all the benefits of Netlify being simple would disappear as it would already be on top of managing your own server. You’d only want to do this if you wanted the server that VSCode sits on to act as the development server, and CD to be used more conventionally, ie to deploy to staging/prod only once you’re happy for your dev code to be demonstrated to a wider audience.
- If you’re looking for a simple, reliable, secure blog workflow, this seems to be the perfect method to write your content in a markdown editor like [iA Writer](https://ia.net/writer) and use a framework like [Hugo.js](https://gohugo.io/) to publish it. You can even collaborate with others on an "editing" branch in Git before you merge with the branch that would trigger the publishing to Netlify.

### Links
- [Netlify.com](https://www.netlify.com/)
- [Paul Gowder enthusing about this method on Twitter](https://twitter.com/PaulGowder/status/1200927136594513920)

> This is part of a review of the front-end webdev scene on iPad in 2019, detailing different methods to code in iPadOS. For the full list and more, click here