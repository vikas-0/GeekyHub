---
title: "Some 'cool' things Visual Studio Code can do you may haven't known"
date: 2017-09-28T16:35:16+05:30
draft: false
ogimage : "images/vscodecover.png"
description : "VSCode has established as a good text editor. Now let's check out some of it's cool features"
tags: ["Code Editor", "Softwares"]
---
Mircosoft's [Visual Studio Code](https://code.visualstudio.com/) has proven to be the dark horse of code editors. Don't confuse yourself by seeing Microsoft as it is completely free, open source and MIT licensed.

Even being late to the party, it has attracted enough users. The reason behind this is a perfect balance between speed, features, and hackability.

<!--more-->
If you are new to this editor, these are some features you should be known to improve your productivity.

# 1. Code Differs

The files in your project look same but there are some differences. You spotted few of them just by gazing but there is still a chance of missing something. So why risk, just type the following command in your terminal and bam! VS Code will spot all the differences for you
    
    $code <first-file> <second-file>

{{< figure src="/images/vscodediffer.png" title="VSCode Differ" >}}

# 2. Font Legatures
In typography, a ligature occurs where two or more letters are joined as a single glyph such as æ formed after joining a and e. In programming there are many token which are combination of two or more characters.
An example would be < and = . [FiraCode](https://github.com/tonsky/FiraCode) is programming ligature which will show <= and many other token as single character. And FiraCode is easily installable in VSCode which isn't even supported by famous Sublime Text.

{{< figure src="/images/firacode.jpg" title="Left: Without Firacode, Right: With Firacode" >}}


# 3. Type Checking in Javascript
Typescript is typed superset of javascript. But in VSCode you can do all that in plain javascript by adding
        
        //@ts-check

at top of the javascript file

{{< figure src="/images/ts-check-in-javascript.gif" title="Demo for property and type checking" >}}

# 4. The Printable shortcut Cheatsheet
A code editor is never good without good shortcut keys. VSCode offers a printable cheatsheet which you can paste on wall for quick learning. It contains shortcuts for important features like multiple cursors, integrated terminals, file management etc. Go explore it. 

Download shortcut cheatsheet for
[Windows](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf),
[Linux](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf) and 
[Mac](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf).

# 5. Change Case of variables

Just select a variable (you can select multiple variables too), open Command Palette by pressing F1, Type change case and choose the case you want.
{{< figure src="/images/vscodechangecase.gif" title="Changing variable case in VSCode" >}}
