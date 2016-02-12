---
layout: post
title: "HTTP Headers with Capybara's Drivers"
date: 2016-02-12 11:09
comments: true
categories: 
---

I stumbled across this very slight but significant difference when trying to inject some HTTP headers
into an application being tested with Capybara.

If you're running a server-side authentication scheme such as LDAP or Shibboleth, you can rely
on server variables to get the name of the person who's authenticated to use your application.
Usually it's a variable like "REMOTE_USER" or something else. When you're testing, you'll want
your test app to add that variable to the server's headers.

Using `Capybara::RackTest::Driver`, this looks something like:

``` ruby
Capybara.register_driver(:driver_name) do |app|
  Capybara::RackTest::Driver.new(app,
                                 respect_data_method: true,
                                 headers: { 'HTTP_REMOTE_USER' => 'joe' })
end
```

And if we query the variable in our test:

    >  request.env.fetch("HTTP_REMOTE_USER")
    => "joe"

Now let's use the `Capybara::Poltergeist::Driver` instead so we can test some Javascript.
At first, that looks like:

``` ruby
Capybara.register_driver(:poltergeist) do |app|
  driver = Capybara::Poltergeist::Driver.new(app, js_errors: true, timeout: 90)
  driver.headers = { 'HTTP_REMOTE_USER' => 'joe' }
  driver
end
```

But look what happens to our ENV hash:

    >  request.env
    => {"HTTP_HTTP_REMOTE_USER"=>"joe"}

The Poltergeist driver is appending another `HTTP_` on to the variable. I don't have a definitive
explanation, but I suspect this is because of a section of the CGI specification 
[rfc3875](https://tools.ietf.org/html/rfc3875#section-4.1.18)
that dictates how variables sent from the client are inpreted by the server.

The gist is, since Poltergeist is a more fully-fledged client/server setup, it's going to
do the variable conversion for you, whereas the RackTest driver doesn't and you have to do it
yourself.

In any case, to fix the above problem, just don't add the "HTTP" prefix to the variable if you're
using Poltergeist.
