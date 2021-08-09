---
title: 2019 iPad Webdev - Panic Coda/Code editor
description: The daddy of iPad IDEs, sadly adrift.
date: 2020-01-06
tags:
  - ipadpro
  - webdev
layout: layouts/post.njk
hero: 2020-01-ipadwebdev-coda
---

:::aside.aside--less
  This is part of a review of the front-end webdev scene on iPad in 2019, detailing different methods to code in iPadOS. For the full list and more, click here. And be sure to check out the 2020 version of front-end web dev on iPad.
:::

:::aside
Using Panic Code Editor (formerly Coda) 2.2.15. And as of May 10th 2021, Panic Code Editor is no longer available for new purchases/download.
:::

[Panic Coda is now Panic Code Editor](https://panic.com/blog/the-future-of-code-editor/). Panic is working on a new Mac code editor called Nova, and so the Coda brandname has been snapped up by someone else — hence the name change. But I’ll keep calling this app “Coda” in this article.

Coda for iOS is the daddy. It was among the first generation of professional creativity apps on the iPad/iPhone, when the app store was almost exclusively just magazines and games.

The Coda editing view. Note the tabs and the settings available to each tab.

It’s still sold by Panic _(update - no it's not!)_, still supported with bug fixes and security updates. It’s still got some features that don’t exist in any other app. But it’s essentially in maintenance mode. It was built for the pre-iOS11 world and I’m sad to say it barely fits into the iOS13 one.

:::picture 2020-01-ipad-webdev19-panic-coda-1.png
The Coda editing view
:::

Just scroll a file. The frame rate when you scroll a long script is much lower than Panic would normally allow through QA, and in large files the typing response is not so great. Syntax colouring is similarly laggy. It was built and optimised for iOS hardware that was vastly different from the monster CPUs in the iPad Pro of today.

Frustratingly, there is no access to any filesystem outside of Coda’s sandbox (remember those days?) so you have to copy files into Coda or commit files individually which makes any source control system very contrived. The file system UI is idiosyncratic not least because you click on a file and it gives you a full screen of of contextural options, when all I want is to see and edit the code.

If it had a performance sprint or two, gained basic iOS13 file access with edit-in-place, it would still be one of the best options out there. An iOS version of Panic Nova could be years away (it was largely developed before Catalyst was a thing — so a port to iOS is a biiig job), but meanwhile, Coda is barely surviving in its current form.

Coda set the template all the other editors use today. The all-in-one code editor, remote shell client, remote file client and the in-app browser with a console, and most of those pieces are still great. Almost every part of the app feels extremely iOS-like, and very much that it came from a decently paid, talented team of good product junkies.

But that’s not enough any longer, it’s not often in my list of editors that I use on a regular basis.

## Amazon Web Services S3

But Coda has one thing that nothing else does. Remote Amazon Web Service (AWS) S3 file bucket access. Only Panic’s own Transmit (no longer on the app store) has usable S3 access, and if you have a project that uses S3, it could be the one killer feature you need.


:::picture 2020-01-ipad-webdev19-panic-coda-2.png
:::

The above screenshot shows the file interface in Coda. On the left is the list of files that sit in this project locally on the iPad. On the right is the list of remote files in the AWS S3 bucket. In this view, you can pick files that are either local or remote and edit them, or you can drag and drop them between the two sides.

You might have noticed the tab bar at the bottom. This allows you to change the view to either see only the local files or only the remote files. If you’re using Coda to work directly on an AWS S3 bucket, it’s recommended you only show the remote column — it’s much less confusing.

What we haven’t touched on in this article is source control, most commonly Git. That’s a tricky subject with Coda — there is a way of using iCloud to syncronise the whole repo (consult the Working Copy docs), or you can commit individual files into Working Copy using the share/action sheet (see my 2018 review to see how). But neither is a very satisfactory workflow.

But if you’re working directly with AWS S3, your only real option is to rely on the versioning in the S3 bucket — if that feature is turned on.