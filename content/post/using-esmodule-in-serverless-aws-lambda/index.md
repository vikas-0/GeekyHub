---
title: "Stop using serverless-webpack for AWS Lambda"
date: 2022-10-06T15:38:00+05:30
tags: ['AWS Lambda', 'NodeJS']
description: AWS Lambda has natively supported ES modules and top-level await since Node.js 14.x.
author: "Vikas Kumar"
ShowToc: false
TocOpen: false
draft: false
cover:
    image: "pexels-realtoughcandycom-11035380.jpg"
    relative: true
    alt: "Photo by RealToughCandy.com: https://www.pexels.com/photo/man-love-people-woman-11035380/ "
---

I often see Node.js Lambda projects built using Serverless and including serverless-webpack. It is used to implement Babel and provide the latest JavaScript syntax, especially modules and top-level await.

But according to this [blog post](https://aws.amazon.com/about-aws/whats-new/2022/01/aws-lambda-es-modules-top-level-await-node-js-14/), the AWS Lambda environment already supports these features, so we should no longer need to use serverless-webpack.

I face several drawbacks when using webpack with Serverless:
1. Code is transpiled (and optionally minified), making it challenging to debug from logs because line numbers and function names may differ from those in your development environment.
2. Using ESM-only modules, such as node-fetch and D3, is not straightforward, and the list of ESM-only modules is growing daily.
3. There could also be a performance impact because the code is converted to CommonJS. This [benchmark test](https://aws.amazon.com/blogs/compute/using-node-js-es-modules-and-top-level-await-in-aws-lambda/) shows that CommonJS could perform 43% worse than ESM.

There are other benefits to Babel and webpack besides transpiling to CommonJS, but these mostly cater to browsers rather than server-side usage.

How do you use ESM with Serverless? Just add `"type": "module"` to `package.json`, and it will work in Node.js 14.x and 16.x.
