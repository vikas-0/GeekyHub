---
title: "How to use OneSignal with ReactJs"
date: 2021-01-09T18:16:00+05:30
tags: ['React', 'Tutorials', 'Javascript']
description: Exploring the possiblity to use OneSignal with ReactJs with existing service worker
author: "Vikas Kumar"
ShowToc: false
TocOpen: false
draft: false
cover:
    image: "onesignal-react.png"
    relative: true
    alt: "OneSignal ReactJs"
---

Using OneSignal with react is fairly easy if one doesn't care about existing service-worker. But if there is an existing service worker, things may not work as is expected.

First, we will create a react app with a service-worker. 
````bash
npx create-react-app my-app --template pwa
````
This should create a folder named `'my-app'` containing all the app-related files. To check everything is fine, we can run the following commands, and a browser tab should open with the ReactJs logo.
{{< figure src="cra-app-homepage.png">}}

Now we will enable the default service worker.

In `src/index.js` change `unregister()` to `register()`.
````js
// serviceWorkerRegistration.unregister();
serviceWorkerRegistration.register();
````
Let us add some code in the service worker (`src/service-worker.js`) to send a test push message from Chrome DevTools.

````js {linenos=table,linenostart=72}
// Any other custom service worker logic can go here.

self.addEventListener('push', (event) => {
  console.log(event.data);
});
````
But wait! the service worker will not run in the dev server by default. We can change this behavior, but it's not recommended to do so. It should be built first and then served. To serve, we need need to install a static file server such as `serve`.
````sh
npm install -g serve
````
Then build and serve by running following commands form `my-app` folder.
````sh
npm run build
serve -s build
````
{{< figure src="chromedevtool.png" title="We can see that the worker is loaded, and the test push message object is logged in the console." width="500px">}}

## OneSignal Integration
The first few steps are pretty straightforward. Create an OneSignal account, then create a new website and choose custom code and fill site setup form as shown *(Assuming we will be serving on port 5000)*.
{{< figure src="onesignal-setting.png">}}

Post this step; we'll get a zip file (Web SDK) containing service workers to download. We'll have extract files `OneSignalSDKWorker.js` , `OneSignalSDKUpdaterWorker.js` and put them inside the public folder.

And then finally we'll get the custom code.
{{< figure src="onesignalcustomcode.png">}}

The first script tag will be placed in `public/index.html`.
````html {linenos=table,linenostart=39}
    <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
  </body>
</html>
````
Second script tag can be put into at the end `index.js` after few modification for this demo.
````js
window.OneSignal = window.OneSignal || [];
window.OneSignal.push(function() {
  window.OneSignal.init({
    appId: "eb29dedd-4af2-4fa8-b73a-39bc2e7cc6d5",
    notifyButton: {
    enable: true,
    },
    allowLocalhostAsSecureOrigin: true,
  });
});
````
Two more steps are necessary as, OneSignal service-worker will replace the existing service-worker.
1. We will make OneSignal Service worker as default service-worker by updating path in `serviceWorkerRegistration.js`
````js
window.addEventListener('load', () => {
  // const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  const swUrl = `${process.env.PUBLIC_URL}/OneSignalSDKWorker.js`;
````

2. We'll append `importScripts('/service-worker.js');` in `OneSignalSDKWorker.js` and `OneSignalSDKUpdaterWorker.js`, so that our existing service worker can still be loaded.

Now a bell icon will appear at bottom right and clicing on that will intiate subscribe option. Things can be tested through OneSignal dashboard.
{{< figure src="test-notification.png">}}

Now the OneSignal worker will be able to show notification, as well as the existing service worker will also log the object in console.

This is probably not the most elegant way and there is obviously scope of improvment in this approach so feel free to comment.

