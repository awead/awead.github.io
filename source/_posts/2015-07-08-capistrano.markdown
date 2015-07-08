---
layout: post
title: "Capistrano"
date: 2015-07-08 09:08
comments: true
categories: 
---

I've been working recently on a side project with a very restrictive server environment. Capistrano has turned out to be a 
good way to deploy news apps easily and quickly. Admittedly, I have a bit of a love/hate relationship with Cap. I use it
at work, and it's wonderful when it works... until it doesn't, and then it becomes very frustrating. Part of this was
was due to the fact that it was setup before I came on to my current job, so I didn't see it getting built from the 
ground up. So I figured with this side project I could set it up myself and see better how it works.

I find that Capistrano adheres to Rails' adage of "convention over configuration," which is otherwise known as: magic.
This means that a lot of things are being done automatically, and you don't necessarily know how. In general, this is
nice when you don't care, but when comes to figuring out what's wrong, that's where the frustrations arise.

Setting up Capistrano initially is easy. I found several tutorials that were very helpful, including its own
homepage:

* http://capistranorb.com/
* http://guides.beanstalkapp.com/deployments/deploy-with-capistrano.html
* http://robmclarty.com/blog/how-to-deploy-a-rails-4-app-with-git-and-capistrano

Within no time, I was deploying with a one-liner from the command line; however, I got stuck. For some reason,
assets weren't being compiled nor were the database migrations being run. Under version 3, if you simply add this
to your Capfile:

    require 'capistrano/rails'

All of this is supposed to "magically" happen since the capistrano-rails gem includes all the tasks for performing
database migrations and compiling assets. It does; and it will, provided you've defined the role for the server.

I missed that part. [Roles](http://capistranorb.com/documentation/advanced-features/role-filtering/) are covered briefly,
but the basic idea is that you may have your app deployed to different servers, one doing the app, one doing the database,
and maybe another that's the web front-end. Capistrano comes with roles already defined such as: web, db, and app.

If the server you've defined in the `config/deploy` directory isn't assigned to a db role, then database migrations
won't occur -- which makes complete sense of course, but it's not immediately obvious. Similarly, you need to assign
your server either the app or web role for assets as well.

``` ruby config/deploy/test.rb

    server 'test.server.com', user: 'awead', roles: %w{web app db}
  
```

With the new configuration, everything went as expected.
