---
layout: post
title: "Filters, Not Overrides"
date: 2014-08-24 11:10
comments: true
categories: 
---

When refactoring some controllers, I realized it's much nicer to filter actions on controllers instead of overriding them.

Take for example a controller that exists somewhere in your application or in a gem:

``` ruby
class BaseController < ApplicationController

  def index
    @terms = Terms.all
    render_all_terms
  end

end
```

I need to use that controller in my application, but have to add some additional stuff to it to use in my views:

``` ruby
class MyController < ApplicationController

  include BaseController

  def  index
    @my_terms = MyTerms.all
    super
  end 

end
```

This will work and I'll have both `@terms` and `@my_terms` in my views.  However, I find it's nicer, and a little bit less invasive,
if I can work around `BaseController` without having override it:

``` ruby
class MyController < ApplicationController

  include BaseController

  before_filter :get_my_terms, only: :index

  def get_my_terms
    @my_terms = MyTerms.all
  end 

end
```

The end result is the same, but I've accomplished it without having to change `BaseController` at all, thereby leaving its public
interface untouched.
