---
layout: post
title: "Commit Messages: Love letters to our future selves"
date: 2017-08-09 13:49
comments: true
categories:
---

A colleague of mine once referred to commit messages as "love letters to our future selves."
He couldn't have been more right.

In this past year, I've been actively writing more descriptive commit messages, and
I've found that it really pays off. As you work on more and more different projects and
you switch gears, you don't remember what you did a few months back, but you'll run across
a new problem in a different project that reminds you.

So when you wonder, "Didn't I just do that?" Go to your git log. Search. Read. Rest assured
that even if no one else does, your past self loves you enough to write you a long commit message
that explains what you did that you can't remember now.

As a guideline, I also include a gitmessage that took from Thoughtbot that reminds me what I'm
supposed to be writing:

``` bash ~/.gitmessage
# 50-character subject line
#
# 72-character wrapped longer description. This should answer:
#
# * Why was this change necessary?
# * How does it address the problem?
# * Are there any side effects?
#
# Include a link to the ticket, if any.
```

And if vim is your editor, make your messages automatically wrap at 72 characters. You'll be
much happier.

``` bash ~/.vimrc
:set textwidth=72
au BufRead,BufNewFile setlocal textwidth=72
```
