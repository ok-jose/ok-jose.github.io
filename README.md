# Jose's Blog

A personal blog, rebuilt in 2026 with [Astro](https://astro.build).

## Stack

- **Framework**: Astro 5
- **Content**: Markdown / MDX (Content Collections)
- **Deploy**: GitHub Pages via GitHub Actions

## Local Development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output to ./dist
npm run preview  # preview built site
```

## Writing a Post

Create a new `.md` or `.mdx` file under `src/content/blog/`:

```md
---
title: 'My Post Title'
description: 'Optional short description.'
pubDate: 2026-07-14
tags: ['something']
---

Your content here.
```

## Deploy

Pushes to `master` (or `main`) trigger `.github/workflows/deploy.yml`,
which builds the site and publishes to GitHub Pages.

## Legacy

The original 2017 Hexo static output is preserved locally but
gitignored — see `.gitignore`.
