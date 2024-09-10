# Contributing to the project

## Contentful

This project relies on the API of the headless CMS platform [Contentful](https://www.contentful.com/). Before you proceed to the next section, please sign up for a Contentful account, and have your space ID, Content Delivery API (CDA) token, and Content Management API (CMA) token at hand.

## Set up the project locally

1. Fork and clone the repo to your local machine

```bash
git clone https://github.com/benhuangbmj/cmp-lab-schedule.git
```

2. Install packages by running:

```bash
npm install
```

3. In the root directory, run the `initialize` script. Enter the space ID and CDA/CMA tokens from your Contentful account upon the prompts:

```bash
node scripts/initialize.mjs
```

4. To start the development server, run:

```bash
npm run dev
```
