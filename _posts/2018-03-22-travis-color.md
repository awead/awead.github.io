---
layout: post
title: "Stage Builds on Travis, in Color!"
date: 2018-03-21 12:31
comments: true
categories:
---

We've been having a problem with Coveralls lately were we get incorrect coverage reports because
we split up our builds to save time. Unfortunately, our test suite runs very slowly, for reasons
I won't get into now, so we run two parallel builds: one for feature tests--aka, everything in
`spec/features`; and, another for unit tests which is everything else.

It saves about 15 minutes on the Travis build, but when coverage reports are sent to Coveralls,
it's only getting either unit or feature results and not both, so our coverage looks terrible.

## Code Climate

Code Climate has a way to submit multiple coverage reports which, when combined, give you a
complete look at your coverage. Enabling it in Travis is a bit tricky because you need to
stash the results from each parallel job someplace, then send it up the combined report
when it's all done.

## Amazon S3

The gist is, after each build is complete, send the results to Amazon for storage, then run
another "build" on Travis that downloads the individual reports from S3 and sends them to
Code Climate. It's all outlined [here](https://docs.codeclimate.com/docs/configuring-test-coverage)
in the docs, but getting all the implementation details in Travis is a bit tricky. For one,
it involves deciphering Travis's (currently beta, but awesome) stage builds.

## Travis

Combining all of the above with our Rubocop tests, we want 3 stages:

1. Run Rubocop and fail the whole build early if that doesn't pass
2. Run our 2 parallel test suites and stash coverage reports in S3
3. Upload the two reports to Code Climate to have a combined coverage report

Here's what the `travis.yml` file looks like:

``` yaml
stages:
  - rubocop
  - test
  - coverage
jobs:
  include:
    - script: ./travis/test.sh
      env: TEST_SUITE=feature
    - script: ./travis/test.sh
      env: TEST_SUITE=unit
    - stage: coverage
      install: skip
      script: ./travis/coverage.sh
    - stage: rubocop
      script: bundle exec rake scholarsphere:travis:rubocop
```

The Rubocop stage runs first, which just executes `bundle exec rake scholarsphere:travis:rubocop`.
Next, the "test" stage, which is the default stage in Travis so it doesn't need to be explicitly
called in the `include` block so long as its jobs are listed first. These are just script commands
running [test.sh](https://github.com/psu-stewardship/scholarsphere/blob/develop/travis/test.sh)
with an environment variable telling it which type of build to run.
The last stage, coverage, is also a full Travis build, except we skip the `bundle install` portion
because we don't need that. All we need is to run
[coverage.sh](https://github.com/psu-stewardship/scholarsphere/blob/develop/travis/coverage.sh)
which downloads the saved coverage reports from the test stage, and uploads them to Code Climate.

### Details

* use [encrypted environment variables](https://docs.travis-ci.com/user/environment-variables/#Defining-encrypted-variables-in-.travis.yml) to authenticate to Amazon S3
* use an S3 user who only has access only to the bucket that's storing the coverage files
* include a lifecycle policy on the s3 bucket to delete old files
* you'll need to install aws command line tools in the Travis builds as well as Code Climate's coverage report tool--you can cache the tool to make subsequent builds a little faster
* remember to use the exit code from the RSpec test and not just the script!

## Color Output

One really odd thing that was happening was that the RSpec output from the test script was not
in color. On a whim, I added `--tty` to the
[.rspec](https://github.com/psu-stewardship/scholarsphere/blob/develop/.rspec)
file in the repo, and _presto_, color output.


