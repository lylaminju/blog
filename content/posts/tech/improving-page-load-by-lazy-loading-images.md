---
title: Improving Page Load by Lazy-Loading Images
date: 2026-05-06
---

<figure style="margin:1.5rem 0;">
  <video controls muted playsinline preload="metadata" poster="/assets/posts/climberzday-before-loading-poster.jpg" style="width:min(760px,100%);height:auto;display:block;margin:0 auto;border-radius:8px;">
    <source src="/assets/posts/climberzday-before-loading.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <figcaption style="margin-top:0.5rem;text-align:center;font-size:0.9rem;color:var(--text-muted,#666);">Before optimization: many gym preview images were requested during the initial page load.</figcaption>
</figure>

The homepage of my climbing gym app felt slower than it should. It shows gym cards, each with a preview photo.

The likely cause was simple: too many gym photos loading at once. That turned out to be mostly correct.

## The Problem

The original gym card used a CSS background image:

```svelte
<div
  class="gym-card bg-cover bg-center"
  style="background-image: url({base}/{gym.imageUrl})"
>
  ...
</div>
```

This works visually, but it gives the browser fewer loading tools. A CSS `background-image` cannot use hints like:

- `loading="lazy"`
- `decoding="async"`
- `fetchpriority`
- `srcset` / `sizes`

Because the homepage renders all cards immediately, every background image was eligible to load at startup.

Even after compressing the images from MB to KB, the count still mattered.

## Baseline

I measured the homepage locally with:

- cache disabled
- `1280x800` viewport
- headless browser
- local Vite dev server

Before optimization:

| Metric | Before |
| --- | ---: |
| Gym preview resources | 52 |
| Gym preview transfer | 8,388,940 bytes |
| Observed image requests including hero | 53 |
| Local elapsed time | 7.8s |

The issue was not only total size. The browser was also handling too many images at once.

## The Change

I replaced the CSS background image with a real `<img>` layer inside the card:

```svelte
{#if gym.imageUrl}
  <img
    class="absolute inset-0 h-full w-full rounded-2xl object-cover"
    src="{base}/{gym.imageUrl}"
    alt=""
    aria-hidden="true"
    loading={index < EAGER_CARD_IMAGE_COUNT ? 'eager' : 'lazy'}
    decoding="async"
  />
{/if}
```

`object-cover` keeps the same visual fit as `background-size: cover`.

I also capped eager previews:

```ts
const EAGER_CARD_IMAGE_COUNT = 6;
```

The first six card images load eagerly because they are likely to appear near the top. The rest are lazy.

## Why Use `decoding="async"`?

Downloading is only part of image cost. The browser also has to decode the file before painting.

With many images, decoding can compete with rendering. `decoding="async"` lets the browser avoid blocking the next paint on image decoding when it can:

```html
<img src="/gym-preview/example.webp" decoding="async" />
```

It does not reduce file size, but it can make image work less disruptive.

## Keeping the UI the Same

The preview image is decorative for accessibility because the gym name is already shown as text. The important part is empty alt text:

```svelte
alt=""
```

Stacking order kept the existing title, details, and destination button above the image layer.

I also added a component test to verify:

- exactly seven preview images render in the fixture
- the first six are eager
- the seventh is lazy
- preview images use `decoding="async"`
- the card click behavior still works
- clicking the destination button does not also trigger the card toggle

## After

After the change, using the same local measurement setup:

| Metric | Before | After |
| --- | ---: | ---: |
| Gym preview resources | 52 | 21 |
| Gym preview transfer | 8,388,940 bytes | 3,088,737 bytes |
| Observed image requests including hero | 53 | 22 |
| Local elapsed time | 7.8s | 4.9s |

The DOM still had all 52 gym cards, but only 6 preview images were eager. The other 46 were lazy-loaded.

The browser no longer had to fetch and decode every gym preview immediately.

## What This Does Not Prove

This was a local dev run, not a Core Web Vitals report. The run did not produce a useful LCP value, and the homepage hero image may still dominate LCP.

The narrower claim is:

- fewer initial image requests
- lower preview image transfer
- faster local elapsed time
- production LCP still needs real measurement

## Takeaway

If an image affects the visual experience, prefer a real `<img>` over a CSS `background-image`.

CSS backgrounds are fine for pure decoration, but real images give the browser better loading tools:

- lazy loading
- async decoding
- priority hints
- responsive image support later

In this case, changing the card photos from CSS backgrounds to real image layers kept the UI the same while substantially reducing the initial image waterfall.
