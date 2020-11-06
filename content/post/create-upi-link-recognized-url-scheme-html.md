+++
title= "How to create UPI Payment link in HTML"
date= 2020-11-06T08:25:00+05:30
tags = ["HTML", "Developemt"]
description = "Windows Notepad alternatives with Fluent Design"
draft=false

+++

**TLDR** - The URL scheme is _upi://pay?pn=\<Name>&pa=\<UPI ID>&cu=\<Currency Code>_

<!--more-->

All UPI apps support this custom URL scheme, but many don't seem to be using it. When you click this type of link when you click, the 'Open With' menu will appear with a list of all the UPI applications on your phone. If you are on mobile device you can try link [upi://pay?pn=Vikas%20Kumar&pa=vikaskr@freecharge&cu=INR](upi://pay?pn=Vikas%20Kumar&pa=vikaskr@freecharge&cu=INR), it should redirect to an UPI app

{{< figure src="/images/upi_custom_url_scheme.png" title="UPI URL Scheme in Acion" >}}

Although this link will not work on your computer, you can solve it with the help of media query and replace it with a QR code. Or you can use javascript to detect if the URL scheme is supported or not, but as far as I tried, it didn't seem reliable to me.

