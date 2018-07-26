---
layout: post
title: "Using Rbenv in Production"
date: 2013-07-04 17:20
comments: true
categories:
---

In the last post, I went over the procedures I used to install the Ruby environment manager,
[rbenv](https://github.com/sstephenson/rbenv), and setup it for developing rails applications.

In this post, I'll cover how I use rbenv on my production and test servers for deploying rails applications using Apache
with Passenger.

### The Environment

* CentOS 6
* ruby 1.9.3-p286
* apache
* passenger 4.0.5

### Requirements

You'll need development packages (gcc, etc.) and git.  Easiest way to do that is install the development tools package:

    $ yum groupinstall "Development Tools"

I installed git via yum as well, but by adding the
[Extra Packages for Enterprise Linux (EPEL)](http://fedoraproject.org/wiki/EPEL) repository:

    $ rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
    $ yum install git


### Installation

This [Rbenv wiki page](https://github.com/sstephenson/rbenv/wiki/Deploying-with-rbenv) recommends
creating a user under which your applications are run and Rbenv would be installed under this user's home directory.
This certainly is a fine way to do it, but I want to have a global ruby available system-wide to any user.  I chose to install
Rbenv under /usr/local, my default location for any non-repo software.  You could also choose /opt if you like.  I also
prefer to not have rbenv in a hidden folder.  That way, when I list the contents of /usr/local, I can
immediately see what software I have installed outside of Red Hat's or CentOS's normal repository.

Other than the location, the installation is pretty much the same as it was in development:

    (as root)
    $ cd /usr/local
    $ git clone https://github.com/sstephenson/rbenv
    $ cd rbenv
    $ mkdir plugins
    $ cd plugins
    $ git clone https://github.com/sstephenson/ruby-build
    $ git clone https://github.com/sstephenson/rbenv-vars

Because I want rbenv available globally, I add a new file under /etc/profile.d so new environment settings will be
applied equally to every user.

In `/etc/profile.d/rbenv.sh`

```bash

export RBENV_ROOT=/usr/local/rbenv
export PATH="$RBENV_ROOT/bin:$PATH"
eval "$(rbenv init -)"

```

After logging out and back in again, or re-sourcing .bash_profile, Rbenv should now be installed and correctly pathed:

    $ rbenv install 1.9.3-p286
    $ rbenv global 1.9.3-p286
    $ rbenv rehash

### Configuration

First, we'll clear out any unwanted gems, then install the ones we need to deploy applications.  For these systems, I install
just bundler and passenger.  Additionally, I configure gem for root so that it does not install any documentation:

    $ gem list | awk '{print $1}' | xargs gem uninstall -a
    $ echo "gem: --no-rdoc --no-ri" >> ~/.gemrc
    $ gem install bundler passenger
    $ rbenv rehash

Now we should have passenger and bundler avaialable from anywhere in the system, but we have to configure bundler to
install any other gems locally to the application, and have rbenv-vars set the GEM_HOME variable accordingly:

    $ bundle config --global path .bundle
    $ bundle config --global bin bin
    $ echo "GEM_HOME=.bundle" >> ~/.rbenv/vars
    $ rbenv rehash

Now, when we run bundle install on any of our rails apps, additional gems will be installed the .bundle directory
under the application.

##### Passenger

The last little bit involves configuring Passenger.  Installing the apache module is straight-forward:

    $ passenger-install-apache2-module

But when I configure my rails apps for deployment, I have apache set the GEM_HOME variable so Passenger knows to
look under the .bundle directoryfor the additional gems.  This can be done so that it's set for any application you deploy.

In `/etc/httpd/conf.d/passenger.conf`

```
    <VirtualHost *:80>
      ServerName my.prod.server
      SetEnv GEM_HOME .bundle

      RackBaseURI /app1
      <Directory /var/www/html/app1>
        Options -MultiViews
      </Directory>

      RackBaseURI /app2
      <Directory /var/www/html/app2>
        Options -MultiViews
      </Directory>
    </VirtualHost>
```

### Acknowledgements

http://www.vxnick.com/blog/2012/04/setting-up-rbenv-globally/






