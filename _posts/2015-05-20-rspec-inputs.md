---
layout: post
title: "RSpec: Testing Inputs"
date: 2015-05-20 03:58
comments: true
categories: 
---

After trying to do this the other day, there are a lot of different approaches to doing this. Here's mine:

Let's say you have an edit form that has a text input with a value already entered into it.

``` html
<input name="name_field" value="Adam Wead" type="text" id="document[name_field]" />
```

You want to write a test that verifies if the content is already in the input field. Seems easy, but
it turns out it's not so. A lot of the answers out there resorted to using Xpath, which works fine,
but you can leverage RSpec's own finding tools to do this too:

``` ruby
expect(find_field("document[name_field]").value).to eql "Adam Wead"
```

It avoids XPath, if that's not your thing, and it's slightly easier to read. I would have expected (no pun intended)
`have_value` to work, but it doesn't look like it responds to `has_value?`.
