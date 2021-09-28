---
layout: post
title: A Rails IDE with Vim
date: 2021-09-27 13:23 -0400
---

I've been a casual user of vim for many years now. It's my `$EDITOR` everywhere, I write my commit messages using it,
and anything else that needs to get edited in a terminal session. However, it was only less than two years ago that I
decided to go all in on vim and use it exclusively as my IDE for programming work. The process has been slow, and has
included bringing in new peripheral things like tmux, as well as building on existing things such as a dotfiles repo.

The most recent iteration has included refining my vimrc and tmux settings to make better use of splits, getting some
new plugins and re-configuring some old ones to incorporate better navigation, searching of related functions using
ctags, and being more disciplined about using vim's core features. Yes, I still use arrow keys to navigate even in
insert mode, but I'm getting better. None of this is ground-breaking stuff. It's actually quite old, but it's been a
boon to my productivity and has also made things more enjoyable.

## File Navigation

I can't quantify it, but it seems like I spend an awful lot of time finding the file I want to edit or view. There are a
couple of different methods I employ to speed that up:

1. Fuzzy filename matching

   This is my usual goto: Ctl-P with the fzf vim plugin. Works great and it's fast. The downside is that it requires
   foreknowledge of the filename, and sometimes a lot of extra keystrokes.

2. Alternate files identified by projections

   Use `A` to open the alternative file defined via projection. `AS` and `AV` open it up in a split.  It's most often
   the test file, and for that reason, is the fastest way to get there. Tim Pope's vim-projectionist plugin does this,
   and it's also included in his vim-rails plugin as well. I recently added a global config option to support the Rails
   view-component gem. The alternates cycle through three files: model, view, and spec test:

``` vim
let g:rails_projections = {
    \ "app/components/*.rb": {
    \   "type": "component",
    \   "alternate": [
    \     "app/components/{}.html.erb",
    \     "spec/components/{}_spec.rb"
    \   ]
    \ },
    \ "app/components/*.html.erb": {
    \   "type": "component",
    \   "alternate": [
    \     "spec/components/{}_spec.rb",
    \     "app/components/{}.rb"
    \   ]
    \ },
    \ "spec/components/*_spec.rb": {
    \   "type": "component",
    \   "alternate": [
    \     "app/components/{}.rb",
    \     "app/components/{}.html.erb"
    \   ]
    \ }}
```

3. Navigation by tags
    
   Requires integration with ctags (more on this in a bit) but is also very fast and the best choice when looking for
   related classes in other dependencies. The fzf plugin allows you to fuzzy-match on the tags.

4. Tree-based navigation

   Another popular option, but not one I use as much. This is helpful when you don't know the name of the file, or need
   to explore the directory more interactively than is possible with fuzzy matching. NerdTree is my plugin of choice
   here.

5. Rails-specific navigation

   vim-rails comes with commands such as Econtroller and Emodel which will open controllers, models, and other related
   Rails types. It does autocomplete, which is a great keystroke-saver.

## Buffer Navigation

Once you've gotten a bunch of files open, you can move back and forth between them in vim's buffers. Although you can
use any of the above file navigation options, I find the buffers are quicker.

1. Last used buffer

   Kind of a like a "back" button, I've mapped this a `<leader><space>`, but since my leader key _is_ the space bar,
   it's effectively `<space><space>`. This is really great when you're flipping back and forth between your test and
   source class.

2. Numbered buffers

   I've mapped buffers 1-9 via the leader so I can choose one with `<leader>1`, `<leader>2`, and so on, but I find this
   limiting since vim seems to retain buffer numbers in unexpected ways, and I get "buffer #15" in some cases.
   
   This lead me to `<leader>j` and `<leader>k` so I can navigate buffers up and down like I would lines in the file.

3. Fuzzy search buffers

   By far this is the most common way I do it now. With the fzf plugin, `<leader>b` maps to the `:Buffers` command and
   away we go.

## ctags Integration

I've been keeping a file of tags in my repos for awhile now, but haven't really been using them until I recently
updated my fzf plugin and found that it has a great feature that lets you fuzzy search them. This has made
all the difference. I map to this in two ways: `<leader>T` and `<leader>t`. The first just searches the tags in
the file you're currently editing. This is handy if you want to move around a large file easily, or if you want to get
an overview of all of its functions.

The second mapping, lower-case t, searches the tags in your local repo file _and_ any tags in your bundled gems. This is
a huge timesaver. Previously, I was doing some `rg` in the shell and copy-pasting paths, etc. It was a mess. Now, two
keystrokes, and I'm searching. Hit enter, and BAM! I've got the file open in my session.

This works using Tim Pope's gem-ctags gem, which builds a tags file for each gem when it's installed. There's a little
chicken-before-the-egg business where you have to have gem-ctags installed before you install other gems, but otherwise,
the tags files are built whenever you run `bundle install`.

Getting it work took me learning how to program in vim:

``` vim
function! BundleTagPaths() abort
  if isdirectory('.bundle') == 1
    return map(split(system('bundle list --paths')), 'v:val."/tags"')
  else
    return []
  endif
endfunction

let &tags= pathogen#legacyjoin(pathogen#uniq(['tags', '.tags'] + BundleTagPaths()))
```

I initially tried configuring it using autocommand, which would load it for Ruby files, but I was getting strange
behaviors and the tags seemed to go away when I opened another file. The above solution loads all the tags if it finds a
.bundle directory, and it only runs once when you start your vim session. This may not work for folks that move around
different repos in the same session. I tend to have one vim session per repo, and each repo/project is in its own tmux
session.

It relies on Pope's vim-pathogen plugin and assembles all the paths to your gems' tags files. That all gets set as your
tags variable, which is what vim uses to do the searching. And THAT is all done via fzf, which is very fast. I haven't
noticed any performance issues with large Rails projects using many gems.

## Splits

I've always been enamored with the idea of splits, but just couldn't get the hang of navigating between them and
resizing them. The commands were difficult to remember and I couldn't devote the time to practicing them. I got over
my issue by basing the pane navigation on vim's standard navigation keys and the resizing them on the arrow keys.
Then, I copied the same pattern in tmux. So in vim, I move to a split using `Ctl` plus a `h`, `j`, `k`, or `j`,
depending on the direction, and `<leader>` + an arrow key to resize that split in that direction by a pre-configured
amount. In tmux, it's the same, except with the tmux prefix key, which for me is `Ctl-S`.

The resulting vim config looks like:

``` vim
" Move around splits like you do normal navigation
nnoremap <C-J> <C-W><C-J>
nnoremap <C-K> <C-W><C-K>
nnoremap <C-L> <C-W><C-L>
nnoremap <C-H> <C-W><C-H>
" Maps arrow keys to resize windows
nnoremap <leader><Left> :vertical resize -5<CR>
nnoremap <leader><Right> :vertical resize +5<CR>
nnoremap <leader><Up> :resize -5<CR>
nnoremap <leader><Down> :resize +5<CR>
```

And in tmux:

``` bash
unbind h
unbind j
unbind k
unbind l

bind h selectp -L
bind j selectp -D
bind k selectp -U
bind l selectp -R

unbind Left
unbind Right
unbind Up
unbind Down

bind Left resize-pane -L 5
bind Right resize-pane -R 5
bind Up resize-pane -U 5
bind Down resize-pane -D 5
```

## Testing

Back when I was using GUI-based editors, I'd have to switch over to the terminal to run tests. I didn't really mind
this, but when I started using vim, I learned I could run associated tests with just a couple of keystrokes. This above
all else has probably contributed to the greatest gains in my productivity. Given the number of times you typically run
a test, and given the amount of time it took for me to physically move my hands from the keyboard, to the mouse, type,
etc. Reducing that to two keystrokes was nothing short of astonishing.

The setup is very simple. I use the vim-test plugin, and the projections take care of the rest:

``` vim
nnoremap <silent> <Leader>r :TestFile<CR>
nnoremap <silent> <Leader>R :TestNearest<CR>
nnoremap <silent> <Leader>l :TestLast<CR>
nnoremap <silent> <Leader>a :call VimuxRunCommand("clear; bin/rspec ")<CR>
```

`r` runs whatever file `:A` produces via the projection. This is almost always the test file. `R` runs whatever test
you're closest too if you're working on the spec code. It'll execute multiple tests if you're nearest a `context`
block. `l` runs whatever your last test was, no matter where you are. This is _phenomenal_ to do while you're working
on the source code.

I've only run into issues if I'm running tests inside docker containers, then I have to manually set
`test#ruby#rspec#executable` to be whatever the docker-compose command is. For example, if I have a docker container
called `listener` that needs to run the rspec command, I do:

``` vim
:let test#ruby#rspec#executable = 'docker-compose exec listener bundle exec rspec'
```

## Conclusion

This is where things stand now. Who knows where I'll be tomorrow. I've looked at Atom and VSCode, and they both look
great: lots of really helpful features, integration with Kubernetes, and the ability to pair in one editing session.
That's very tantalizing. But it takes time to learn a new IDE and you've got to put in the work. With vim, it took a
while, but it has paid off. We'll see what the future holds.

## References

### Plugins

* [NERDTree](https://github.com/preservim/nerdtree)
* [fzf](https://github.com/junegunn/fzf)
* [gem-ctags](https://github.com/tpope/gem-ctags)
* [vim-pathogen](https://github.com/tpope/vim-pathogen)
* [vim-projectionist](https://github.com/tpope/vim-projectionist)
* [vim-rails](https://github.com/tpope/vim-rails)
* [vim-test](https://github.com/vim-test/vim-test)

### My Config Files

* [.vimrc file](https://github.com/awead/dotfiles/blob/main/home/vimrc)
* [VIM Install](https://github.com/awead/dotfiles/blob/main/vim/install.sh)
* [tmux.conf](https://github.com/awead/dotfiles/blob/main/home/tmux.conf)

### Kudos

Shout out to all the plugin devs out there, especially [tpope](https://twitter.com/tpope) for writing some truly
exceptional ones, and Ryan Schenk whom I'll never forgive for putting me on this path in the first place.
