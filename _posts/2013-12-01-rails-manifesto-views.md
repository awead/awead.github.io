---
layout: post
title: "Rails Manifesto: Views"
date: 2013-12-01 10:42
comments: true
categories:
---

I've been developing with Ruby on Rails for about three years now, and while that's not as long as some other folks, it's
long enough for me to have formulated some of my own personal programming maxims.  One of these is about views.  This past week,
I was rewriting view code in order to completely remove all Ruby logic so that it was solely HTML code as much as possible.
While you're allowed to do lots of things in Rails views, I prefer to keep views what they're supposed to be: just about display.
To that end, I use lots of helper methods to handle the logic, and leave the view code as simple nested HTML blocks.

### Views view, while Helpers help

Rails views allow you to insert any Ruby code you like directly into escaped HTML strings, so you can have elements
of if/then logic mixed in with HTML all in the same page.  Take, for example, this view code from the
[Blacklight plugin](https://github.com/projectblacklight/blacklight) that displays a list of recent searches:

``` ruby
<div id="content" class="span9">
<h1><%= t('blacklight.saved_searches.title') %></h1>

<%- if current_or_guest_user.blank? -%>

  <h2><%= t('blacklight.saved_searches.need_login') %></h2>

<%- elsif @searches.blank? -%>

  <h2><%= t('blacklight.saved_searches.no_searches') %></h2>

<%- else -%>
  <p>
  <%= link_to t('blacklight.saved_searches.clear.action_title'), clear_saved_searches_path, :method => :delete, :data => { :confirm => t('blacklight.saved_searches.clear.action_confirm') } %>
  </p>

  <h2><%= t('blacklight.saved_searches.list_title') %></h2>
  <table class="table table-striped">
  <%- @searches.each do |search| -%>
    <tr>
      <td><%= link_to_previous_search(search.query_params) %></td>
      <td><%= button_to t('blacklight.saved_searches.delete'), forget_search_path(search.id) %></td>
    </tr>
  <%- end -%>
  </table>

<%- end -%>

</div>
```

There are three options, each with some view code associated with it: first, if there is no current user logged in,
display some text stating that the user should login; second, if there is a user logged in, but there are no saved
searches in the `@searches` variable, then display some text that states this fact; finally, if we have some searches,
then display those in a tabular format.  There is nothing wrong with this code, it works just fine.  If you're  happy
with the way it looks, and you write code like that, I think that's great and you can stop reading.   However, I
personally prefer a different way, and decided to refactor it.

I found the code a little hard to follow, and  wanted a cleaner separation of Ruby logic from the actual HTML code  so I
could understand it better. If the view just expressed the appearance and the content of the page,  it would make a lot
more sense to me at first glance.  To do this, I identified the primary function of the page: rendering the table of
search results.  I  then separated the logic controlling that and gave it a method name defining it as clearly as
possible:

``` ruby
module SearchesHelper

  def render_saved_searches_table
    if current_or_guest_user.blank?
      # you need to login
    elsif @searches.blank?
      # you have no searches
    else
      # display the table
    end
  end

end
```

With the logic sketched, we can add back some of the view code where appropriate.  In this case, the helper method can
return a single HTML statement, but if it is more than that, the content should be rendered by a new partial:

``` ruby
module SearchesHelper

  def render_saved_searches_table
    if current_or_guest_user.blank?
      content_tag :h2, t('blacklight.saved_searches.need_login')
    elsif @searches.blank?
      content_tag :h2, t('blacklight.saved_searches.no_searches')
    else
      render "searches_table"
    end
  end

end
```

The index view is now much more concise and can be re-written to take advantage of Rails' content_tag blocks:

``` ruby
<%= content_tag :div, :id => "saved_searches", :class => "span9" do %>
  <%= content_tag :h1, t('blacklight.saved_searches.title') %>
  <%= render_saved_searches_table %>
<% end %>
```

Now, we create a new partial called by the helper method to display the searches in a table format:

``` ruby
<%= content_tag :p, link_to(t('blacklight.saved_searches.clear.action_title'), clear_saved_searches_path, :method => :delete, :data => { :confirm => t('blacklight.saved_searches.clear.action_confirm') }) %>

<%= content_tag :h2, t('blacklight.saved_searches.list_title') %>

<%= content_tag :table, :class => "table table-striped" do %>
  <% @searches.each do |search| %>
    <%= content_tag :tr do %>
      <%= content_tag :td, link_to_previous_search(search.query_params) %>
      <%= content_tag :td, button_to(t('blacklight.saved_searches.delete'), forget_search_path(search.id)) %>
    <% end %>
  <% end %>
<% end %>
```

Personally, I find the first line a bit too long.  There are a lot of options that are passed to the link_to method, and I chose to
isolate that using a helper method:

``` ruby
  def render_clear_searches_link
    link_to t('blacklight.saved_searches.clear.action_title'),
      clear_saved_searches_path, :method => :delete,
      :data => { :confirm => t('blacklight.saved_searches.clear.action_confirm') }
  end
```

Then, the final view code for the table looks a little more manageable to me:

``` ruby
<%= content_tag :p, render_clear_searches_link %>

<%= content_tag :h2, t('blacklight.saved_searches.list_title') %>

<%= content_tag :table, :class => "table table-striped" do %>
  <% @searches.each do |search| %>
    <%= content_tag :tr do %>
      <%= content_tag :td, link_to_previous_search(search.query_params) %>
      <%= content_tag :td, button_to(t('blacklight.saved_searches.delete'), forget_search_path(search.id)) %>
    <% end %>
  <% end %>
<% end %>
```

### OCD: Obsessive, Compulsive Design

To some, the above may seem like overkill, and I do concede that point.  For me, it's a matter of personal taste and also
a nice feeling of satisfaction when looking at the finished product.  It also satisfies a creative component that I feel is very
important in programming.  Writing in any kind of programming language is a creative process and Ruby is an expressive
language.  The refactoring process allows us to indulge a bit in these aspects.

I started down this path recently when I read [this post](http://robots.thoughtbot.com/sandi-metz-rules-for-developers)
about using Sandi Metz's Rules for Developers.  Following these rules is somewhat of a challenge, and it's been a
gradual process to get myself to abide by them.  While I don't always follow them, even attempting to has helped my
refactoring process immensely.  As a result, they've played a large part in how I've changed my thinking about views in
general.  The ideas that I've tried to apply in this example are making methods as concise and descriptive as possible,
as well as crafting your modules and methods to be self-explanatory, which I think showcases Ruby's expressive
potential.
