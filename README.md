## Introduction

CMP-LAB-Schedule is the frontend of a human resource management app designed for higher education. It is built with React and powered by Vite.

**Live Demo**: click [here](https://cmplab-messiah.college:3000/dept/demo)

## Contributing to the project

### Contentful

This project relies on the API of the headless CMS platform [Contentful](https://www.contentful.com/). Before you proceed to the next section, please sign up for a Contentful account, and have your space ID, Content Delivery API (CDA) token, and Content Management API (CMA) token at hand.

### Set up the project locally

1. Fork and clone the repo to your local machine

```bash
git clone https://github.com/benhuangbmj/cmp-lab-schedule.git
```

2. Install packages by running:

```bash
npm install
```

3. In the root directory of the project, run the `initialize` script. Enter the space ID and CDA/CMA tokens from your Contentful account upon the prompts:

```bash
node scripts/initialize.mjs
```
By far, you are linked with your Contentful space.

4. Some of the features use the face recognition library [face-api.js](https://github.com/justadudewhohacks/face-api.js). In order to run it properly, you need to load the computer-vision models. Download the files in [https://github.com/justadudewhohacks/face-api.js/tree/master/weights](https://github.com/justadudewhohacks/face-api.js/tree/master/weights) and place them in the directory `public/models`.
5. To start the development server, run:

```bash
npm run dev
```
