---
title: "How to use 'xclip in Gnome Wayland'"
date: 2018-02-03T02:34:16+05:30
draft: false
description : "TLDR, just use xclip -selection c"
tags: ["linux", "Softwares"]
---
Since first mainstream launch of Wayland with Gnome, people are facing problem in using xclip. Mainly because xclip is supposed to work with X11 Clipboard.

But fortunately there is an option in xclip to overcome this propblem. 
Just use *xclip -selection c* instead of *xclip*. This option will just emulate the *ctrl + shift + c* action.

For easier use you can setup the alias by adding following line in *.bashrc* or *.zshrx* file.

````bash
alias xclip='xclip -selection c'
````
