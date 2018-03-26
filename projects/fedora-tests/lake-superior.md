---
layout: page
title: "Lake Superior Tests"
date: 2018-03-26 10:45
main: false
permalink: /lake-superior
---

<script type="text/javascript" src="https://canvasjs.com/assets/script/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
<script type="text/javascript" src="/projects/fedora-tests/chart.js"></script>
<script type="text/javascript" src="/projects/fedora-tests/superior-chart.js"></script>

# Inverse Collections

A single collections with 100,000 works, in an inverse relationship with the work referencing
the collection. All tests used a Solr index with auto-suggest disabled.

<div id="lakeSuperiorComparison" style="width:100%; height:400px;"></div>

### ActiveFedora

Using the ActiveFedora adapted with Valkyrie took 23 hours. It is also worth noting that even
though this was a metadata-only test, it used 172 GB of disk. We're assuming this was largely in the Fedora repository.

    8584.52s user 449.45s system 10% cpu 23:05:01.55 total

### Fedora

Using the Fedora adapter with Valkyrie took 13 hours and used 167 GB of disk. Again, assuming this was largely all Fedora data.

    1345.51s user 107.13s system 3% cpu 13:08:38.49 total

### Lake Superior

Using the Fedora adapter in Valkyrie with Lake Superior (and not Fedora) took ~ 7 hours and used 866 MB of
disk.

    9635.17s user 507.91s system 40% cpu 6:58:27.16 total

### Postgres

Using the Postgres adapter with Valkyrie took 7 minutes, 23 seconds and used no describable disk space.

    357.16s user 13.31s system 83% cpu 7:23.43 total

