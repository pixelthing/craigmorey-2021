---
title: Flagging internal remote users in GTM
description: When your workforce is mostly remote, how do you exclude them from results?
date: 2021-09-07
status: draft
tags:
  - analytics
  - googletagmanager
layout: layouts/post.njk
hero: 2021-09-gtm-onscreentime
---

It was all so easy in the old world. You could just add an IP filter to your Google Analytics view and suddenly all of your average-skewing internal traffic to your site would be gone.

But now most teams have a large proportion of remote work, so how do we filter out developers and project managers from our data when we know they are refreshing pages endlessly and making a mess of our "time on site" averages?

At [Polestar](https://www.polestar.com), we use a set of signals that in any one session would definitely mark out a user standing apart from a "regular" web user, and then persist that information long term.

The most successful signal is if anyone visits a staging or a development server. All types of non-production servers at Polestar are protected behind various mechanisms, so if you successfully load a web page on one of these domains, you're definitely beyond a level of suspicion of being an "internal" user. We start with a GTM variable:


```js
{% raw %}function() {
  // if the user type is cookied
  if ({{ENV - visitor type - cookie}}) {
    return {{ENV - visitor type - cookie}};
  // spot the users coming in to staging/dev or are debugging
  } else if ({{Page Hostname}}.includes('stage') || {{Page Hostname}}.includes('local')) {
    return 'internal';
  }
  return 'public';
}{% endraw %}  
```

This is checking for a long-term cookie first (only the internal users will be cookied, limiting the consent required), and if no cookie is found, it checks if the host was any non-production url (stage, localhost, etc), before returning what type of visitor this is - although there's currently only two types - "public" and "internal".

A GTM tag/trigger combination then fires if the variable is "internal" but no cookie is found - a sure sign that we've just caught a new internal user. This tag of course sets a long term cookie to complete the cycle. I'm normally an advocate of local/sessionStorage, but in this case a cookie is the best tool, as localStorage is scoped to a sub domain (eg www.bob.com), whereas an appropriately set first-party JS cookie can span be set on one subdomain (eg stage.bob.com) and then read on a different child of the same domain (eg www.bob.com).

```html
{% raw %}<script>
  (function() {
    var visitorType = '{{ENV - visitor type - var}}';
    if (visitorType && visitorType !== 'public') {
      // Set cookie for all subdomains for one year.
      document.cookie = 'gtm.visitorType={{ENV - visitor type - var}}; path=/; max-age=' + (60*60*24*365) + '; domain=.polestar.com'; 
    }
  })();
</script>{% endraw %}  
```

The last thing we do is to include this piece of information in any GA hit data, for instance in Universal Analytics we add it to the GA settings variable in GTM as a custom dimension scoped to the user. In GA4, we send it as a user parameter. Setting it as a user scoped dimension means you'll be able to filter (or segment) out these users as long as they have that device until it's cookies are cleared or the browser obfuscates the GA cookie.

### Caveats

It's not a perfect solution - visiting production URLs in incognito mode will make you look like a normal non-alien user again.

Then there is the question of multiple devices. Because we're only using cookies, we're only flagging internal users per device, which might at least capture those devs doing responsive design testing on their phones, but probably not the copywriter checking their update to the news page on the bus to pick up the kids. 

And that's where we need more signals...

### More signals that can flag internal users

- Intranets are great for flagging internal users if they are on the same top level domain as the rest of the public site. If the intranet is on a different domain (hello sharepoint!), you could try spotting users on your main site that have an intranet URL in the _referral_ string, all it takes is one click from an intranet news item to a press release and whammo, you're flagged as an "internal".
- Internal IP addresses are not a daft idea. Javascript (thankfully) can not natively detect your IP address, but it's a simple job for a backend dev to insert a piece of markup into a page when your browser is coming from a set IP range. GTM can then spot that marker to flag the user as "internal". This is still the best solution for collecting "internal" users that rarely get their hands dirty with non-production content, and they only need to visit the office once to become flagged for the life of the cookie.
- Last but not least, it's easy to set up a tag in GTM that you can use to _manually_ flag anyone you send a URL to. For instance, if you ask colleagues to go to a url with a `?flag-as-internal` query string, a tag/trigger combination could drop the cookie that will do the job:
```html
<!-- trigger for this tag set for when the {{Page URL}} contains 'flag-as-internal' -->
{% raw %}<script>
  (function(){
      // Set cookie for all subdomains for one year.
      document.cookie = 'gtm.visitorType=internal; path=/; max-age=' + (60*60*24*365) + '; domain=.polestar.com'; 
  })(),
</script>{% endraw %}  
```

### Building an audience

Remember it's a game of odds, you need to reduce the amount of internal users to bring your average metrics back to reality, so spotting 80% of internal users is probably good enough. I like to flag internal users instead of remove them from results, as it gives another level of context to the data, a story of it's own.


