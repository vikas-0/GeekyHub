---
title: "How to Create a UPI Payment Link in HTML"
date: 2020-11-06T08:25:00+05:30
tags : ["HTML", "Development"]
description : "Creating UPI link in HTML"
draft: false
---

**TLDR** - The URL scheme is _upi://pay?pn=\<Name>&pa=\<UPI ID>&cu=\<Currency Code>_

<!--more-->

All UPI apps support this custom URL scheme, but many websites don't seem to use it. When you click this type of link, the "Open With" menu will appear with a list of all the UPI applications on your phone. If you are on a mobile device, you can try this link: [upi://pay?pn=Vikas%20Kumar&pa=vikaskr@freecharge&cu=INR](upi://pay?pn=Vikas%20Kumar&pa=vikaskr@freecharge&cu=INR). It should redirect you to a UPI app.

{{< figure src="/images/upi_custom_url_scheme.png" title="UPI URL Scheme in Action" >}}

Although this link will not work on your computer, you can use a media query to replace it with a QR code. Alternatively, you can use JavaScript to detect whether the URL scheme is supported, but in my tests, that approach did not seem reliable.
