---
layout: post
title: "Commutative Multiplication in Ruby"
date: 2016-06-14 10:02
comments: true
categories: 
---

I discovered this today while working through the roman numerals kata on [exercism.io](http://exercism.io/):
Multiplication of strings in Ruby is not commutative.

Huh?

Yeah, I had to look it up too. In math, the "Commutative Property for Multiplication" states that for any two real numbers
a and b:

    a * b = b * a

In Ruby, you can do strange things with multiplication like:

``` ruby
>  "a" * 2
=> "aa"
```

But the commutative property does not hold in this case:

``` ruby
>  2 * "a"
*** TypeError Exception: String can't be coerced into Fixnum
```

If you think about it for a second, it makes sense, but you have to say it to yourself. First, "A times 2" kinds sounds
reasonable. In other words, take "a" and do it twice. However, saying "2 times a" sounds odd because you immediately have
to ask yourself, "What is 'a'?"

Ruby ask itself the same question and decides that if the first thing I'm multiplying is a
Fixnum, then the next thing has to be a Fixnum as well, and if it's not, I'll try to make it one. Therein lies the
problem: 'a' can't be made into a Fixnum. The strangeness or 'magic' is when it's the other way around, and Ruby
can deduce that it should just repeat strings when multiplied by numbers instead of attempting to do the reverse
of what it did before, and coerce the string into a number.

Oddly, none of this works with addition:

``` ruby
> "a" + 2
*** TypeError Exception: no implicit conversion of Fixnum into String

> 2 + "a"
*** TypeError Exception: String can't be coerced into Fixnum 
```

If you can multiple strings by number, one might reasonably assume that adding them would produce something like:

    "a" + 2 = "a2"
    2 + "a" = "2a"

Alas, the magic stops there.
