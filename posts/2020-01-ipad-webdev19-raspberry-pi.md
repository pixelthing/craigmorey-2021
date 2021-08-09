---
title: 2019 iPad Webdev - Raspberry Pi
description: Strap a Linux server on your iPad.
date: 2020-01-06
tags:
  - ipadpro
  - webdev
layout: layouts/post.njk
hero: 2020-01-ipadwebdev-rpi
---

:::aside.aside--less
  This is part of a review of the front-end webdev scene on iPad in 2019, detailing different methods to code in iPadOS. For the full list and more, click here. And be sure to check out the 2020 version of front-end web dev on iPad.
:::

:::aside.aside--update
### Update 2021–01–04
[This Medium article](https://medium.com/sausheong/setting-up-a-raspberry-pi-4-as-an-development-machine-for-your-ipad-pro-3813f872fccc) (paywall, unfirtunately) is the best resource I’ve found for setting up all the possible iPad/Pi combinations.
:::

This could qualify as one of the hacks of the year and has gained quite a lot of traction in the last six months.

The idea is pretty simple. Once you’ve got used to playing with a VPS (Virtual Private Server — a remote Linux account you rent) as the web development accessory to your iPad, you start to wonder if that Linux server could be closer to you. Much closer. And smaller — almost as if you could carry it in your pocket.

Well, that describes a Raspberry Pi. Of course any UNIX/Linux computer would do, but it just so happens that Pi’s are cheap ($€£35–100 depending on the level of spec and comfort) and very well supported with community documentation.

I’d been playing with Raspberry Pi’s as part of dashboard appliances, and was just considering using them as an off-board Linux server to a iPad when I realised smarter people were way ahead of me. The first time I saw a Raspberry Pi used specifically for development with an iPad, it was from the supremely talented Brent Jackson in July:

https://twitter.com/jxnblk/status/1147555688933154816?s=21

It blew my mind because I’m not sure how he’d arrived at it, but it was a fully formed workflow using USB-C to not only power the Pi, but as ethernet over USB as well (he even documented the types of cable he had success with and those that didn’t work out). Here’s [the whole Twitter thread on Threader](https://threader.app/thread/1147555688933154816).

It took off from there. I had an iPad Pro 10.5” with Lighning connectors, so USB-C power and network weren’t going to work for me, but I could connect to them over WiFi easily enough. And I found I didn’t need to stretch to the Pi 4B, the Pi 3B+ model that I already owned was fast enough for most work, and as a bonus had much lower power demands, so using a 10Ah 12Watt Anker battery pack (not a PD one with crazy output) was enough to run it. If you plugged it into a monitor, it would complain about power during boot-up, but in general headless usage, it never hit any limits.

:::picture 2020-01-ipad-webdev19-raspberry-pi-2
:::

For a plane trip in September, I decided to try and get it working without any internet — just the iPad, the Pi and the battery pack, totally off-line. I eventually got the Pi to act as a WiFi NAT and DHCP server, essentially acting as a router with no connection to route, leaving just the iPad and the Pi as the only IPs on our mini network. It worked great and I could literally carry it in my pocket whilst working on it. If you’d like to try this “offline” set-up, there’s a link at the bottom of this article.

https://twitter.com/pixelthing/status/1172589731886063616?s=21

Once [Secure Shellfish](https://secureshellfish.app/) came out, sending files to and from a Raspberry Pi was as easy as if it was an external drive, Shellfish just made it another file provider in the “Files” app.

:::picture 2020-01-ipad-webdev19-raspberry-pi-1
Shellfish set-up to connect to my Rasbperry Pi 3B+
:::

Shellfish set-up to connect to my Rasbperry Pi 3B+
And since Brent’s first tweet, I’ve seen the Pi pop up again and again as an iPad accessory. Rob at the [TechCraft YouTube channel](https://www.youtube.com/channel/UCT-GpMtIFhX9EMA0Eauevhw) has made several videos about setting up the Pi for use with an iPad, both with USB-C and Wifi connections. In fact, I’m not going to try to explain the set-up, because he does a much better job.

https://youtu.be/IR6sDcKo3V8

### Pros
- You get a full Linux server that you can customise in any way you want.
- It’s ridiculously portable, and can even be used in a workflow when you’re fully offline, under battery power.
- Unlike a VPS, the quality of your internet connection is of no consequence.
- You can buy and own it for less than the cost of one years’ rental of a cheap VPS.
Geek cred.

### Cons
- It’s another thing to carry, another thing to charge, another thing that can be damaged or lost.
- You need to be willing to get pretty dirty with Linux command line
- Back-up is your responsibility.
- The Pi 4B can get pretty hot — best to bare in mind that if you need to stay mobile, it won’t appreciate working in a pocket or a bag for long periods.

### Optional extras
- You can spec or modify these suckers until your heart’s content.
- Tether it with USB-C for charging and network? Use Wi-Fi+battery and leave it in the bag? It’s up to you what works best.
- Using a Raspberry Pi with the [VPS/VSCode method](https://medium.com/p/18f482f3a976) would be pretty knockout. You might want to use a higher spec Pi 4B with some decent memory though.
- You might want to use the Raspberry Pi as your development process, and then the CD/Netlify method as the next step, when you want to deploy your code to stage or production.

### Links
- [Thread of Brent Jackson’s USB-C Raspberry Pi 4B](https://threader.app/thread/1147555688933154816)
- [My set-up instructions to start-up a Pi in “offline” WiFi NAT mode, that you could connect your iPad to](https://gist.github.com/pixelthing/2d9d335cdd3632210febf2d2a15b5365)
- [TechCraft set-up of a Raspberry Pi for a USB-C iPad](https://youtu.be/ebYB9rVHaeg)
- [TechCraft set-up of a Raspberry Pi for a Lightning iPad](https://youtu.be/YbvSS8MJm2s)

:::aside.aside--less.aside--bottom
  This is part of a review of the front-end webdev scene on iPad in 2019, detailing different methods to code in iPadOS. For the full list and more, click here. And be sure to check out the 2020 version of front-end web dev on iPad.
:::