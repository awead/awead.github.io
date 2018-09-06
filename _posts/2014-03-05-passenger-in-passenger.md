---
layout: post
title: "A Passenger in a Passenger"
date: 2014-03-05 16:35
comments: true
categories:
---

Here's something I didn't know you could do, until today...

I have a public website deployed under Passenger, and I wanted to deploy a beta version under the same FQDN.  The problem is, I'm not using a
sub-uris for the site.  Essentially I want:

    http://foo.com/
    http://foo.com/beta

To be independently deployed Rails apps under Passenger.  I thought I was going to need to do some magic with Passenger config and some url
rewrites, but after tinkering with the Passenger config files--and the ubiquitous Googling--I discovered I can do it very easily with
Passenger alone.

The key is, I deploy the beta site within the public folder of the main site.  Here's what the Passenger config looks like:

``` bash
    <VirtualHost *:80>

      ServerName foo.com
      SetEnv GEM_HOME .bundle
      DocumentRoot /var/www/rails/foo/public

      <Directory /var/www/rails/foo/public>
        AllowOverride all
        Options -MultiViews
      </Directory>

      RailsBaseURI /beta
      <Directory /var/www/rails/foo/public/beta>
        AllowOverride all
        Options -MultiViews
      </Directory>

    </VirtualHost>
```

This assumes that you have one server deploying one webapp.  Apache looks to the `/var/www/html` directory to serve out files, so I've symlinked this
to the public folder of foo:

    /var/www/html -> /var/www/rails/foo/public

The master branch of the git repo is located at `/var/www/rails/foo`. If you had deployed multiple apps on one server, your html directory probably has
multiple symlinks to the different public folders of all your Rails apps.

In order to deploy the beta version, I clone a new version of the same github repo and pull down the relevant beta branch.  I can then symlink this
repo inside the current public folder and Passenger will serve out the new site from there.  Here's a quick synopsis:

    mkdir /var/www/rails/beta
    cd /var/www/rails/beta
    git clone http://github.com/you/foo
    cd foo
    git checkout -t origin/beta
    [run your normal install procedures]
    cd /var/www/rails/foo/public
    ln -s /var/www/rails/beta/foo/public beta

And that's it.  It's a bit convoluted, but it got my out of my position where I was stuck with only one server name and no sub-uris.
