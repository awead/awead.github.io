---
layout: page
title: "Benchmark Testing with Valkyrie and Hyrax"
date: 2017-08-29 11:10
comments: true
sharing: true
footer: true
---

<script type="text/javascript" src="https://canvasjs.com/assets/script/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
<script type="text/javascript" src="/fedora-tests/chart.js"></script>
<link href="/fedora-tests/watermark.css" media="screen, projection" rel="stylesheet" type="text/css">

# Overview

There are three tests, testing four different combinations of backends, at counts of 10, 100, 1K,
10K, and 100K. Not all tests were performed at the higher counts because of performance limitations.

## Backends

### Valkyrie with Postgres

A Postgres database holds the metadata for every resource, and it is also indexed in Solr. Using Valkyrie's
indexing adapter, after one or more writes are performed on Postgres, one indexing operation is performed
in Solr at the end.

Binary files are written directly to disk.

### Valkyrie with ActiveFedora

ActiveFedora is used exactly like it is in the current Hydra stack. Valkyrie performs one write operation
per resource and the ActiveFedora adapter translates this into metadata persistence in Fedora and indexing
in Solr. This is as equivalent to Hyrax as possible, but without the full Hyrax stack.

Binary files are written to Fedora.

### Valkyrie with Fedora

A Fedora repository holds the metadata for every resource, persisted as RDF, and it is also indexed in Solr.
This is the exact analog of the Postgres backend, where Valkyrie's indexing adapter makes multiple writes to
Fedora and then submits one indexing operation to Solr at the end. ActiveFedora is not utilized at all.
The solr process is the same as the _Valkyrie with Postgres_ backend, and Valkyrie performs writes to Fedora
using an LDP client.

Binary files are written to Fedora.

### Hyrax

This is the full Hyrax application, using the current hydra-head stack, including ActiveFedora.

## Testing Apparatus

One server ran the Rails application, while another ran Fedora, Postgres, and Solr. Tests where initiated
on the application server via rake tasks. Both servers had identical specifications:

* **System:** Red Hat Enterprise Linux Server release 7.4 (Maipo), virtualized
* **CPU:** 4 Intel(R) Xeon(R) CPU E5-2697 v2 @ 2.70GHz
* **RAM:** 16268092 kB

## Test Types

## Collections

Multiple works are part of a collection using a `member_of` relationship where the work asserts its
relationship to the collection.

In Valkyrie, the work has an array of collections with only one member: the uri of the collection
to which it belongs. Benchmarking is performed around the time to save the work:

``` ruby
work.part_of_collections = [collection.id.to_uri]
bench.report { adapter.persister.save(resource: work) }
```

In Hyrax, it is similar but we use the tools available in hydra-works which persists the membership
in Fedora using LDP indirect containers. The outcome is the same, however, and each
work only has an array of one item. Benchmarking is performed
around the time to assert the relationship and save the work:

``` ruby
bench.report do
  i.member_of_collections = [collection]
  i.save
end
```

## Nested Works

One work contains many other works using a `has_members` relationship where the parent work asserts
its relationship to all the other child works. Benchmarking is performed around the time to add the
new child and save the parent.

In Valkyrie, this is accomplished with an array, appending each new work as the test progresses:

``` ruby
bench.report do
  parent.has_collections << child.id
  adapter.persister.save(resource: parent)
end
```

In Hyrax, the only difference is that the array is ordered, using the `ordered_members` method
available from hydra-pcdm:

``` ruby
bench.report do
  parent.ordered_members << child
  parent.save
end
```

## Files

Many individual works are created, each with a unique 1 MB file of random data. Data is randomized
by replacing some of the data in the file with a UUID.

In Valkyrie, two adapters where used: one for the metadata, and second for the binary data. The
time to persist both was benchmarked:

``` ruby
bench.report do
  work = Work.new
  file = storage.upload(file: randomized_file, resource: work )
  work.has_files = [file.id]
  adapter.persister.save(resource: work)
end
```

In Hyrax, in order to match the application's processes as closely as possible, each file was placed
in a file set and then attached to the work. This was adapted from `AttachFilesToWorkJob` in Hyrax
and benchmarked:

``` ruby
bench.report do
  work = create_work(count)
  permissions = work.permissions.map(&:to_hash)
  file_set = FileSet.new
  actor = Hyrax::Actors::FileSetActor.new(file_set, user)
  actor.create_metadata(visibility: 'open')
  file_set.title = ["Small File #{count}"]
  file_set.label = "Small File #{count}"
  file_set.save
  Hydra::Works::AddFileToFileSet.call(file_set, randomized_file, :original_file)
  actor.attach_to_work(work)
  actor.file_set.permissions_attributes = permissions
  work.save
end
```

# Collections Test Results

## Valkyrie with Postgres

<div id="postgres_collections_100000" style="width:100%; height:400px;"></div>

## Valkyrie with Fedora

<div id="fedora_collections_10000" style="width:100%; height:400px;"></div>

    290.59 user 28.05 system 10:44.47 elapsed 49%CPU
    (0avgtext+0avgdata 211648maxresident)k 0inputs+1136outputs
    (0major+65774minor)pagefaults 0swaps

<div id="fedora_collections_100000" style="width:100%; height:400px;"></div>

    2243.38user 233.10system 1:33:21elapsed 44%CPU
    (0avgtext+0avgdata 1254852maxresident)k 0inputs+11112outputs
    (0major+313214minor)pagefaults 0swaps

## Valkyrie with ActiveFedora

We attempted to create a collection with 100K items, but the test was terminated after 17.5 hours.

<div id="active_fedora_collections_100000" style="width:100%; height:400px;"></div>

    4692.09user 300.16system 17:34:25elapsed 7%CPU
    (0avgtext+0avgdata 112960maxresident)k 0inputs+37800outputs
    (0major+29319minor)pagefaults 0swaps

## Hyrax

We attempted to create a collection with 100K items, but the test was terminated after 12 hours.

<div id="cho_collections_100000" style="width:100%; height:400px;"></div>

    real 722m11.468s    user 94m18.218s    sys 11m1.927s

# Nested Works Test Results

## Valkyrie with Postgres

We attempted to create 10,000 nested works within one work, but the test failed before that.

<div id="postgres_nested_collections_10000" style="width:100%; height:400px;"></div>

    8553.42 user 61.51 system 2:35:43 elapsed 92%CPU
    (0avgtext+0avgdata 15162988maxresident)k 29446289inputs+6811464outputs
    (33986major+4273558minor)pagefaults 0swaps


## Valkyrie with Fedora

We attempted to create 10,000 nested works within one work, but the test failed before that.

<div id="fedora_nested_collections_10000" style="width:100%; height:400px;"></div>

    Net::ReadTimeout: Net::ReadTimeout

    22931.08 user 29.03 system 10:28:05 elapsed 60%CPU
    (0avgtext+0avgdata 1712764maxresident)k 0inputs+10304outputs
    (0major+3901698minor)pagefaults 0swaps


## Valkyrie with ActiveFedora

We attempted to create 1K nested works within one work, but the test was terminated after several hours.

<div id="active_fedora_nested_collections_1000" style="width:100%; height:400px;"></div>

## Hyrax

<div id="cho_nested_collections_1000" style="width:100%; height:400px;"></div>

# Files Test Results

With a unique 1MB file for each work, the tests were capped at 1,000 because of disk space limitations.

## Valkyrie with Postgres

<div id="postgres_files_1000" style="width:100%; height:400px;"></div>

## Valkyrie with Fedora

<div id="fedora_files_1000" style="width:100%; height:400px;"></div>

<!--
[deploy@choweb1qa current]$ time bundle exec rake fedora_testing:files[100]

real    0m40.033s
user    0m20.251s
sys     0m3.151s
[deploy@choweb1qa current]$ time bundle exec rake fedora_testing:files[1000]

real    5m46.804s
user    2m29.848s
sys     0m17.905s -->

## Valkyrie with ActiveFedora

<div id="active_fedora_files_1000" style="width:100%; height:400px;"></div>

<!--
[deploy@choweb1qa current]$ time bundle exec rake active_fedora_testing:files[100]

real    1m0.217s
user    0m33.636s
sys     0m2.663s
[deploy@choweb1qa current]$ bundle exec rake testing_support:clean
[deploy@choweb1qa current]$ time bundle exec rake active_fedora_testing:files[1000]

real    12m10.749s
user    5m11.323s
sys     0m22.615s -->

## Hyrax

<div id="cho_files_1000" style="width:100%; height:400px;"></div>

    real 71m26.433s    user 23m32.859s    sys 1m33.824s

# Comparison of Backends

This compares the total time per each benchmark for all four backends.

## Collections

<div id="collectionComparison" style="width:100%; height:400px;"></div>

## Nested Works

<div id="nestedComparison" style="width:100%; height:400px;"></div>

## Files

<div id="fileComparison" style="width:100%; height:400px;"></div>
