---
layout: post
title: "Moving to Rbenv"
date: 2013-07-03 16:16
comments: true
categories: 
---

I've been a loyal [RVM](https://rvm.io/) user for several years now, but recently I grew a bit tired of using it in
production.  It seemed too heavy-handed and updating was arduous.  After some looking around, I settled on rbenv, mostly
because it was  simpler, smaller and could work well in all my environments: from my laptop, where I develop, to the
different servers on which I deploy everything.  Keeping it all identical across these is very important to me because I
don't want to have to re-think anything when releasing new code.

I'm not down on RVM at all... in fact, I still like it very much and if I were just developing and not involved
in the production side of things, I'd probably still be using RVM.  One of the particularly great things about
RVM is its notion of gemsets, or groups of installed gems that can be used for one particular application.  RVM
also has default and global gemsets, which I liked to use for gems that were required for all applications.
I liked to use this in my production servers where I could deploy all my applications with the same passenger
gem.

As it turns out, we can use a properly-configured bundler to mimic an RVM gemset, and use the unadorned
gem command to install gems that we want global to our system.  Doing all of this and switching to rbenv took
a little adjustment, but overall I'm very happy with it.  Getting to that point required some
research and some experimenting, which I'll go over here.

### Overview

Here's the basic gist of my setup:

  * rbenv, with the ruby-build and rbenv-vars plugins, installs and manages your ruby versions, as 
    well as sets some environment variables
  * gem installs rubies that are global to your system, akin to rvm's global gemsets
  * bundler install gems specific to a project or application, akin to rvm's named gemsets
  * tie it all together with environment variables

### Development

First, you'll need to make sure you have these installed:

* [Homebrew](http://mxcl.github.io/homebrew/) 
* git

On OSX, rbenv installation is a snap with Homebrew.  Follow the instructions to install rbenv on Mac:

https://github.com/sstephenson/rbenv#homebrew-on-mac-os-x

Additionally, you'll need the rbenv-vars plugin.  I installed that manually:

    $ cd ~/.rbenv/plugins
    $ git clone https://github.com/sstephenson/rbenv-vars
    $ rbenv rehash

Install your ruby of choice and make that global:

    $ rbenv install 1.9.3-p286
    $ rbenv global 1.9.3-p286
    $ rbenv rehash

When rbenv installs ruby, it also installs some gems:

    $ gem list

Since it has installed these with the gem command, these are essentially system-wide or global gems.  I prefer to have more 
control over which gems are installed where, so I remove these and then only install gems I need globally.
Presently, the only gems I use everywhere are bundler and rails:

    $ gem list | awk '{print $1}' | xargs gem uninstall -a
    $ gem install bundler rails

Now we configure bundler to store project-specific gems in a local .bundle directory and to install any gem
executeables in a local bin directory:

    $ bundle config --global path .bundle
    $ bundle config --global bin bin

Lastly, we need to make our environment aware that additional gems are installed in .bundle.  For that, we can use the
rbenv-vars command which will set any environment variable we need.  In this case, we need to set GEM_HOME to our 
.bundle directory:

    $ echo "GEM_HOME=.bundle" >> ~/.rbenv/vars
    $ rbenv rehash

##### Example project

So, here's how this all works.  Let's say I want to create a new rails application and then tweak its ruby version
and gems.  First, I'll install a new, blank app, then I'll install a new version of ruby, set up that application to
use it and install some gems specific to that application:

    $ cd ~/Projects
    $ rails new sample_app
    $ cd sample_app
    $ rbenv install 2.0.0-p247
    $ echo "2.0.0-p247" > .ruby-version
    $ rbenv rehash
    $ echo "gem 'rspec'" >> Gemfile
    $ bundle install

This all should look familiar, except note the .ruby-version file.  This file can be used in any directory to indicate
which ruby version rbenv should use.  When you set the global ruby version above, rbenv wrote that version to
~/.rbenv/version which means that unless there's a version explicitly named in .ruby-version, rbenv defaults to 
the version specified in ~/.rbenv version.

Next, take a look around:

    $ ls -a
    $ ls bin
    $ ls .bundle
    $ ls .bundle/gems
    $ ruby --version
    $ gem list

You'll see that rspec is installed in the .bundle/gems directory and the rspec command is in the bin directory.  Listing the
gems will return all the gems both system-wide and what's installed locally, and you should be using ruby version 2.  If
we move to a different directory, we should be back to our global defauls:

    $ cd ..
    $ ruby version
    $ gem list

### Caveats

##### Paths

When running local gem executeables such as rspec, you'll either need to call them using bin/rspec or use bundler:

    $ bundle exec rspec

Alternatively, you could preface your PATH with the local bin directory, so it looks there first:

    $ PATH=bin:$PATH; export PATH

Personally, I choose to just call local executables by prefacing them with bin/ -- it takes some getting used to at first,
but I prefer this method because it makes me realize exactly what I'm doing.

##### Rails 4

When using this setup with Rails 4 applications, rails complained about bundler setting the local bin directory.  Apparently,
rails is now defaulting to using bin locally.  So if you want to develop multiple versions of rails, including version 4,
I would remove the BUNDLE_BIN setting in your global ~/.bundle/config file and set it locally to your applications that
need it.

My updated setup, for Rails 3 and Rails 4 develpment looks like this:

    $ cat ~/.bundle/config 
      ---
      BUNDLE_PATH: .bundle
    $ cd ~/Projects/rails3_app
    $ bundle config --local bin bin
    $ cat .bundle/config
      ---
      BUNDLE_DISABLE_SHARED_GEMS: '1'
      BUNDLE_BIN: bin
    $ cd ~/Projects/rails4_app
    $ cat .bundle/config
      ---
      BUNDLE_DISABLE_SHARED_GEMS: '1'

That about covers it.  Next post, I'll go over how to do this same setup on test and production deployment servers.

### Acknowledgments

Most of this was me googling to see how other people did it, and then making it work for my own particular needs.  If it
wasn't for them, I couldn't have done it:

[Sam Stephenson's Rbenv](https://github.com/sstephenson/rbenv)

[Devoh's 'Implict Gemsets'](http://devoh.com/blog/2012/07/implicit-gemsets-with-rbenv)





