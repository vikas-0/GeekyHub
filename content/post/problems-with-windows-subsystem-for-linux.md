+++
title= "Is Windows Subsystem for Linux Any Use?"
date= 2019-03-21T02:25:59+05:30
tags = ["Windows", "Linux", "Review" ]
description = "Problems With Windows Subsystem for Linux"
draft=false
[cover]
image = "images/dual.jpg"
alt = "Linux Subsystem"
+++
I was a long-term user of Arch Linux, but recently I decided to switch to Windows. Why? Because I needed to do some media editing, and I had heard about WSL, which promised a more comfortable life for developers on Windows.

## Installation 
So I installed a new SSD and started the Windows 10 installation process. The installation went smoothly. Then I opened PowerShell to activate the feature and downloaded Ubuntu from the Windows Store.
Finally, I launched Bash and installed _git_, _nodejs_, _npm_, _yarn_, _python_, and _pip_. I was excited to try it all out with Microsoft's own Visual Studio Code, as it was the only editor that officially supported WSL.
<!--more-->
## GIT
My first disappointment was Git. VS Code refused to detect the Git installation on Ubuntu. I searched for many workarounds, but none of them worked. So now I have a dual setup of Git: one Windows version and one Ubuntu version.

## NodeJS
The next step was Node.js development. VS Code's IntelliSense worked for Node.js, but this feature doesn't require a Node.js setup in the editor. I tried debugging, which also worked flawlessly; I just had to add a parameter to the `launch.json` file to use WSL. The real problem started when I decided to use the ESLint plugin. The editor couldn't find the files. The only working solution was to access the Linux file system directly, which the WSL documentation strongly advises against. So now I have a dual setup of Node.js.

## Python
Python offered none of the advantages JavaScript did. Even for IntelliSense, I had to use a native installation.

## SSH
Finally, I gave up on VS Code integration and thought WSL would be useful for connecting to my EC2 instances over SSH because everybody knows how painful it is to do that in Windows through PuTTY. But Windows file permissions wouldn't even let me do this. The console presented the message _"WARNING: UNPROTECTED PRIVATE KEY FILE!"_ Then I learned that I couldn't set the file permissions because WSL was using the Windows file system. Now I have a separate PuTTY configuration for connecting to EC2.

My conclusion is that Microsoft's promise of a development environment that feels like home is a failure. What is your opinion?


