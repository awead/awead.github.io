---
layout: post
title: "(Yet Another Post About) Presenters in Rails"
date: 2016-03-08 08:06
comments: true
categories: 
---

YAPAPIR! Lots of virtual ink has been spilled over presenters in Rails. My take on them that follows came about
after our team decided to arrive at an adoption strategy. We'd been using them in other projects, and were starting
to go down a road of implementing them different ways, when we though we should pick one way and stick to it.

Here's a summary of what I've found are the different ways you can do presenters and I'll conclude with the way
I think they ought to be done.

## They're Really Decorators

If you read about presenters, you'll probably see them side-by-side with references to decorators. According to
wikipedia: [1]

> In object-oriented programming, the decorator pattern (also known as Wrapper, an alternative naming shared
> with the Adapter pattern) is a design pattern that allows behavior to be added to an individual object,
> either statically or dynamically, without affecting the behavior of other objects from the same class.

Presenters are going to do something with your model, usually an ActiveRecord object, and do something with
it that will modify it, yet leave it intact in its original state. The best use case would be display logic
such as someone's name.

``` ruby
class Person < ActiveRecord::Base
  attr_acessor :first_name, :last_name, :salutation 
 
  def full_name
    [salutation, first_name, last_name].join(" ")
  end
end
```

`full_name` doesn't really have any bearing on the Person data model, it's purely for display. A while back,
I probably would have put this in a helper. However, the helper doesn't really know anything about Person,
and you'd have to make some assumptions about how your controller might be instantiating Person:

``` ruby
module PersonHelper
  def full_name
    [@person.salutation, @person.first_name, @person.last_name].join(" ")
  end
end
```

What if `@person` is nil? What if `salutation` is nil? So a simple display method can quickly morph into a complex
logic problem. Enter the presenter: put all that logic and code in another class separate from the model.

``` ruby
class PersonPresenter
  delegate :first_name, :last_name, to: :model

  attr_reader :model

  def initialize(model)
    @model = model
  end

  def full_name
    [salutation, first_name, last_name].join(" ")
  end

  def salutation
    model.salutation || inferred_salutation
  end

  private

    # Let's assume that ::gender is a required attribute
    def inferred_salutation
      if model.gender == "male"
        "Mr."
      else
        "Ms."
      end
    end
end
```

In that brief example above, I've already made a bunch of assumptions about how I'm going to build my
presenters, but there are many ways I could have implemented the above solution. Let's look into them.

## The Approaches

### The Model Presenter

* instantiated by the controller, helper, or view
* operates on only one model
* initialized with an instance of the model it's presenting

### The Assembler

* instantiated by the controller
* assembles access to multiple models within one controller

### The Templative Presenter

* uses either of above strategies
* adds the current `ActionView::Context` as a second parameter

## Guidelines

### Requirements

I'll start with Sandi Metz's rules which cover more than just presenters, except the last one:

  * Classes can be no longer than one hundred lines of code.
  * Methods can be no longer than five lines of code.
  * Pass no more than four parameters into a method. Hash options are parameters.
  * **Controllers can instantiate only one object.**

So basically, if you're using presenters, your controllers can only do one thing: instantiate a presenter.
This might seem a bit draconian, but there's an advantage here. Have you ever dealt with a controller that's
doing so much stuff you don't know where what's getting done where? Well, if your controller can only do
one thing, then it kinda solves that problem for you.

You can break these rules if you absolutely have to, but the idea is that because these limits are there
it informs you as to the complexity of your methods and classes. In other words, if you have a class
with more that 100 lines, maybe there's underlying cause that should be addressed instead of just
plowing ahead with a really big class. On the other hand, if you've thought it through and can make
a well-thought case for a long class, you're free to have one.

### Very Strong Recommendations

#### Use POROs

Ruby has a enough built-in features to cover the use cases, which makes additional tooling, while neat,
magical, and cool, ultimately superfluous. That isn't to say you can't use them. However, there's enough
in the stock Ruby toolbag to fix any problem

* object-oriented design through composition or inheritance
* modules
* delegation methods
* judicious use of monkeypatching as a last resort

#### Use POR (plain old Rails)

Rails has views to render HTML. Use them for that. Partials can subdivide this HTML layer into logical units
that fit your use case or design rules. Rails has helpers, and no, they're not evil. Use them, appropriately,
particularly for specific cases that cut across multiple presenters and do not depend on a data conditional
in your model.

#### A view should only use one presenter

If you have a view that needs more that one presenter, you have a presenter problem. You can build another
presenter. If you have a lot of presenters, think about strategies like inheritance or composition in order
to DRY up your presenters. If you're finding that it's difficult to construct a single presenter for a view,
maybe that's an indication that the view itself is too complicated and needs some refactoring.

### Meh

#### Only instantiate your presenters in controllers/views/helpers

While I feel awkward when I instantiate **anything** in view or helper, I can't really find a coherent argument as
to why it's a bad idea. So, feel free to instantiate your presenters anywhere, but I still think there 
should be one presenter per view, or view partial.

#### Presenters should not contain HTML

Probably, yes, but there could be reasons for it such as sharing a display behavior across presenters, but helpers
are a better fit there perhaps?

#### Views should not contain logic

Ideally, maybe. Practically, though, a small amount of logic doesn't seem to disrupt things:

``` ruby
<h1>User Information</h1>
<p>Hello, <%= presenter.first_name %></p>
<%= render "activity" if presenter.has_activity? %>
```

Iterators present their own problems, but shouldn't be too disruptive either:

``` ruby
<h2>Recent Activity</h2>
<table>
<tr><th>Date</th><th>Action</th></tr>
<% presenter.user_activity.each do |activity| %>
  <tr><td><%= activity.date %></td><td><%= activity.action %></td></tr>
<% end %>
</table>
```

Or if you want to unify all your table displays, consider some helpers:

``` ruby
module TabularHelpers

  def header_row(*cols)
    content_tag :tr do
      cols.map |col| {  |col| content_tag :th, col, class: "my-header-class" }
    end
  end

  def table_row(*cols)
    content_tag :tr do
      cols.map |col| {  |col| content_tag :td, col, class: "my-row-class" }
    end
  end
end
```

Then your table views become more reusable:

``` ruby
<h2>Recent Activity</h2>
<table>
  <%= header_row("Date", "Action")
  <%= presenter.user_activity.map { |activity| table_row(activity.date, activity.action) } %>
</table>
```


## Tools

### Draper

[Gem on github](https://github.com/drapergem/draper). Instantiates a decorator based on your ActiveRecord model.
There's some good discussion about its [pros and cons](http://thepugautomatic.com/2014/03/draper/)

### Curly

[Gem on github](https://github.com/zendesk/curly) Rails meets handlebars.js

## Notes

[1] https://en.wikipedia.org/wiki/Decorator_pattern

## References

Corbel, Guirec, "When I use Helpers, Partials, Presenters and Decorators," July 2013, https://coderwall.com/p/jx9tca/when-i-use-helpers-partials-presenters-and-decorators

Fields, Jay, "Rails: Presenter Pattern," 9/16/2007, http://blog.jayfields.com/2007/03/rails-presenter-pattern.html

Fowler, Martin, "Presentation Model," 7/19/2004, http://martinfowler.com/eaaDev/PresentationModel.html

Goswami, Mainak, "Gang of Four - Decorate with Decorator Design Pattern," https://dzone.com/articles/gang-four-%E2%80%93-decorate-decorator

Hock-Isaza, "Mixing Presenters and Helper," http://blog.nhocki.com/2012/05/08/mixing-presenters-and-helpers/

Murray, Robert, "Decorators, Presenters, Delegators and Rails," 1/23/2014, https://robertomurray.co.uk/blog/2014/decorators-presenters-delegators-rails/

Seitz, Jeremy, "Thoughts about Rails Presenters," https://gist.github.com/somebox/5a7ebf56e3236372eec4

Vlasveld, Roemer, "http://www.inspire.nl/blog/rails-presenters-filling-the-model-view-controller-gap/"

Wang, Eugene, "Presenting the Rails Presenter Pattern," 9/26/2013, http://eewang.github.io/blog/2013/09/26/presenting-the-rails-presenter-pattern/
