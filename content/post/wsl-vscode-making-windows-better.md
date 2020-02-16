+++
title= "WSL and Visual Studio Code is making Windows better"
date= 2020-02-17T01:48:59+05:30
tags = ["Windows", "Linux", "Review", "VSCode", "Code Editor" ]
description = "WSL and Visual Studio Code making Windows better for Developers"
draft=false
ogimage = "images/silver-and-black-dell-laptop.jpg"
+++

{{< figure src="/images/silver-and-black-dell-laptop.jpg">}}

Many developers would agree that Windows is not known to be developer-friendly until you aren’t developing for the Windows ecosystem. Linux distros, on the other hand, are very good for development especially adding the fact that most of your build is going to run on Linux based servers.
<!--more-->
## Microsoft is continuously trying to fix it
They are continuously improving PowerShell, launched new Windows Terminal but they still can’t match the swiftness and community support of developing on Linux box. To pull around this issue, they have WSL.

In my previous post ["Windows subsystem for Linux is of any use?"]({{< ref "problems-with-windows-subsystem-for-linux.md" >}}), I heavily criticizes how it is unusable due to the lack of any GUI editor respecting it. But on the 3rd of May 2019, it changed. Microsoft released the [Remote Development extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) for the Visual Studio Code. Now all the flaws I stated in my previous article are invalid (it still has some flaws but it is at an acceptable level).

> **Note**: JetBrains IDE also claims to support this, but I am yet to test it. My
whole workflow is now in VS Code.

With this extension installed, now I can just type _"code ."_ in Ubuntu terminal and VScode code will launch with WSL connected to it, so there are no configs to do.
{{< figure src="/images/ubuntuWSL.png" title="Ubuntu on WSL" >}}
The terminal will be bash and by default, it will use git installed in ubuntu, will run language support and linters from binaries installed in ubuntu. There still may need to reinstall some extensions in remote mode, but you don’t have to figure it out. VS Code will automatically prompt you and can be done by a single click. With all this, there is WS2 around the corner which is supposed to improve remote development.
{{< figure src="/images/vscodeonremotewsl.png" title="VisualStudio Code running with Remote Development for WSL" >}}
## Now the question remains.
That if Linux is better for development then why don’t we use a Linux distro. That will be the right approach and easier for beginners. I’ll still recommend new developers to avoid this and use a Linux distro. But this approach is really helpful for those who use some software that doesn’t have good Linux counterpart or simply the hardware they are using is not well supported in Linux.


