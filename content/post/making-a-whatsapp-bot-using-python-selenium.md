+++
title= "Build a Simple WhatsApp bot in Python using Selenium"
date= 2017-10-20T17:51:16+05:30
draft= false
ogimage = "images/robots-764951_640.png"
description = "DIY Article for building a simple WhatsApp bot using Python and Selenium"
tags= ["DIY","Python"]
+++

{{< figure src="/images/robots-764951_640.png">}}

Selenium is a web automation package available for all popular languages. To know more about selenium you can refer to [official Selenium docs](http://docs.seleniumhq.org/).
Here, we will be making a simple WhatsApp bot using Python and Selenium which will reply the current time for every message. 

## Installing Selenium

So, first of all, we need to install Selenium for Python by running following command in terminal.

````bash
pip install selenium 
````

Selenium also requires a driver to interface with the chosen browser. For Firefox, we need to install geckodriver. Without proper driver, you will get _WebDriverException_.

Download latest geckodriver from [Mozilla's GitHub Repo](https://github.com/mozilla/geckodriver/releases) and add to the path.

<!--more-->
## Start Coding
Now we are ready to proceed.
Make a new Python file i.e. _bot.py_ and make some necessary imports.

````python
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
````
Now we will create and initialize Firefox WebDriver and make a get request to open Whatsapp Web URL.

````python
driver = webdriver.Firefox()
driver.get('http://web.whatsapp.com')
print('Please Scan the QR Code and press enter')
input()
````

The _print_ and _input_ functions are there just to give us time to scan the QR code to connect our phone's WhatsApp. Once we are connected we can hit enter to continue further execution of code.

Once the WhatsApp Web interface is open, we need to look for unread messages. Thankfully, all unread messages in left pane are individual HTML element with CSS class 'chat unread'.

WebDriver have a function to find elements by CSS selector which will return the first element with the given argument. We will make use of this function.

````python
content = driver.find_element_by_css_selector('.chat.unread')
content.click()
input_form = driver.find_element_by_css_selector('.pluggable-input-placeholder')
input_form.send_keys(str(datetime.now()),Keys.RETURN)
````

Above code snippet is very simple. We are selecting first element with class _chat_ and _unread_ and clicking it. Then we need to find message box which is an HTML element with class _pluggable-input-placeholder_. _send_keys_ function will send the keyboard event to the element. So we send the current time and RETURN key(Enter Key) to send the message.

As I have already mentioned that function _find_element_by_css_selector_ will return only first element for given argument, So we need to put the whole snippet in a loop. Also, when there is no such element for the argument it will throw _NoSuchElementException_, so enclosing with _try_ _except_ is also necessary.

The final code will be
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
This code is just a proof of concept, you can obviously improve it for better performance.