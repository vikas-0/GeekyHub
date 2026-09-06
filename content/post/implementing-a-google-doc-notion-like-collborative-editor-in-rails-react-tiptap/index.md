---
title: "How to Use Tiptap's Collaboration Feature with Rails Action Cable"
date: 2024-06-18T20:55:00+05:30
tags: ['Rails', 'Tutorials', 'React', 'DIY', 'Development']
description: Create a collaborative text editor like Notion using Tiptap for rich text, ReactJS for the frontend, and Rails with Action Cable for real-time updates. Enable simultaneous editing and instant synchronization across users for a seamless collaborative experience.
author: "Vikas Kumar"
ShowToc: false
TocOpen: false
draft: false
cover:
    image: "collaboration.jpg"
    relative: true
    alt: "Three professionals collaborating on a single sheet of paper"
---

In this post, we'll walk through setting up Tiptap's collaboration feature with Rails Action Cable and ReactJS. Tiptap is a powerful headless editor built on ProseMirror, and when combined with Y.js, it allows for real-time collaborative editing. We'll use the Mantine component library, but it isn't mandatory for this setup.

If you prefer to dive directly into the code, check out the example on [GitHub](https://github.com/vikas-0/collab_demo).

{{< youtube id=HXpudWU5FxQ loop=true >}}

### Prerequisites

Ensure you have the following installed:

- Ruby on Rails
- Redis
- Node.js and Yarn
- Your preferred method of setting up React with Rails

### Step 1: Setting Up Mantine

First, we'll set up Mantine for styling. Follow the [Mantine guide for Vite](https://mantine.dev/guides/vite/) to install the necessary packages. The same method worked for me with esbuild, but you can do it your own way or choose not to use Mantine.

```bash
yarn add @mantine/core @mantine/hooks @mantine/tiptap @tabler/icons-react @tiptap/react @tiptap/extension-link @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-collaboration-cursor @tiptap/extension-collaboration yjs y-prosemirror
yarn add --dev postcss postcss-preset-mantine postcss-simple-vars
```

> Note: This setup includes both Mantine and Tiptap. If you do not require Mantine, skip installing Mantine-related dependencies.

### Step 2: Install Rails Dependencies

```bash
bundle add redis y-rb_actioncable y-rb
```

Here, we are installing the Y.js adapters for Ruby and Action Cable.

### Step 3: Configure Tiptap with Collaboration

In the Tiptap setup, configure StarterKit with `history: false`, as the Collaboration extension comes with its own history management. Additionally, we’ll add a random color generator for collaboration cursors.

```javascript
function getRandomColor() {
    const colors = ["#ff901f", "#ff2975", "#f222ff", "#8c1eff"];

    const selectedIndex = Math.floor(Math.random() * (colors.length - 1));
    return colors[selectedIndex];
}
```

```javascript
const editor = useEditor({
        extensions: [
            StarterKit.configure({ history: false }),
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: 'This is placeholder' }),
            Collaboration.configure({
                document: doc // Configure Y.Doc for collaboration
            }),
            CollaborationCursor.configure({
                provider,
                user: {
                    name: "Vikas",
                    color: getRandomColor()
                }
            })
        ]
    });
```

Next, add the code that connects to the WebSocket provided by Action Cable. Don't worry about creating the channel yet; we will create it later. Assuming the channel name will be `SyncChannel`, add the following code. Here, the ID is hard-coded because this is just a demo. We won't use proper authentication on the backend either, in order to keep things simple.

```javascript
// ... other imports
import { createConsumer } from "@rails/actioncable"
import { WebsocketProvider } from "@y-rb/actioncable";

const consumer = createConsumer();
const doc = new Y.Doc()

const provider = new WebsocketProvider(
    doc,
    consumer,
    "SyncChannel",
    {
        id: 1
    }
);

// ... other code
```

You can see the full frontend code in [App.jsx](https://github.com/vikas-0/collab_demo/blob/main/app/javascript/App.jsx). It contains everything in a single file, which isn't ideal but is good enough for this example.

### Step 4: Set Up Rails Action Cable

Create a new channel named `SyncChannel` at `app/channels/sync_channel.rb`.

```ruby
# frozen_string_literal: true
class SyncChannel < ApplicationCable::Channel
  include Y::Actioncable::Sync

  def subscribed
    # initiate sync & subscribe to updates, with optional persistence mechanism
    sync_for(session) { |id, update| save_doc(id, update) }
  end

  def receive(message)
    # broadcast update to all connected clients on all servers
    sync_to(session, message)
  end

  def doc
    @doc ||= load { |id| load_doc(id) }
  end

  private

  def session
    @session ||= Session.new(params[:id])
  end

  def load_doc(id)
    data = REDIS.get(id)
    data = data.unpack("C*") unless data.nil?
    data
  end

  def save_doc(id, state)
    REDIS.set(id, state.pack("C*"))
  end
end
```

This example assumes that Redis is initialized as `REDIS`; replace it with the name of your Redis variable. We also created a `Session` model for the `sync_for` method. You can check the documentation for `sync_for` [here](https://y-crdt.github.io/yrb-actioncable/Y/Actioncable/Sync.html#sync_for-instance_method).

```ruby
# frozen_string_literal: true

class Session
  attr_reader :id

  def initialize(id)
    @id = id
  end

  def to_s
    "sessions:#{id}"
  end
end
```

Finally, `ApplicationCable::Connection` will look like this:

```ruby
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :id

    def connect
      self.id = SecureRandom.uuid
    end
  end
end
```

### Step 5: Add Styles for the Collaboration Cursor (Optional)

Everything should be working by now. The cursor looked odd, so you can add some [CSS](https://github.com/vikas-0/collab_demo/blob/main/app/javascript/App.css) to make it look good.

Finally, you can run your Rails server. It should be good to go once you add all the missing pieces, especially authorization.

### Conclusion
By following these steps, you should have a real-time collaborative editor up and running using Tiptap, Y.js, and Rails Action Cable. While we used Mantine for styling in this demo, you can customize the styling to suit your requirements. This setup provides a robust foundation for building collaborative applications with rich-text editing capabilities.
