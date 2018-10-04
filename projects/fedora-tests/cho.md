---
layout: page
title: "CHO Benchmark Tests"
date: 2018-03-07 08:34
main: false
permalink: /cho-benchmarks
---

<script type="text/javascript" src="https://canvasjs.com/assets/script/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
<script type="text/javascript" src="/projects/fedora-tests/chart.js"></script>
<script type="text/javascript" src="/projects/fedora-tests/cho-chart.js"></script>

# Performance Comparison

CHO's current MVP release when compared against the original Valkyrie sample. The original
Valkyrie test with Postgres took 7'23". In CHO, the same collection size took 43 minutes.
CHO's collections contained randomized metadata, while the Valkyrie original did not.

CHO's tests also took place to a networked Solr instance, so latency could have a played a role.

<div id="choComparison" style="width:100%; height:400px;"></div>

# Large Collections

Sample collection with 1 million unordered works. This is a metadata-only collection, with no files and
only titles. It took approximately 2.5 hours to complete the test.

<div id="collectionComparison" style="width:100%; height:400px;"></div>

