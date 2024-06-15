---
title: "Seamless Remote Development with Any IDE Using Unison for Bidirectional SSH Sync"
date: 2024-05-15T11:51:00+05:30
tags: ['Remote Development', 'Tutorials', 'Code Editor', 'Tips']
description: SSH Development with Any Editor, Unison helps maintain a local copy and enables bidirectional sync, allowing you to use any tool, even Notepad, to edit your code efficiently.
author: "Vikas Kumar"
ShowToc: false
TocOpen: false
draft: false
cover:
    image: "ssh-development-with-zed-and-other-editors.png"
    relative: true
    alt: "Using any IDE on Remote developement"
---


If your development environment is on a remote server, you might need to code on the remote machine itself to see the effects of your changes in real time. This scenario is fairly common these days as applications become more complex, and setting up a local development environment requires extensive configuration or mocking of the resources used in the app.

In this case, you are left with very few options for code editors. Either you have to use CLI-based editors such as Vim, or you can use VSCode with the [Remote SSH extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh). Even with the extension, there are some issues related to code analysis and code completion. These processes have to happen on the remote machine, making your powerful local PC underutilized. And if you want to use Zed or Xcode, you are out of luck.

So, the solution is to have a local copy that is synced with the remote SSH directory. You can use several tools for this:

- **Rsync**:
  - Unidirectional sync, which might be fine for development as you will use the local machine's copy to manage changes on the SSH server.
  - Does not support file deletion.

- **SSHFS**:
  - Limited support on macOS.
  - Requires kernel changes, making it impractical for use on some machines.

- **Unison**:
  - Supports bidirectional sync.
  - Handles file deletions.
  - Fault-tolerant: even if the connection breaks, you can restart it, and it will continue syncing from the last known point.

This leaves Unison as the ideal choice for me.

[Unison](https://github.com/bcpierce00/unison) has fairly good documentation; you can go ahead and check their documents and explore on your own.

# Installing Unison

You need to install Unison on both the host and remote machine. If you don't have sudo access on the remote machine, don't worry; you can download the binary and keep it anywhere.

- **Installing Unison on Mac local machine:**
    - `brew install unison`
    - `brew install autozimu/homebrew-formulas/unison-fsmonitor`

- For Linux, you can follow the [official guide](https://www.cis.upenn.edu/~bcpierce/unison/download/releases/stable/).

- Make sure to create a local folder to sync code from the remote machine.

- **Run a test connection:**
    - Example command: `unison -testServer ssh://user@remotehostname/path/to/folder /path/to/folder`
    - If you get an error that Unison is not found on the remote server, specify the exact path to Unison using `-servercmd`. For example: `unison -testServer ssh://user@remotehostname/path/to/folder /path/to/folder -servercmd /home/path/to/unison/bin/unison`.

- **Final command for syncing:**
    - Once the connection test is successful, start syncing with the final command:
      ```
      unison ssh://user@remotehostname/path/to/folder /path/to/folder -servercmd /home/path/to/unison/bin/unison -ignore "BelowPath node_modules" -ignore "BelowPath .git" -force newer -repeat watch
      ```
    - This command will sync all files and continue monitoring for further changes in the background while you develop. If you want to know the meaning of flags used here like `ignore`, `force` etc, you can check [Unison user mannual](https://github.com/bcpierce00/unison/wiki).

You can use any code editor to modify the local copy, and Unison will automatically sync the changes.