---
layout: post
title: "Javascript Frameworks in Rails with Webpacker"
date: 2018-02-14 15:09
comments: true
categories:
---

We recently conducted a series of qualitative discovery sessions around each of the different
types of Javascript frameworks that are available in Rails via the webpacker gem. While we
didn't really reach any conclusions, we did get pretty adept at installing new frameworks.
The documentation is a little scarce in certain places, so here's what I've learned from it
so far.

The impetus for this, is a project that doesn't have any Javascript in it yet.
It will definitely have some down the road, and we are interested in choosing something
up-front, while it isn't pressing need, instead of trying to find something late in the
process and feeling rushed.

Our team isn't too deep on Javascript, and we mostly use it to augment existing pages instead of
taking a more integral approach. We thought we'd try to change that this time by looking at Webpacker.
It has some nice features, particularly when contrasted with asset pipeline, and has a nicer way of
separating out JS-related functions with Rails-related functions. It allows you greater
access to different libraries with yarn to manage dependencies for you.

The different frameworks that we examined, which are all available via Webpack, are
(in no particular order):

  * Vue 2.5
  * React
  * Elm
  * Angular 5

We went through the process of installing each of them via Webpack and trying to go
through a couple of simple app walkthroughs. Some were more successful than others,
but they gave us a feel for how things worked. Here's what we found.

## Pre-Requisites

No matter which framework, they all required yarn and node. These can be installed
with brew:

    brew install yarn node

I have yarn 1.3.2 and node 9.5. We did encounter a few bumps with users who had older versions
of node. There is a node version manager, nvm, which one of us has to mess with because of
a different project that required a different version of node. However, most folks should be
fine with just one version, although you may need to update it.

## Vue.js

I'll start with [vue.js](https://vuejs.org/) because I just got done with it. I found it
very appealing, mostly because it seems to draw a pretty clear line between what Rails
does and what JS can do. Even its name suggests that it is a partial to complete replacement
of Rails' view layer. You could write a single-page application (SPA) with it, or just
use Vue component to replace a smaller part of a larger view rendered in Rails.

### Installation

The basic installation is the same for every framework:

Edit your Gemfile, and add:

    gem 'webpacker'

Then run:

    bundle install

Next, you'll install webpacker and the Vue framework:

    rails webpacker:install
    rails webpacker:install:vue

This will take some time and download thousands of packages. Yes, thousands, but on the bright
side, they're all really small. All of those packages get stored in the `node_modules` directory
much like bundler might. It should already be ignored in your local .gitignore file, but
I actually put this in my global ignore so I don't have to worry when I switch to a
non-webpacker-enabled branch:

    echo "node_modules" >> ~/.gitignore

The installer will also include a sample Vue application under app/javascript:

    app/javascript/app.vue
    app/javascript/packs/hello_vue.js

The `hello_vue.js` is the actual pack, and that's what you can run to see if everything is working.

### Sample Application

To get "Hello Vue!" working, create a view page that loads the tag, and a simple route for it.
This can be anywhere in your application, but let's make it it's own page:

    touch app/views/vue.html.erb

Open the file with your editor and add:

    <%= javascript_pack_tag "hello_vue" %>

Next, add a route to the file in `config/routes.rb`:

    get '/vue', to: 'application#vue'

Open a terminal window at the root of your Rails application and startup a Puma session:

    rails s

Now visit [http://localhost:3000/vue](http://localhost:3000/vue)

Note that you don't have to start the webpacker dev server instance, and that when you
navigate to the page, it will compile and run the webpack. Alternatively, you can start
the dev server, which is nice to have when you're making changes to the files. The
dev server will compile everything for you whenever the files changes. You will have to
restart it though if you add new files. To startup the dev server, open a new terminal
window and run:

    bin/webpack-dev-server

### Next Steps

At this point, you have a working Vue framework within your Rails application, but you probably
want to do more than just "Hello Vue!" You can play around with the different example
applications at Vue's own [documentation site](https://vuejs.org/v2/examples/). These
work slightly differently than the sample one provided. The main distinction is that
`hello_vue.js` use a component page, `app.vue`, whereas the ones in the examples use
components defined directly in the JS code.

To get the example applications working in your Rails app, you'll need to copy the html
portion of the example to a Rails view page, and the JS portion to a .js file under
`app/javascript/packs`. You'll need to preface the file with:

    import Vue from 'vue/dist/vue.esm'

This will import the Vue framwork. Lastly, add a route to your new view such as:

    get '/example', to: 'application#example'

And restart your webservers.

If you want to take a crack at creating another app that uses component pages,
checkout this [Todo application](https://codesandbox.io/s/o29j95wx9). You can
use the example `hello_vue.js` for comparison.




