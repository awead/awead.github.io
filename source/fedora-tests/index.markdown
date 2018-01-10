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

    real    5m46.804s
    user    2m29.848s
    sys     0m17.905s

## Valkyrie with ActiveFedora

<div id="active_fedora_files_1000" style="width:100%; height:400px;"></div>


    real    12m10.749s
    user    5m11.323s
    sys     0m22.615s

## Hyrax

<div id="cho_files_1000" style="width:100%; height:400px;"></div>

    real 71m26.433s
    user 23m32.859s
    sys 1m33.824s

# Comparison of Backends

This compares the total time per each benchmark for all four backends.

## Collections

<div id="collectionComparison" style="width:100%; height:400px;"></div>

## Nested Works

<div id="nestedComparison" style="width:100%; height:400px;"></div>

## Files

<div id="fileComparison" style="width:100%; height:400px;"></div>

# Further Analysis

## Decreased Performance with Collections

Why does ingest time increase with inversely related collections when using ActiveFedora
in Valkyrie or Hyrax? When using the Fedora and Postgres adapters in Valkyrie, performance remains flat.

Additional tests were conducted locally on a laptop because servers were no longer available. All tests
were capped at 25000 works because that was large enough to show a significant decrease in performance.

### Collection Performance Locally

Running a test using a laptop yielded similar results to those seen in a multi-server environment.
There is a significant performance impact in the server environment, apparently due to network
latency. A laptop performed slightly faster than a server and the variances of time was much smaller.
However, there is still a clean decrease in performance over time in both environments.

<div id="localCollectionComparison" style="width:100%; height:400px;"></div>

### Fedora and Solr Requests

If Fedora performance is degrading, we might see a similar increase in response times with the
different HTTP requests sent to it.

#### Fedora POST

Each time a new work is added to the collection, two POST actions are done: one for the work, and
a second for the access control list resource.

[comment]: <>  Extracted the times from the Fedora log:
[comment]: <>  zcat local_active_fedora_collections_25000.log.Z | grep 8986 | grep ": HTTP POST" | awk '{print $9}'

<div id="local_active_fedora_collections_25000_fedora_post" style="width:100%; height:400px;"></div>

#### Fedora GET

For each new work, there were 5 GET requests:

* 1 for the work
* 3 for access control list resources
* 1 a 404 for the work's `/list_source`

[comment]: <>  Extracted the times from the Fedora log:
[comment]: <>  zcat local_active_fedora_collections_25000.log.Z | grep 8986 | grep ": HTTP GET" | awk '{print $9}'

<div id="local_active_fedora_collections_25000_fedora_get" style="width:100%; height:400px;"></div>

#### Solr Update

The ActiveFedora adapter creates two Solr resources (documents) per work: one for the work, and a second for
the ACL resource in Fedora. The total number of Solr documents came to 50002:

* 25001 Valkyrie::Persistence::ActiveFedora::ORM::Resource (25000 works + 1 collection)
* 25001 Hydra::AccessControl (25000 works + 1 collection)

During the work creation process, Solr makes three updates per collection and work
resulting in a total of 75003 update requests.

Graphing the response times for each request showed the exact same pattern of performance degradation.
Different Solr configurations were tested, but the key factor in performance was the `suggest` field. When
text fields were not copied to the field, as they were with other Solr configurations, response
times improved dramatically.

<div id="solrComparison" style="width:100%; height:400px;"></div>

[comment]: <> Sum up total Solr requests:
[comment]: <> grep solr active_fedora_collections_1000.log | awk '{gsub(/\(|\)|m|s/,"",$9)}1' | awk '{sum += $9} END {print sum}'
[comment]: <> Sum up total Fedora requests:
[comment]: <> grep HTTP active_fedora_collections_1000.log | grep 8986 | awk '{gsub(/\(|\)|m|s/,"",$9)}1' | awk '{sum += $9} END {print sum}'

We don't know exactly why suggest fields have such an impact on performance. All the other Valkyrie adapters
used Solr configurations that had suggest fields enabled, but the performance impact was only felt
when using ActiveFedora.

The common Solr configuration for Hyrax and other Samvera-based applications uses fields with suffixes
such as `_tesim` and `_ssim` to denote stored, searchable text in Solr. Additionally, a `suggest` suffix
is used for fields that Blacklight can use to provide a type of "Did you mean..." search refinement to
users.

``` xml
<dynamicField name="*_tesim" type="text_en" stored="true" indexed="true" multiValued="true"/>
<dynamicField name="*_ssim" type="string" stored="true" indexed="true" multiValued="true"/>

<dynamicField name="*suggest" type="textSuggest" indexed="true" stored="false" multiValued="true" />
```

All text fields' content is copied directly to a suggest field:

``` xml
<copyField source="*_tesim" dest="suggest"/>
<copyField source="*_ssim" dest="suggest"/>
```

The difference in configuration between the fields centers around `_tesim` versus `suggest` fields and
their tokenizers and filters. We would need to do more testing to verify this, but it could be that
the performance impact is related to the KeywordTokenizerFactory in the suggest field and the
ICUTokenizerFactory in the tesim field.

``` xml
<fieldType name="string" class="solr.StrField" sortMissingLast="true" />

<fieldType name="text_en" class="solr.TextField" positionIncrementGap="100">
  <analyzer>
    <tokenizer class="solr.ICUTokenizerFactory"/>
    <filter class="solr.ICUFoldingFilterFactory"/>
    <filter class="solr.EnglishPossessiveFilterFactory"/>
    <filter class="solr.EnglishMinimalStemFilterFactory"/>
    <filter class="solr.TrimFilterFactory"/>
  </analyzer>

  <fieldType class="solr.TextField" name="textSuggest" positionIncrementGap="100">
    <analyzer>
      <tokenizer class="solr.KeywordTokenizerFactory"/>
      <filter class="solr.StandardFilterFactory"/>
      <filter class="solr.LowerCaseFilterFactory"/>
      <filter class="solr.RemoveDuplicatesTokenFilterFactory"/>
    </analyzer>
  </fieldType>
</fieldType>
```

### Final Comparison

When comparing the process of creating 25000 works in a collection, the Solr configuration plays the
critical role in performance.

One of the other dimensions of comparison that was used early on in the testing process was removing
all the commits made to Solr. This showed the same performance boost as with suggest fields. However,
since removing suggest fields, and retaining commits, demonstrated substantial performance increases,
it's pretty clear that while removing commits may give a slight increase over commits without suggest
fields, the principle performance gain is found in removing the tesim to suggest field copying.

<div id="finalCollectionComparison" style="width:100%; height:400px;"></div>

[comment]: <>  With PSU's 5.3 solr: 2055.80s user 105.75s system 5% cpu 11:23:40.56 total
[comment]: <>  With Hyrax 7.1.0 solr configuration: 2060.68s user 109.87s system 5% cpu 11:17:56.82 total
[comment]: <>  Hyrax solr with no commits: 1993.54s user 102.99s system 59% cpu 59:07.53 total
[comment]: <>  Hyrax solr with no auto-suggest: 2190.22s user 113.81s system 55% cpu 1:09:11.23 total

## Collections with Updated Solr Configuration

Since the Solr configuration created a performance hit, all the collection tests could
benefit from an updated Solr that does not use the auto-suggest field.

Rerunning the original 100K test for all four of the backends, and using Hyrax's updated solr
configuration, yields the following results.

<div id="updatedCollectionComparison" style="width:100%; height:400px;"></div>

### Hyrax

The test was terminated after 59 hours. It reached 63796 objects. No disk usage information was gathered.

    20666.27s user 1669.31s system 10% cpu 59:06:22.39 total

### ActiveFedora

Using the ActiveFedora adapted with Valkyrie took 23 hours. It is also worth noting that even
though this was a metadata-only test, it used 172 GB of disk. We're assuming this was largely in the
Fedora repository.

    8584.52s user 449.45s system 10% cpu 23:05:01.55 total

### Fedora

Using the Fedora adapter with Valkyrie took 13 hours and used 167 GB of disk. Again, assuming this was
largely all Fedora data.

    1345.51s user 107.13s system 3% cpu 13:08:38.49 total

### Postgres

Using the Postgres adapter with Valkyrie took 7 minutes, 23 seconds and used no describable disk space.

    357.16s user 13.31s system 83% cpu 7:23.43 total



