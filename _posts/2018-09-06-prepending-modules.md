---
layout: post
title: "Prepending Modules in Ruby"
date: 2018-09-06 15:50
comments: true
categories:
---

We've been prepending classes a lot recently as a means of mokeypatching, but in a "nicer" way.
Turns out you can do this with modules too.

Let's say you've got a class in a gem somewhere and you want to override some of its behaviors.

``` ruby
    module Roaring
      def roar
        "Roar!"
      end
    end

    class MythicalBeast
      include Roaring
    end
```

The default looks like:

``` ruby
    class Dragon < MythicalBeast
    end
```

```
    >  Dragon.new.roar
    => "Roar!"
```

You can change that roar using `prepend`. Typically, this involves changing the class:

``` ruby
    module BetterRoar
      def roar
        "RRRROOOOOAAAARRRRRRRRR!!!!!!!"
      end
    end
```

```
    >  MythicalBeast.prepend BetterRoar
    >  Dragon.new.roar
    => "RRRROOOOOAAAARRRRRRRRR!!!!!!!"
```

But, you can can also do this on the module:

```
    >  Roaring.prepend BetterRoar
    >  Dragon.new.roar
    => "RRRROOOOOAAAARRRRRRRRR!!!!!!!"
```

The only different is that you'll need to reload the classes, which Rails will do in the `to_prepare` of
the application config.

## Why do this?

Well, it's really up to you, but prepending the module instead of the class is a bit more
self-documenting because in your `config.to_prepare` block you'd see something like:

```
    config.to_preprae do
      Roaring.prepend BetterRoar
    end
```

This is a bit more explicit in the sense that it's telling you where the original behavior exists
that you're changing. If you chose to prepend the class:

```
    config.to_preprae do
      MythicalBeast.prepend BetterRoar
    end
```

You don't know that the roar method really existing in the Roaring module.
