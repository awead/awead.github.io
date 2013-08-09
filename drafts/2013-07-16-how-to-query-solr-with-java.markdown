---
layout: post
title: "How to Query Solr with Java"
date: 2013-07-16 16:07
comments: true
categories: 
---

OK, this seems like an insipid title for a post, but this was way more complicated than I thought it would be.

### Background

So, this week has been an adventure in java, courtesy of the [Wowza IDE](http://www.wowza.com/media-server/developers).  
Java is not my strong suit, but I recently had the need to leverage some of Wowza's module extensions to get some extra functionality with our streaming server.
I have to hand it to the folks at Wowza.  They've done a really good job of providing a nice set of tools to get a would-be developer going writing their
own module extensions.  Basically, they provide you with their own version of Eclipse, to which they've add all the extra bits necessary to build
working code right away.  It's been almost 10 years since I did any real development in Eclipse, and I was happily surprised to see how fast I was 
able to get back on the bandwagon.

In just a day, I had already built-in the necessary classes to limit access to our streaming server based on network ip address and 
a "white list" of video ids.  It wasn't the greatest looking code, but it worked.  However, for this to be a robust enough solution,
I needed to be able to query solr to the status of a particular video's access, instead of relying on manually edited lists of ids.

### The Problem

SolrJava, or SolrJ for short, is the client library that comes standard with every release of Solr.  The plan was to create a straight-forward
method that queries our solr index.  Digging around the interwebs for details yielded the somewhat 
[outdated SolrWiki page](http://wiki.apache.org/solr/Solrj).  However, the Solr wiki recently underwent a big redo, and there's 
an [updated SolrJ wiki page](https://cwiki.apache.org/confluence/display/solr/Using+SolrJ) as well.

While both of these cover the basics, I think they might make some assumptions, or leave out a few details.  It took me a couple of
days to get an actual query working.  The first problem was obtaining the right library jar files.  The newer wiki page does a good
job of explaining this, but SolrJ is essentially a part of Solr, so the best way to get the libraries is simply 
[download Solr](http://lucene.apache.org/solr/downloads.html).  I used the 4.3.0 source file, and simply extracted the tar file.
Searching through the results yielded a lot of jar files.  The wiki pages make it seem that you only need to include a few, but
after some trial and error, here's was the list of jars I needed to include in my project:

    commons-logging-1.1.3.jar
    httpclient-4.2.3.jar
    httpcore-4.2.2.jar
    httpmime-4.2.3.jar
    log4j-1.2.16.jar
    noggit-0.5.jar
    slf4j-api-1.6.6.jar
    slf4j-log4j12-1.6.6.jar
    solr-core-4.3.0.jar
    solr-solrj-4.3.0.jar

The next issue for me was which bits from these jars to actually import into the application.  To start with, I created a very simple example that
would serve as proof-of-concept.

``` java MySolr.java

public class MyQuery {

	public static void main(String[] args) throws SolrServerException {
		String urlString = "http://localhost:8983/solr";
		SolrServer solr = new HttpSolrServer(urlString);
		SolrQuery parameters = new SolrQuery();
    }
}

```

To get this to compile properly, I needed to import the right classes from each of the jars.  That took some additional trial and error, but
after a few ClassNotFound exceptions, I came up with this list of packages:

    import org.apache.commons.*;
    import org.apache.http.*;
    import org.apache.http.client.*;
    import org.apache.http.client.entity.*;
    import org.apache.http.entity.*;
    import org.apache.log4j.*;
    import org.apache.solr.client.solrj.*;
    import org.apache.solr.client.solrj.impl.*;
    import org.apache.solr.client.solrj.response.*;
    import org.apache.solr.client.solrj.util.*;
    import org.apache.solr.common.*;
    import org.apache.solr.common.util.*;
    import org.noggit.*;
    import org.slf4j.*;
    import org.slf4j.impl.*;

The parts of the wiki pages covered how to build queries and execute them.  The problem I ran into here was adding the parameters to the query.  Following
the wiki, it appears as though you can add a query term using two strings:

    SolrQuery parameters = new SolrQuery();
    parameters.set("q", "foo_field:bar_value");

However, java complains:


