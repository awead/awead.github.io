---
layout: post
title: "Watching Your Test Application"
date: 2014-10-25 16:29
comments: true
categories: 
---

When I run test with a sample Rails app, for example if I'm working on an engine gem, it's sometimes difficult to see
what's going on if a test is failing.  I'm a big proponent of having a clean database before every test. This means
running a database cleaner and other tools that wipe out the data before and afterwards. This can present problems
when you're trying to nail down a particular failure because the data gets wiped after it's over.

You can use tricks like the Byebug gem or calling `save_and_open_page` if you're using Capybara, and these will often help. But,
what if you want to open the actual test application at the exact moment prior to the failure? Here's a trick I use:

Let's say you've built-up a test rails application under `spec/internal`.  This implies that you're using RSpec,
so if not, translate accordingly. Go into your test file and put in a `byebug` call right before the failure.
The test will run and stop at the breakpoint.  Leave the byebye prompt open and in another terminal:

    $ cd spec/internal
    $ bundle exec rails server -e test

Violà.  There's your test application at exactly the point prior to the failure.  Explore and poke around, but when
you're done, don't forget to pop back over to the byebug prompt and enter:

    (byebug) continue

The test will continue and so will the cleanup process.  If you forget this, then the test application will not be a clean
state the next time you run your tests.
