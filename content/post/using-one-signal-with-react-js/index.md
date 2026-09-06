---
title: "How to use OneSignal with ReactJs"
date: 2021-01-09T18:16:00+05:30
tags: ['React', 'Tutorials', 'Javascript']
description: Exploring the possibility of using OneSignal with ReactJS and an existing service worker.
author: "Vikas Kumar"
ShowToc: false
TocOpen: false
draft: false
cover:
    image: "onesignal-react.png"
    relative: true
    alt: "OneSignal ReactJs"
---

Using OneSignal with React is fairly easy if you don't have an existing service worker. But if one already exists, things may not work as expected.

First, we will create a React app with a service worker.
````bash
npx create-react-app my-app --template pwa
````
This should create a folder named `'my-app'` containing all the app-related files. To check that everything is working, we can run the following commands. A browser tab should open with the ReactJS logo.
{{< figure src="cra-app-homepage.png">}}

Now we will enable the default service worker.

In `src/index.js`, change `unregister()` to `register()`.
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
But wait! The service worker will not run on the development server by default. We can change this behavior, but doing so is not recommended. The app should first be built and then served. To serve it, we need to install a static file server such as `serve`.
````sh
npm install -g serve
````
Then build and serve the app by running the following commands from the `my-app` folder.
````sh
npm run build
serve -s build
````
{{< figure src="chromedevtool.png" title="We can see that the worker is loaded, and the test push message object is logged in the console." width="500px">}}

## OneSignal Integration
The first few steps are pretty straightforward. Create a OneSignal account, create a new website, choose custom code, and fill in the site setup form as shown *(assuming we will be serving on port 5000)*.
{{< figure src="onesignal-setting.png">}}

After this step, we'll get a downloadable ZIP file (Web SDK) containing service workers. We'll extract `OneSignalSDKWorker.js` and `OneSignalSDKUpdaterWorker.js` and put them inside the public folder.

Finally, we'll get the custom code.
{{< figure src="onesignalcustomcode.png">}}

The first script tag will be placed in `public/index.html`.
````html {linenos=table,linenostart=39}
    <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
  </body>
</html>
````
The second script tag can be placed at the end of `index.js` after a few modifications for this demo.
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
Two more steps are necessary because the OneSignal service worker will replace the existing service worker.
1. We will make the OneSignal service worker the default by updating its path in `serviceWorkerRegistration.js`.
````js
window.addEventListener('load', () => {
  // const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  const swUrl = `${process.env.PUBLIC_URL}/OneSignalSDKWorker.js`;
````

2. We'll append `importScripts('/service-worker.js');` to `OneSignalSDKWorker.js` and `OneSignalSDKUpdaterWorker.js` so that our existing service worker can still be loaded.

Now a bell icon will appear at the bottom right. Clicking it will initiate the subscription option. You can test everything through the OneSignal dashboard.
{{< figure src="test-notification.png">}}

The OneSignal worker will now be able to show notifications, while the existing service worker will continue to log the object in the console.

This is probably not the most elegant solution, and there is clearly room to improve this approach, so feel free to comment.
