# craigmorey-2021

A personal blog "Pixelthing" ([pixelthing.se](https://pixelthing.se)) for Craig Morey, a data analyst/developer at Polestar in Gothenburg, Sweden.

Built with 11ty/eleventy, all done on iPad (with [Play.js](https://playdotjs.com), [Inspect Browser](https://apps.pdyn.net/inspect/), [Code app by Baselab](https://thebaselab.com/code/), and also some messing with Raspberry Pi).

## Run locally

Doesnt like to run on Node 13 (creates errors), better to use 14+.

```bash
npm i
npx eleventy --serve
```

Local server then available on [localhost:8080](http://localhost:8080) (or 8081).

## Editing

Posts are in markdown format (.md). 

#### Post meta info

The top of the markdown file has some meta information:
```md
---
title: This is the H1 title of the blog
description: This will appear as a subhead in the blog & in shared links
date: 2021-05-17 <!-- the data in YYYY-MM-DD format -->
status: draft <!-- draft - if you want it to not yet appear in post lists, anything else if you do. -->
tags:
  - analytics
  - googletagmanager
layout: layouts/post.njk <!-- choose from post.njk (normal post), page.njk (normal page, not a post), magazine.njk (mag style post - not ready yet) -->
hero: 2021-01-01-this-pic <!-- The hero/thumbnail image (see creating inmage later). The file resides in /img/ and has to be .jpeg unfortunately -->
---
```

#### Post markdown extensions

The following extensions have been added to markdown (via [markdown-it-container](https://www.npmjs.com/package/markdown-it-container)) for convenience:

```md
:::aside
This is appears as an aside - a sort of footnote but inline with the text. Normal markdown works fine in this content area
:::

:::aside.aside--less
As the above but appears slightly greyed-out for less prominance
:::

:::aside.aside--update
As the above but with a different icon
:::

:::picture img/2021-01-01-this-pic.png
An inline picture element that will do resolution swapping between 2021-01-01-this-pic-sm.png, 2021-01-01-this-pic-lg.png & 2021-01-01-this-pic-xl.png (see the section on images later). All content written here in the tag will appear as an image caption.
:::

:::picture.post__img--wide img/2021-01-01-this-pic.png
As above, but will try to make the image wider than the text column when allowed
:::
```

[markdown-it-anchor](https://www.npmjs.com/package/markdown-it-anchor) is used to create automatic permalinks in any headers in markdown.

All code and pre blocks are formatted in solarized-dark (using [eleventy-plugin-syntaxhighlight](@11ty/eleventy-plugin-syntaxhighlight)).




#### Youtube/Twitter embeds

The site uses [Embed everything](https://www.npmjs.com/package/eleventy-plugin-embed-everything) to allow simple embedding of YouTube, Twitter, Instagram, Soundcloud, TikTik, Spotify, Vimeo.

```md
https://twitter.com/jxnblk/status/1147555688933154816?s=21
<!-- the above will create a twitter embed -->

https://youtu.be/IR6sDcKo3V8
<!-- the above will create a youtube embed -->
```

#### Post images

I tried to do some server-side image compression/cropping, but none of the iPad environments would run imagemagick, sharper etc. Instead I settled on a [custom iOS shortcut](https://www.icloud.com/shortcuts/2a0bf3a226384d6a8a31127c0fded7e5) that can be used on an image in a webpage or in your photos album, that saves the image to the correct directory in Working Copy (for my iPad), then carries out three resizes (-xl, -lg, -sm), plus a resize and crop for a thumbnail (-tb) that is used in the list pages and social sharing.

Image size is determined in Eleventy using the node package [image-size](https://www.npmjs.com/package/image-size), allowing the use of _width_ and _height_ on all images to help with stable page building before the images load.

Images have native `loading="lazy/eager"` attributes. This is [not yet supported in Safari](https://caniuse.com/loading-lazy-attr), but no doubt will soon.

#### CSS

CSS is in `/_includes/postcss`, and compiled into `css/styles.css` by postCSS.
- The site uses CSS custom variables a lot (postCSS also makes some fallbacks for non-supporting browsers)
- There are light and dark colour schemes triggered by system level dark mode switches (`prefers-color-scheme: dark`)
- The site makes usage of flexbox and grid (with gap support).
- The CSS is written in the SASS nested CSS style using [`postcss-nesting`](https://www.npmjs.com/package/postcss-nesting) (but to the same spec as the [upcoming CSS nesting spec](https://benfrain.com/official-css-nesting-the-last-piece-of-the-puzzle/), not just vanilla sass).
- CSS is compressed with [CSSNano](https://cssnano.co).

## Deploy

- Commit changes to the main branch of this repo
- Netlify spots the update, runs eleventy, deploys the site to [nostalgic-noether-5a5ca7.netlify.app](https://nostalgic-noether-5a5ca7.netlify.app) (the temporary domain for pixelthing.se).
- There is an "edit" branch of the repo that can be used for saving updates without triggering the Netlify deploy.

