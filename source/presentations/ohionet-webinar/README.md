# One of the Many Heads of Hydra
## At the Rock and Roll Hall of Fame

Date and Time
: Friday, August 9, 2013 2:00 p.m. EDT

Format
: Webinar hosted by OHIONET

### Description
Hydra is an open source repository solution that is becoming increasingly popular in Ohio. More than that, 
Hydra is a community for collaboration. Learn more about the instance (head) of Hydra that is growing at the 
Rock and Roll Hall of Fame + Museum Library and Archives. Adam Wead, Systems and Digital Collections Librarian 
for the Museum, will take us through the process he used to build the head, compare Hydra to other repository 
solutions, talk about modeling content, and discuss some of the requirements for adoption—all in just one hour
  
### Introduction

##### Hello, my name is
  * Adam Wead, Systems and Digital Collections Librarian at the Rock and Roll Hall of Fame and Museum
  * Hydra webinar in three parts:
    + Background: Using Hydra as a digital asset manager
    + Technical Geekery: Hydra's technical components and what they're all about
    + Building a Hydra Head: Starting down the path to building your own head

##### Hydra at the Rockhall
  * We've been using Hydra for about 2 years now
  * Only video at the moment
    + 1650+ videos
    + 175 TB of data, mostly uncompressed video files stored on LTO tape, and not hard disk
    + PBCore metdata schema
    + compressed H264 files for streaming
    + records get exported to a discovery interface
  * Hydra works for us because it can satisfy all these needs in a way that other asset managers could not

### Part 1: Conceptual Background

##### What is Hydra?
  * Conceptual level:
    Community of software developers, end users, adopters and institutions focused on the managemement of digital content
  * Philosophy:
    If you want to go fast, go alone; if you want to go far, go together
  * Everyone is facing the same challenges with digital content, why no pool collective resources and build a solution
    that can leverage the work of other institutations and individuals who are meeting these shared challenges.

##### Current Hydra adopters and their solutions
  * Current partners
    + Stanford University
    + University of Virginia
    + University of Hull
    + Fedora Commons (now part of DuraSpace)
    + University of Notre Dame
    + Northwestern University
    + Columbia University
    + Penn State University
    + Indiana University
    + London School of Economics and Political Science
    + Rock and Roll Hall of Fame
    + The Royal Library of Denmark
    + Data Curation Experts
    + WGBH
    + Boston Public Library
    + Duke University
    + Yale University
    + Virginia Tech
  * info on their solutions can be found at http://projecthydra.org/
    + includes links to their Hydra-based websites
    + screencasts
  * scope of current solutions
    + image collections
    + media content
    + archicval collection presentation
    + institutional repositories
    + electronic theses and dissertations

##### Challenges with digital media
  * a digital asset manager needs to do just that: manage your digital content and ensure it will be
    available in the comming years
  * what are the challenges when doing that?
    + identifying content types: images, audio, text, pdf, video, etc.
    + description, i.e. metadata
    + storage and preservation
    + lifecycle: identify things that need to be deleted, kept, or migrated to newer formats
    + format conversions, such as creating derivative files
    + workflows for ingesting new content correctly, i.e. required information, supported formats
    + searching, updating, viewing your content 
    + controlling access

##### Archiving or just "managing" ?
  * archiving implies another set of features in addition to basic digital asset management features
    + presentation of multiple items as a coherent unit, i.e. collections
    + heirarchichal organziation with varied levels of description
    + accessioning of content
  * an asset manager is generally more item-level driven; archival information is collection-level driven
    + top-down versus bottom-up
  * asset managers may use collections or groups of items, but these do no always correspond to what a
    collection means to an achivist or a collection withing an existing archives

##### What's out there now?
  * solutions exist today to address most of these problems
  * they aren't designed to work in concert with one another
  * some aren't targeted towards librares or archives
  * solutions become a "stack" or combination of tools and procecudes grouped into a collective
    process that attempts to solve the asset management problem

##### Current landscape of asset management products
  * Proprietary
  * Generally built around an existing library product, such as an ILS, or focus on specific type of
    content or area
    + ContentDM (Innovative)
    + Rosetta (ExLibris)
    + Canto (favors text documents for businesses)
    + Piction (favors images for business, gov. and museums)
    + and many, many more
      
  * Opensource 
  * Built on a specific technological platform\
  * often use Fedora
    + DSpace
    + Islandora
    + RODA (http://roda+community.org/)
    + Omeka
    + many others ...

##### Asset Management Pitfalls
  * any asset manager that touts a "turnkey" or "out of the box" solution" makes assumptions about your content:
    + it has to: aiming for the common denominator
    + pre-fab modeling: organization of content, collections, rights management
    + type: A/V formats, file formats, data
    + metadata: Dublin Core, EAD, or MARC
  * your local implementation is limited to the constraints imposed by these assumptions
  * you will need to customize to overcome any of these constraints
  * you may need to customize just to get it to run "out of the box"
  * you'll need to customize even if it does run "out of the box" and you accept its constraints
  * did I mention you'll probably need to customize?
  * costs
    + money: $$$
    + technological resources: servers, storage, equipment
    + human resources: software developers, library technologists, users

##### What's good about Hydra
  * makes no assumptions about your data (well, actually one assumption)
  * can model anything
  * using any metadata standard
  * using any content
  * stored anywhere
  * accessed by anyone or no one
  * presented as anything (using HTML and Javascript)
  * underlying technologies are abstracted (Fedora and Solr)
  * it's "free" and open-source

##### What's not-so-good about Hydra
  * technologically daunting -- you're going to be overwhelmed. that's okay.
  * deep "stack" of technologies
  * tied to the Ruby-on-Rails framwork
  * favors a Unix environment
  * requires in-house expertise/ability/willingness
  * not a turnkey solution (yet...)
  * no Hydra hosting options
    + you're required to provide your own hardware, but you can use hosted solutions for that

##### Why should I use it?
  * Decide for yourself...
  * Everything has costs
  * Every solution will require some technical expertise as well as some "jury rigging"
    + spending time getting the system running
    + learning
    + integrating with exsting systems: ILS, archival data, your databasases, your server systems and storage
  * Proprietary solutions don't work "out of the box" either
    + vendor may limit your ability to customize
  * Any open source solution will require modifications to meet your needs
    + open source products make assumptions about your content to reduce the amount of customization but there's the
      tradeoff of less operability
  * Avoiding "reinventing the wheel" - Hydra includes basic functionality at its core enabling the user to
    get started relatively quickly with a rich set of features
  * Can draw on a shared community of adopters and partners, each with their own technological resources
    + borrow and use other people's work and add it to your hydra head

### Part 2: Technology backstories

  Hydra uses a lot of different technologies, each of which has a history and purpose.  We'll look at those indivudually
  and then see how they work together to form the "Hydra stack."

##### What is Hydra, technically?
  * it's a web application
  * specifically, it's a Ruby on Rails web application
  * Built using the Blacklight and Hydra "gems"
  * Fedora repository for creating and describing content
  * Solr for searching
  * Various other "Rails-isms" for additional features
    + User accounts
    + Authentication and authorization
    + MySQL database or other RDMS
    + JQuery javascript library for building an interface

##### A Brief History of Web Applications
  
  [sketch of a web appliation]

  * HTML displayed dynamically from content in a database
  * content is processed from the database and rendered to HTML
  * processing-layer was customized to the particular database
  * the backend database was inexorably tied to the front-end computer language
    + matrix of options

  [messy web application drawing]

  * many configuration variables
  * moving to a different processing language or database involved rewriting the entire application

##### Rails
  * Says: I don't care about any of that, just let me write a web application
  
  [simplified rails database model]

  *  web-development framework designed for rapid development
  * convention over configuration
    + database tables, fields, relationships use conventions
    + generated code, as opposed to "hand-written"
  * data is modeled abstractly and it not tied to one particular database
  * uses the Ruby programming language
    + has "gems" which provide additional features
    + like attachments for your Kitchen Aid mixer

##### Let's use a database!

  * modeling business data is easy
  * modeling library data is hard
  * have to use tables to hold our information

[drawing]

  * database tables get unweildly when dealing with amorphous content
  * extending them is "costly"
  * difficult to store content

# F E D O R A

  * flexible
  * extensible
  * digital
  * object
  * repository
  * architecture

##### Fedora Object Model

  * starts with what you're trying to store: files, images, text,
  * allows you describe multiple ways

[drawing]

##### What's great about Fedora

  * can accomodate any kind of content
  * can describe any kind of relationship
  * uses RDF (library-approved)
  * speaks XML for metadata (library-approved)
  * data, both content and metadata, can be persisted many ways:
    + filesystem
    + URL
  * objects can be just metadata without content
  * content can be referenced elsewhere either as a file or a URI
  * versioning of datastreams, including keep past versions

##### What's not-so-great about Fedora?

  * slow
  * it's just a backend
  * can't search like a traditional database
    + Fedora does make use of MySQL to assit with searching RDF relationships
    + MySQL is a dependency, but not a requirement for devloping Fedora-based applications
  * if only we could search Fedora like an SQL database...

##### Solr

  A search engine, all wrapped up and ready to go.

##### The Search Engine Wars

  * Yahoo, Excite, Google
  * After Google "won", Excite's engine went open-source
  * Later taken up by the Apache Foudation
  * Proprietary branch: Lucene
  * Open-source branch: Solr

##### What does Solr do, exactly?

  * Indexes a sets of documents containing fields you define, with content you provide
  * Provides many of the core-features of a modern-day information retrieval system:
    + boolean matching
    + vector space model matching
    + tunable relevance ranking
    + stop word removal
    + stemming
    + support for multiple languages
    + facet queries
  * very fast, easy to run

##### What's not to like about Solr?

  * highly configurable ... you have to know what you're doing
  * you define field names and types
    + fields used for display
    + fields used for searching
    + multivalued fields

  [image of lots of knobs and dials]

##### Blacklight

  * a rails "gem" designed to provide a faceted search and discovery for library data
  * by default, indexes MARC records into solr
  * provides a basic web interface with three modes:
    + searching with queries and facets
    + displaying lists of search results
    + displaying individual item records
  # additional functions
    + user accounts (using a Rails gem called Devise)
    + bookmarking

##### Putting the Hydra stack together

  [project hydra diagrams, page 1]

  * Hydra is a Rails app, but with Fedora instead of a SQL database
  * Hydra takes care of the Fedora and Solr stuff:
    + stores both content and metadata in Fedora
    + manages the relationships between your objects
    + indexes metadata into Solr for searching (so you don't have to mess with configuring solr)
    + uses the Blacklight gem to provide the search and retrieval interface
  * What you do
    + you develop the interface to add/edit/delete content and link objects to one another
    + build additional features and the user interface design
    + accomplished mostly with gems

##### Watching the stack in action

  * Define a model
  * identify a metadata schema
  * add content
  * index your metadata into Solr
  * start searching

### Part 3: Buidling a Hydra Head

  If you're overwhelmed at this point, that's okay.  I was too.  If you want to start building a repository
  using Hydra, you'll need to understand a lot of this, but you won't necessarily need to build every piece
  from scratch.  Hydra has its own sets of gems that can make some of this easier.

##### Requirements
  * at least 1 developer/sys. admin
    + ideally 2 people, one for dev one for admin
    + or if you already have an existing tech person, create a new dev role
  * a server with enough storage
    + everything can be on one machine, but load is a factor
    + high-demand applications will require additional hardware
    + rails/solr/fedora can each be separated out to different hardware environments as needed
  * hosting options
    + Amazon AWS
    + cloud storage with Fedora
    + hosted Rails applications
    
##### Learning
  * Ruby
  * Rails
  * Hydra

##### Buildind a "Head"
  * modeling content
  * choosing a metadata standard

##### Get Involved
  * committer's calls
  * partner meetings
  * irc chat room
  * hydra+tech email list
  * HydraCamp
