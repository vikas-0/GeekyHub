+++
title= "WSL and Visual Studio Code Are Making Windows Better"
date= 2020-02-17T01:48:59+05:30
tags = ["Windows", "Linux", "Review", "VSCode", "Code Editor" ]
description = "Some new updates to WSL are finally making Windows worthy of developers."
draft=false
[cover]
image = "/images/silver-and-black-dell-laptop.jpg"
alt = "Laptop"
+++

Many developers would agree that Windows is not known for being developer-friendly unless you are developing for the Windows ecosystem. Linux distributions, on the other hand, are very good for development, especially considering that most of your builds will run on Linux-based servers.
<!--more-->
## Microsoft Is Continuously Trying to Fix It
Microsoft is continuously improving PowerShell and has launched the new Windows Terminal, but these still can't match the speed and community support of developing on a Linux box. To work around this issue, Microsoft has WSL.

In my previous post, ["Is Windows Subsystem for Linux Any Use?"]({{< ref "problems-with-windows-subsystem-for-linux.md" >}}), I heavily criticized its lack of support from GUI editors. But that changed on May 3, 2019, when Microsoft released the [Remote Development extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) for Visual Studio Code. The flaws I described in my previous article are now obsolete. WSL still has some flaws, but they are at an acceptable level.

> **Note**: JetBrains IDEs also claim to support this, but I have yet to test them. My
whole workflow is now in VS Code.

With this extension installed, I can just type _"code ."_ in the Ubuntu terminal, and VS Code will launch with WSL connected, so there is no configuration to do.
{{< figure src="/images/ubuntuWSL.png" title="Ubuntu on WSL" >}}
The terminal will be Bash, and by default it will use the Git installation in Ubuntu and run language support and linters using binaries installed there. You may still need to reinstall some extensions in remote mode, but you don't have to figure this out yourself. VS Code will automatically prompt you, and it can be done with a single click. On top of all this, WSL 2 is around the corner and is expected to improve remote development.
{{< figure src="/images/vscodeonremotewsl.png" title="VisualStudio Code running with Remote Development for WSL" >}}
## Now the Question Remains
If Linux is better for development, why don't we just use a Linux distribution? That would be the right approach and would be easier for beginners. I still recommend that new developers avoid this setup and use a Linux distribution instead. But this approach is really helpful for people who use software without a good Linux counterpart or whose hardware is not well supported by Linux.

