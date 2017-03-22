---
layout: post
title: "Booleans and ActiveRecord::Callbacks"
date: 2017-03-22 16:12
comments: true
categories:
---

I lost a few hours while I puzzled my way through this one.

Let's take an ActiveFedora model:

``` ruby
class Document < ActiveFedora::Base
  before_create :status_is_active, :public_is_false

  property :public_domain, predicate: "http://namespace/publicDomain", multiple: false


  def public_is_false
    self.public_domain = false
  end
end
```

When our documents are created, by default, they aren't public domain. Makes sense. Ok, but try and save
this:

    >  doc = Document.create
    => false

Huh? And then I remembered--only after some time had passed--that methods will return the most recent
value of whatever was last called. So, `public_is_false` was not only setting the property to false
but returning it as well. When the method returns false, that prevents it from saving.

To fix:

``` ruby
  def public_is_false
    self.public_domain = false
    true
  end
```

Looks a bit odd, but it works!
