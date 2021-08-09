const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const mdContainer = require('markdown-it-container');
const md = require("markdown-it");
const mdAnchor = require("markdown-it-anchor");
//const Image = require("@11ty/eleventy-img");
const embedEverything = require("eleventy-plugin-embed-everything");
const sizeOf = require('image-size');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);	
  eleventyConfig.addPlugin(embedEverything);

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");
  eleventyConfig.addLayoutAlias("magazine", "layouts/magazine.njk");

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function(item) {
      if( "tags" in item.data ) {
        let tags = item.data.tags;

        tags = tags.filter(function(item) {
          switch(item) {
            // this list should match the `filter` list in tags.njk
            case "all":
            case "nav":
            case "post":
            case "posts":
              return false;
          }

          return true;
        });

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });

    // returning an array in addCollection works in Eleventy 0.5.3
    return [...tagSet];
  });

  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");

  /* Markdown Overrides */
  let markdownLibrary = md({
    html: true,
    breaks: true,
    linkify: true
  }).use(mdAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  // }).use(mdContainer, 'aside');
  }).use(mdContainer, 'aside', {
    validate: function(params) {
      return params.trim().match(/^aside($|\..*$)/);
    },
    render: function (tokens, idx) {
      let classList = tokens[idx].info.trim().match(/^aside\.(.*)$/);
      classList = (classList ? classList[1].replace('.', ' ') : '' );
      if (tokens[idx].nesting === 1) {
        // opening tag
        return `<aside${(classList.length ? ` class="${classList}"` : '')}>\n`;
      } else {
        // closing tag
        return '</aside>\n';
      }
    }
  }).use(mdContainer, 'picture', {
    validate: function(params) {
      return params.trim().match(/^picture($|.*$)/);
    },
    render: function (tokens, idx) {
      if (tokens[idx].nesting === 1) {
      
        const tokenArray = /^picture(.*)\s((.*)$|$)/.exec(tokens[idx].info.trim());
        if (!tokenArray || tokenArray.length < 2) {
          console.log('****ERROR no array', tokens[idx]);
          return '';
        }
        // file name (eg, "2020-05-test" or "2020-05-test.png")
        let filename = tokenArray[2].trim() || '';
        if (!filename) {
          console.log('****ERROR no filename', tokens[idx]);
          return '';
        }
        // file extension (eg, "png")
        let fileType = 'jpeg';
        if (filename.includes('.')) {
          const filenameArray = filename.split('.');
          if (filenameArray.length > 1) {
            const fileTypeSuspect =  filenameArray[filenameArray.length - 1];
            if (fileTypeSuspect.length >=2 && fileTypeSuspect.length <= 4) {
              fileType = fileTypeSuspect;
              filename = filenameArray.slice(0, -1).join('.');
            }
          }
        }    
        try {
          if (fs.existsSync('img/' + filename + '-lg.' + fileType)) {
            //file exists
          } else {
            console.log('****ERROR img/' + filename + '-lg.' + fileType + ' doesn\'t exist 1');
            return '';
          }
        } catch(err) {
          console.log('****ERROR img/' + filename + '-lg.' + fileType + ' doesn\'t exist 2',err);
          return '';
        }
        let classList = tokenArray[1] || '';
        classList = classList.replace('.',' ');
        const dimensions = sizeOf('img/' + filename + '-lg.' + fileType)
        // opening tag
        return `
        <figure class="post__img${classList}">
          <picture class="post__img__picture">
            <source media="(max-width:599px)" srcset="../../img/${filename}-sm.${fileType}" />
            <source media="(min-width:600px)" srcset="../../img/${filename}-lg.${fileType}" />
            <img src="../../img/${filename}-xl.${fileType}" loading="${(classList.includes('hero') ? 'eager' : 'lazy')}" width="${dimensions.width}" height="${dimensions.height}" class="post__img__img" />
          </picture>`;
      } else {
        // closing tag
        return `
        </figure>`;
      }
    }
  });
  eleventyConfig.setLibrary("md", markdownLibrary);
  
  eleventyConfig.addNunjucksFilter("imageWidth", function(img) {
    if (img === undefined) {
      return '';
    }
    const dimensions = sizeOf('img/' + img + '-xl.jpeg');
    return dimensions.width;
  });
  eleventyConfig.addNunjucksFilter("imageHeight", function(img) {
    if (img === undefined) {
      return '';
    }
    const dimensions = sizeOf('img/' + img + '-xl.jpeg');
    return dimensions.height;
  });

  // Browsersync Overrides
  eleventyConfig.setWatchThrottleWaitTime(500);
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });
 

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "11ty.js"
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about those.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`
    // pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    // These are all optional, defaults are shown:
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};