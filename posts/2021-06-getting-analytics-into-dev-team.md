---
title: Getting analytics into a dev sprint
description: It's a bit like inception, you need to get in their heads.
date: 2021-06-01
tags:
  - analytics
  - googletagmanager
layout: layouts/post.njk
hero: 2021-06-getting-analytics-into-dev-team-hero
---

Web analytics want to have data layer pushes in the app. The web development team - whose job it is to make these changes - is under huge pressure, with their final sprints full of urgent fixes and loud stakeholders moving priorities around. 

So it's inevitable sometimes that crucial measurement points fall out of the sprint and don't get to launch day.

This is so often the case in the web analytics business, that I'm not going to even address the "were analytics a priority from the start" question. Even if a KPIs, a measurement plan and  docs were agreed early in the process, it often comes down to the last two weeks to implement and QA analytics in the site for the simple reason that many of the crucial processes to measure are still being finalised at that stage.

So how can we try to avoid this?

## 1. Patrons

The most obvious thing you can do is to have one of the of those _loud stakeholders_ in the process on your side. This means having a champion, a patron that will fight for your position in sprint grooming sessions. Don't assume that because you have a chummy relationship with the developers or the product manager that that is enough - they are often just foot soldiers in the battle of the priority lists and their protestations are often weak sauce.

> They can take the fight for you

What you ideally need are big guns with responsibilities for the success of the project. Your team needs to find the people with the business goals of a successful launch - the Customer Experience heads, the Business Analyst leads, the people who will be called upon to prove and report on a professional and successful product. They can take the fight for you with just a couple of emails or Slack messages into the right team leads.

This is pitched as not only being able prove & celebrate a successful launch, but also to spot the (just as common) less successful ones early on and be able to tweak the way to a better product. It's not a good look to realise something was a dud only when the quarterlies come in. Good web analytics are the best way to optimise a short-term negative result into a long-term positive one and keep everyone in the group looking good in front of their boss. The more people know this, the more they'll fight for you.

## 2. Relationships

Having said that you may need to go around the dev team, you also can't treat them like a service. If you have a poor relationship with the devs - you are not going to get the data you want.

You need to be able to have the dev team on your side and let them know that you're working towards the same goals, whether it be business (ie, revenue, customer satisfaction) or personal (ie, doing the job right).

Having experience yourself in website dev is not essential to talk to a dev team - although I admit I've found it very helpful (and I've leant on the "don't hold back, I'm also a front-end dev" line more than once). But by being able to show some knowledge of what single-page-application (SPA) frameworks are, what affects web performance, how to use CSS selectors or the "critical page load path" - or even just showing willing to meet in the middle by asking the dev team about such things - you'll get better response and results.

The other thing that dev teams love is documentation. If you can create a doc about what dataLayer pushes you need, why and when they should occur (important - should an event happen when a button is clicked, or when the resulting dialog appears?), they'll have an instruction set and also a way of estimating work to add to a job ticket. 

> Plus "It's in the docs" is the ultimate meeting shortener.

In my experience, good implementation documentation is never worth dropping when time is tight - it helps you focus better on what you want, helps implementation happen, and can then be tweaked to show the resulting analytics details (eg GA events) that analysts can then use to understand what happened and why.

What do you get out of all of this? A mutual respect helps the dev team know they aren't about to have jobs parachuted in that will block their sprint, slow the site down or make maintenance trickier. If you can work with them, they will much more likely assist you achieve your goals, and call on you when something changes in the future.

Don't take this as a purely affirmative relationship, either. As a "problem solver", I have a tendancy to bend over backwards, creating custom Tag Manager tags to fill gaps that a team is unwilling to implement in the simple dataLayer push. Remember that if a measurement point is not found worthy to prioritise in a dev sprint, it might also not be worth your time to find a workaround on the data engineering side either.

And if a dev team is really unwilling to schedule analytics before a launch, sometimes the lack of data to present to their bosses is the only thing that will get them to prioritise it in future sprints. As a colleague succinctly put it, "sometimes only a little pain works".

## 3. Negotiation

When writing an implementation doc for a team, you'll rarely get it right the first time. Sometimes your mental model is different from the business model (or the app model), sometimes what you want is just not possible without lots of extra development work.

Being pragmatic means starting with an ideal situtaion, and then negotiating with the dev team to come to an agreement that leaves everyone satisfied. 

To do that, you need to set expectations - state early on that you'll get some docs together, but that they're just _"version one"_ and they'll be plenty of opportunity to revise them once the dev team has looked over them. They might decide that they need to negotiate the docs _before_ sprint grooming (ie, they may feel the need to make serious changes that effect estimations). Or they might _after_ a sprint has started (ie, it looks like just small changes need checking over) - so the negotiation might be with just the devs or their project managers too if it affects scheduling.

> Negotiation has to take place in good faith

Negotiation has to take place in good faith, so if the dev team doesn't seem to understand why some measurements are requiring their time to work on, or web analytics don't believe that the dev team's work will give reliable readings, maybe you need a third party such as a product manager or team lead in the conversation anyway.

Starting with creating a "perfect world" instrumentation doc - where the ideal analytics events are listed without thought about the implemetation effort - is not just a theoretical starting point. Sometimes its easy to overthink what may be hard for the dev team to build, and miss out on potential signals that could be useful. As long as the dev team know it's starting at the top end of requirements and you're flexible, it's rarely a problem to start this way.

---

If you need a few points to give away as bargaining chips, try these:
- Prioritise your requests. Don't compromise on contributions to KPIs, but be prepared to lose or greatly refactor minor measure-points.
- In fact, where some interesting actions take place in the site that we don't intend to initially report on, add them in, but be prepared to lose them. This isn't only for some evil bargaining reason, but more future-proofing - we all know instances of UX in websites that suddenly become an unexpected priority for management, and having existing hooks ready to measure without hacks or panic are often a godsend.
- If there are any states you need in the dataLayer that don't change very often, get them set them when the web app starts, instead of every time you make a dataLayer push. It'll remain in the dataLayer as long as the page is loaded anyway. And the web app then doesn't need to find a state unrelated to a running function every time it is run. For instance:
```js
// set this state once in the dataLayer early
dataLayer.push{
  'event' : 'app.setup',
  'layout': 'mobile'
}

// ...instead of asking the app to find the layout state each time an event occurs:
dataLayer.push{
  'event' : 'app.addToBasket',
  'value' : 99.99,
  'layout': 'mobile'
}
```
- Be flexible about swapping between asking for dataLayer pushes and markup changes. dataLayer pushes are essential for state changes and complex states with lots of information, but they often need devs to create new detailed methods where they never existed before. If you're looking for something simpler, like notification of a click with a small amount of data, asking devs to add a data attribute to their HTML component (and attaching a GTM trigger to that css selector) is often a much quicker task for devs to complete. You could even create generic markup-hooks that mean the dev team's workload is simpler, and eliminates yours [[see article here](/posts/2021-04-generic-gtm-click-tracking/)]. For instance:
```js
// you can compromise on asking for a simple dataLayer push like:
dataLayer.push({
  'event' : 'cta1.click',
});
```
```html
<!-- ...by instead asking for a markup change - normally quicker to implement by a dev team -->
<a href="/promo" data-track-click="cta1">Click me!</a>
<!-- now attach a trigger to the CSS selector [data-track-click="cta1"] -->
```
- Sometimes you need to listen to how the devs have created the app to find the most pragmatic solution. If you want to capture what's been updated in a basket, but the app just returns the latest basket object (with no idication what's changed), you might consider diffing the object [check back for article on that soon] to understand whats changed. It might remove a lot of potential dev time that you could then ask to put towards other things in your list.
- Labelling values is always deceptively tricky. If you want a customer type in the dataLayer as `B2B`, but the app code calls the same thing `business`, you might want to use the devs description instead of yours, it removes the need for them to write dictionary lookups, and definitely reduces exposure to bugs (especially as new values could be added in the future that your schema may not deal with). This applies to naming both keys and values in the dataLayer - try and sync them with something existing instead of creating new paradigms.
- On occasion, when an idea really didn't get any traction with sprint grooming, I've built complex solutions purely in custom tags that monitor & report app state from markup & clicks without any assistance from the dev team. After gathering data and displaying the benefits, I've then asked again for time to implement dataLayer pushes (much more reliable). It's not ideal - but sometimes you need to show how tasty the result is before everyone is convinced.
- Ask if there are any things that devs would like to see in a dashboard (eg, what browsers, devices or resolutions use the app), you could use it to gain trust.

Try to make it clear what you're compromising on, none of your decisions are free of cost and others should be aware of that. And explain why you want each point of data, it often overlaps with what the dev team also want to know, and helps contextualize how much effort it's worth.

## Conclusion

If a lot of the above sounds like compromising, you'd be right. If it sounds a lot like business school politics 101 - you _might_ be right. But it doesn't need to be so cynical, if we're talking about wanting to get the job done _or_ having respect for your co-workers, there's no reason those two beliefs can't be held simultaneously.

What we're trying to do is to develop communications that don't just create short-term success, but long-term effectiveness - the more that both web analytics and web dev respect each other, the better the data will be to come from the products. And that was always the goal.

