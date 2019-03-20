+++
title= "Windows subsystem for Linux is of any use?"
date= 2019-03-21T02:25:59+05:30
tags = ["Windows", "Linux", "Review" ]
description = "Problems With Windows Subsystem for Linux"
draft=false
ogimage = "images/dual.jpg"
+++

{{< figure src="/images/dual.jpg">}}

I was a long term user of Arch Linux. But recently I decided to switch to  Windows. Why? Because I needed to do some media editing and I heard about WSL which promises a more comfortable life for developers on Windows.

## Installation 
So I installed a new SSD and started my Windows 10 installation process. Installation went smooth. Then I opened PowerShell to activate the feature and downloaded Ubuntu from the Windows Store.
 Finally, I launched bash and installed _git_, _nodejs_, _npm_, _yarn_, _python_, _pip_. I was excited to try it all out on Microsoft own Visual Studio Code as it is the only editor which officially supports WSL.
<!--more-->
## GIT
My first bummer was GIT. VSCode refused to detect git installation on Ubuntu. I googled many workarounds and none of those worked. So now I have the dual setup of GIT, one Windows version and one Ubuntu version.

## NodeJS
Next step was node development. VSCode's intellisense worked for NodeJs, but this feature doesn't require a node setup in this editor. I tried debugging which also worked flawlessly as I just had to as a parameter in the launch.json file to use WSL. The real problem started when I decided to use ESlint plugin. The editor couldn't find the files. The only working solution was to directly access the Linux file system which is strongly advised in WSL documentation to avoid. So now I have a dual setup of NodeJS.

## Python
Python had no perks of the JavaScript. Even for intellisense, I had to go for native installation. 

## SSH
Finally, I gave up on VScode integration and thought it would be useful for SSHing to my EC2 instances because everybody know how painful to do that in Windows through Putty. But file permissions on Windows didn't let me do even this. Console presented me a message _" WARNING: UNPROTECTED PRIVATE KEY FILE!"_. Then I got to know that I can't set file permissions too as it uses Windows file system. Now I have a separate Putty configuration to connect to EC2.

So my conclusion is that Microsoft's claim that the development environment which feels like home is a failure. What is your opinion?



