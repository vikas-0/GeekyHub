+++
title= "Build a Simple WhatsApp Bot in Python Using Selenium"
date= 2017-10-20T17:51:16+05:30
draft= false
description = "DIY Article for building a simple WhatsApp bot using Python and Selenium"
tags= ["DIY","Python"]
[cover]
image = "/images/robots-764951_640.png"
alt = "Whatsapp Bot"
hidden = true
+++

{{< figure src="/images/robots-764951_640.png">}}

Selenium is a web automation package available for all popular languages. To learn more about Selenium, you can refer to the [official Selenium documentation](http://docs.seleniumhq.org/).
Here, we will make a simple WhatsApp bot using Python and Selenium that replies to every message with the current time.

## Installing Selenium

First, we need to install Selenium for Python by running the following command in a terminal.

````bash
pip install selenium 
````

Selenium also requires a driver to interface with the chosen browser. For Firefox, we need to install geckodriver. Without the proper driver, you will get a _WebDriverException_.

Download the latest geckodriver from [Mozilla's GitHub repository](https://github.com/mozilla/geckodriver/releases) and add it to your path.

<!--more-->
## Start Coding
Now we are ready to proceed.
Create a new Python file, _bot.py_, and add the necessary imports.

````python
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
````
Now we will create and initialize a Firefox WebDriver and make a GET request to open the WhatsApp Web URL.

````python
driver = webdriver.Firefox()
driver.get('http://web.whatsapp.com')
print('Please Scan the QR Code and press enter')
input()
````

The _print_ and _input_ functions are there just to give us time to scan the QR code and connect our phone's WhatsApp account. Once we are connected, we can press Enter to continue executing the code.

Once the WhatsApp Web interface is open, we need to look for unread messages. Thankfully, each unread message in the left pane is an individual HTML element with the CSS classes `chat` and `unread`.

WebDriver has a function that finds elements by CSS selector and returns the first element matching the given argument. We will make use of this function.

````python
content = driver.find_element_by_css_selector('.chat.unread')
content.click()
input_form = driver.find_element_by_css_selector('.pluggable-input-placeholder')
input_form.send_keys(str(datetime.now()),Keys.RETURN)
````

The code snippet above is very simple. We select the first element with the classes _chat_ and _unread_ and click it. Then we find the message box, which is an HTML element with the class _pluggable-input-placeholder_. The _send_keys_ function sends keyboard events to the element, so we send the current time and the Return key (Enter) to send the message.

As I have already mentioned, the function _find_element_by_css_selector_ returns only the first element for a given argument, so we need to put the whole snippet in a loop. Also, when there is no matching element, it throws _NoSuchElementException_, so enclosing the code in a _try_/_except_ block is necessary.

The final code is:
````python
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException

driver = webdriver.Firefox()
driver.get('http://web.whatsapp.com')
print('Please Scan the QR Code and press enter')
input()
while True:
    try:
        content = driver.find_element_by_css_selector('.chat.unread')
        content.click()
        input_form = driver.find_element_by_css_selector('.pluggable-input-placeholder')
        input_form.send_keys(str(datetime.now()),Keys.RETURN)
    except NoSuchElementException:
        pass
````
This code is just a proof of concept; you can improve it for better performance.
