---
layout: post
title: "Testing Engines Under Rails4"
date: 2013-09-28 11:10
comments: true
categories: 
---

Recently, I've been using engines a lot, and have run into problems with testing them.  The 
[current guide](http://edgeguides.rubyonrails.org/engines.html) on creating Rails engines covers
the basics of creating the engine and touches a bit on testing them.  The gist
is that there is a dummy application under test/dummy and the code you write in the engine
is tested against it.

This works, but what if there's an update to Rails?  Your dummy app is still stuck at
the same version it was when you first created it.  A problem I run into is that I need
to create generators that add code into the dummy app, to mimic that same process real users
will go through when they are installing the engine.  I need a way to recreate the dummy application
each time and run a complete set of tests.

My solution, which I've borrowed from my colleagues in the Hydra community, is to create 
rake tasks that build the dummy app from scratch, go through the steps required to install
the engine, and then run all the tests.

# Generate the Engine

When creating the engine, I do the same as the guide but I exclude the testing framework because I prefer rspec:

    rails plugin new blorgh --mountable -T

Go into your new engine and add rspec and rspec-rails as development dependencies:

    s.add_development_dependency "rspec"
    s.add_development_dependency "rspec-rails"

And then get rspec ready to use:

    bundle install
    rspec --init

This creates the initial spec directory, but now we need to create the dummy app inside it.  Unfortunately,
we can't just run "rails new" and be done.  Rails knows where inside an engine and actually prevents us
from running the "new" command.  So, we have to hack around this.  There are two options: 1) delete the
bin directory; 2) rename the bin directory.

I choose to rename my bin directory to sbin:

    mv bin/ sbin/

I can then call any generators or other options inside my engine using sbin/rails and then when I run the
plain rails command, I get it as if I wasn't inside my engine.  So now, I can create my new dummy app
inside spec:

    rails new spec/dummy

And you now have a brand-new rails app inside spec, ready for testing.

# Using Rake Tasks

At this point, you'll need to add the engine to your dummy app, and go through the process of initializing it
to run your tests.  You're going to have repeat the process a lot, so why not automate it with a rake task.

First, add this to your engine's Rakefile to include any tasks we creating in our tasks directory:

    Dir.glob('tasks/*.rake').each { |r| import r }

Since these are tasks that are only associated with developing and testing your engine, as opposed to tasks that users
will run when they've installed your engine, I put them in their own file, such as tasks/blorgh-dev.rake

``` ruby tasks/blorgh-dev.rake
    desc "Create the test rails app"
    task :generate do
      unless File.exists?("spec/internal")
        puts "Generating rails app"
        system "rails new spec/internal"
      puts "Done generating test app"
    end

```

This does the job of creating our test application, but it doesn't actually hook our engine up to it.  In order to
do that, we have to add the gem to the dummy app's Gemfile:

    echo "gem 'blorgh', :path=>'../../../blorgh'" >> spec/dummy/Gemfile

This adds our engine to the dummy app, relative to the location of the dummy app itself.

Next, we'll need to do the usual bits of running bundle install and any migrations within the dummy app.  Here we need to 
expand our rake task to not only perform things within the dummy app, but also do it within a clean bundle environment.
This is because don't want the dummy app to use any our bundler settings that we might be using in our dev environment.

Lastly, we also need to be able to delete our dummy app and regenerate it if we update any of engine code or dependencies.

Taking all of this into account, our updated rake file looks something like this:

``` ruby tasks/blorgh-dev.rake
    desc "Create the test rails app"
    task :generate do
      unless File.exists?("spec/dummy")
        puts "Generating test app"
        system "rails new spec/dummy"
        `echo "gem 'blorgh', :path=>'../../../blorgh'" >> spec/dummy/Gemfile`
        Bundler.with_clean_env do
          within_test_app do
            puts "Bundle install"
            system "bundle install"
            puts "running migrations"
            system "rake blorgh:install:migrations db:migrate"
          end
        end
      end
      puts "Done generating test app"
    end

    desc "Delete test app and generate a new one"
    task :regenerate do
      puts "Deleting test app"
      system "rm -Rf spec/dummy"
      Rake::Task["generate"].invoke
    end

    def within_test_app
      return unless File.exists?("spec/dummy")
      FileUtils.cd("spec/dummy")
      yield
      FileUtils.cd("../..")
    end

```

# Next Steps

This gets us started, but you'll probably need to add more in order to get your tests working, and that largely depends on what
your engine is going to do.  Fortunately, you're in a good position if you have to test any functionality within your engine.

### Generators

Using generators is a good way to create any necessary config files or code that needs to be created within the dummy app.  The solution
I'm using places the generators inside the spec directory and then copies them to spec/dummy/lib/generators.  Then, we can run the 
generators within the dummy app and perform the same actions users will take when installing the engine to their own applications.

# Acknowledgments

Props and shoutouts to [@jcoyne](https://github.com/jcoyne) who's came up with this technique.
