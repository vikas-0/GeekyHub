---
title: "Stop using serverless-webpack for AWS Lambda"
date: 2022-10-06T15:38:00+05:30
tags: ['AWS Lambda', 'NodeJS']
description: AWS Lambda natively supports ES Module and top level await since node 14.x
author: "Vikas Kumar"
ShowToc: false
TocOpen: false
draft: false
cover:
    image: "pexels-realtoughcandycom-11035380.jpg"
    relative: true
    alt: "Photo by RealToughCandy.com: https://www.pexels.com/photo/man-love-people-woman-11035380/ "
---

I see that nodejs lambda projects are built using serverless and often include serverless-webpack. It is used to implement babel and get the latest javascript syntaxes, especially module and top-level awaits.

But as per this [blog post](https://aws.amazon.com/about-aws/whats-new/2022/01/aws-lambda-es-modules-top-level-await-node-js-14/), the AWS lambda environment already supports these features, so we should no longer need to use serverless-webpack.

There are some cons that I face while using webpack in serverless.
1. Code is transpiled (and optionally minified), making it challenging to debug from logs, as line numbers and function names may not be the same per your development environment.
2. Using ESM only module is not straightforward. Such as node-fetch and d3, and the ESM-only module list is growing daily.
3. There could also be a performance impact as the code will be converted to commonJS, and this [benchmark test](https://aws.amazon.com/blogs/compute/using-node-js-es-modules-and-top-level-await-in-aws-lambda/) shows that commonsJS could perform 43% worse than ESM.

There are other benefits of babel and webpack besides transpiling to commonJS. But these are mostly catered towards browsers and not serverside usage.

How to use ESM in serverless? Just add `"type": "module"` in `pacakge.json` in it will work in node 14.x and node 16.x.

