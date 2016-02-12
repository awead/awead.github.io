---
layout: post
title: "Rebuilding Your Github Pages Site"
date: 2016-02-12 13:18
comments: true
categories: 
---

This happens to me a lot because I go so long without writing a post. By the time I've gotten
around to writing something, I've had my laptop
reimaged, or I've deleted the repo. So I end up having to recreate the entire Github pages
setup... and I don't remember how!

To my future, befuddled self, please take heed:

``` bash
git clone $GITHUB_PAGES_REPO gp
cd gp
git checkout source
bundle update
git clone $GITHUB_PAGES_REPO _deploy
bundle exec rake gen_deploy
```
You can even cut and paste. Trust me! This is yourself you're talking to.
