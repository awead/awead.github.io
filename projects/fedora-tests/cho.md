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

## Collection Tests

Creating a single collection with 100,000 works in it. Each work is metadata-only and has no binary
content. The metadata is randomly generated and does differ between each work.

### Overall

| Release     | Time (sec.)     |
| ----------- | --------------: |
| 0.1         | 33527.1         |
| 0.2         | 50079.7         |
| 0.3         | 50037.7         |
| 0.4         |  8182.1         |
| 0.5         | 30060.3         |
| 0.6         | 35035.0         |
| 0.7         | 35428.8         |

Network issues with Solr likely played a role in the differences between timings in release 0.1 - 0.3
versus 0.4.

### Comparing Each Release

<div id="choMVPComparison" style="width:100%; height:400px;"></div>

### Current Release

This compares the current release with the original Valkyrie dataset.

<div id="choCurrentComparison" style="width:100%; height:400px;"></div>

## Works with Files

Creates work with the same randomized metadata as the collection test, but also adds a 50 MB
random file to the work.

### Overall

| Release     | Time (sec.)     |
| ----------- | --------------: |
| 0.1         | 142.0           |
| 0.2         | 140.7           |
| 0.3         | 153.8           |
| 0.4         | 285.3           |
| 0.5         | 196.6           |
| 0.6         | 187.6           |
| 0.7         |  57.2           |

### Comparing Each Release

<div id="workComparison" style="width:100%; height:400px;"></div>

## Large Collections

Sample collection with 1 million unordered works, no binary files, and randomized metadata.
It took approximately 26'15" to finish. This is with the current 0.4 release.

<div id="collectionComparison" style="width:100%; height:400px;"></div>
