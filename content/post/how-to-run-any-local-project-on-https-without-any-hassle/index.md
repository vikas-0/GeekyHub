---
title: "How to run any local project on HTTPS without any hassle"
date: 2025-08-21T16:56:19+05:30
tags: ['HTTPS', 'Local Development', 'TLS', 'mkcert', 'Reverse Proxy', 'Ruby']
description: "A fast, simple way to run any local project on HTTPS with a custom local domain. Works on macOS and Linux."
author: "Vikas Kumar"
ShowToc: false
TocOpen: false
draft: false
cover:
    image: "local-https.png"
    relative: true
    alt: "Run local project on HTTPS locally"
---
Modern browsers expect HTTPS. Cookies with `Secure`, OAuth callbacks, Service Workers, HTTP/2, and many APIs either require or work better with HTTPS.

I created `local-https`, a simple tool to run any local project on HTTPS with a custom local domain.

- No browsers hacks
- No changing your app’s code
- Works on macOS and Linux

GitHub: https://github.com/vikas-0/local-https

---

## What is local-https?

`local-https` is a small Ruby CLI that:

- Generates trusted local TLS certificates with [mkcert](https://github.com/FiloSottile/mkcert)
- Maps your domain to 127.0.0.1 in `/etc/hosts`
- Runs an HTTPS reverse proxy (WEBrick) that forwards to your local app
- Supports multiple domains via SNI
- Optionally redirects HTTP (port 80) to HTTPS (port 443)

You get a local URL like `https://myapp.test` that points to your app on `localhost:3000`.

---

## Quick start

Requirements:
- macOS or Linux
- Ruby 3.0+
- `sudo` access for binding to ports 443/80 and editing `/etc/hosts`

Install:

Homebrew (Tap):

```bash
brew tap vikas-0/tap
brew install vikas-0/tap/local-https
```

Manual (from source):

```bash
git clone https://github.com/vikas-0/local-https
cd local-https
./install.sh
```

Steps:

```bash
# 1) Add a mapping (domain -> local port)
local-https add myapp.test 3000

# 2) Start the proxy (binds to :443 and :80 for redirect)
sudo local-https start

# 3) Open your app
open https://myapp.test
```

Tips:
- Run in foreground for logs: `sudo local-https start --no-daemon`
- Disable HTTP→HTTPS redirect: `sudo local-https start --no-redirect-http`

---

## Works with any tech stack
As `local-https` simply terminates TLS and proxies to your local port. It doesn't require any stack specific configuration.

- Frontend frameworks (Next.js, React, Vue, Vite, Angular)
- Backend APIs (Rails, Django, Flask, Express, Spring)
- Webhooks and OAuth callback testing (GitHub, Google, etc.)
---

## How it works (under the hood)

- Certs are created with mkcert and saved in `~/.local-https/certs`
- `/etc/hosts` gets `127.0.0.1 myapp.test # local-https`
- The proxy presents the correct certificate per domain (SNI) and forwards traffic to `http://127.0.0.1:<port>`
- Config is a simple JSON file at `~/.local-https/config.json`

---

## Configure your app to accept your custom domain

Most frameworks will just work, but some block unknown hosts in development. Make sure your app accepts the domain you chose (like `myapp.test`).

Example: Rails (`config/environments/development.rb`)

```ruby
# Allow your custom domain in dev (Rails 6+ Host Authorization)
config.hosts << "myapp.test"

# Optional: if you generate URLs in controllers/mailers, set defaults
config.action_controller.default_url_options = { host: "myapp.test", protocol: "https" }
config.action_mailer.default_url_options     = { host: "myapp.test", protocol: "https" }

# You do NOT need to force SSL in Rails dev. local-https terminates TLS and
# forwards plain HTTP to your app on localhost:PORT.
# config.force_ssl = false
```

Notes:
- If you use multiple local domains, add each one with `config.hosts << "api.test"`.
- For subdomains, you can whitelist a regex: `config.hosts << /.*\.test/`.
- Keep your app listening on its normal dev port (e.g., 3000); no TLS changes needed in the app.

---


## Why HTTPS locally?

- Secure cookies, SameSite=None, Service Workers
- OAuth callbacks and cross-origin requests
- Matching production behavior
- Avoid mixed content warnings and browser feature limits

---

## Frequently asked questions (FAQ)

- Can I use multiple domains?
  - Yes. Add as many as you want: `local-https add api.test 4000`, etc.

- Do I need to change my app code?
  - No. Your app still listens on HTTP (localhost). The proxy handles HTTPS.

- Does this work with Docker?
  - Yes. Point the mapping port to the host port where Docker publishes your service.

- Is this safe?
  - Certificates and config live in your user home. The proxy only listens locally (by default bind `0.0.0.0`, changeable in code). For public exposure you’d use a proper reverse proxy.

<!--
SEO title: How to run any local project on HTTPS without any hassle
SEO description: Learn a fast, simple way to run any local project on HTTPS with a custom domain using mkcert and a lightweight reverse proxy. Works on macOS and Linux.
SEO keywords: local https, mkcert, https localhost, custom domain localhost, webrick reverse proxy, sni, http to https redirect, developers, local development ssl, run local app on https
-->
