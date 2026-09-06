---
title: "How to Use xclip in GNOME Wayland"
date: 2018-02-03T02:34:16+05:30
draft: false
description : "TLDR, just use xclip -selection c"
tags: ["linux", "Softwares"]
---
Since the mainstream launch of Wayland with GNOME, people have faced problems using xclip, mainly because xclip is designed to work with the X11 clipboard.

Fortunately, xclip has an option to overcome this problem.
Just use *xclip -selection c* instead of *xclip*. This option emulates the *Ctrl + Shift + C* action.

For easier use, you can set up an alias by adding the following line to your *.bashrc* or *.zshrc* file.

````bash
alias xclip='xclip -selection c'
````
