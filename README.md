# ARM webapp

As it is lol

## Getting Started

These instructions should get you started. LMK if things don't start up.

### Prerequisites

Install nodejs and make sure you're on the newest version of node and npm

:sleeping: Or yarn if you want to...

### Installing

Download the project to your local directory
```
git clone https://github.com/goodoomoodoo/arm-webapp.git
```

Install required dependencies
```
npm i
```

Once all dependencies are successfully installed the webapp can be easily started
by `npm start` and the webapp should be hosted on `localhost:3000`

## Overview

This is the summary of the directory tree of the app. I've left out few because
they aren't relevant to the core of the app.

```
arm-webapp
├── artifacts
├── public
├── src ********************************
│   ├── components
│   │   ├── DevContainer.js
│   │   ├── Home.js
│   │   ├── Rblock.js
│   │   └── Rcontainer.js
│   ├── js  #likely be moved to backend
│   │   └── Insturction.js
│   ├── redux
│   │   ├── actions
│   │   |   └── index.js
│   │   ├── reducers
│   │   |   └── index.js
│   │   ├── store
│   │   |   └── index.js
│   │   └── constants.js
│   ├── styles
│   │   ├── DevContainer.css
│   │   ├── Home.css
│   │   ├── Rblock.css
│   │   └── Rcontainer.css
│   ├── app.css
│   ├── App.js
│   └── index.js
│ ***************************************
├── tmp
├── .babelrc
├── .eslintrc
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── static.config.js
└── yarn.lock
```

I put stars around the src directory, which we would mainly focus on.

In short,

components contains the React components <br />
styles contains the css file to the corresponding React components <br />
redux contains the redux store <br />
js constains the logics <br />

In detail,

components dir
- Rblock is the register block
- Rcontainer contains the Rblocks
- DevContainer contains the development interface

js dir
- :construction: Still working on the documentation... may never be out...

## Built With

**__REACT__** that's what you need to know mostly

[![Netlify Status](https://api.netlify.com/api/v1/badges/95af172f-729a-4f2d-acdb-9f643196ebc2/deploy-status)](https://app.netlify.com/sites/naughty-wing-4b1b2f/deploys)
