+++
author = "Colin Wilson"
categories = [""]
date = "2019-07-22T21:43:01+01:00"
description = "How to import MaxMind's GeoLite2 Database to PostgreSQL (≥9.6)"
draft = true
publishdate = "2019-07-22T21:43:01+01:00"
tags = ["PostgreSQL","Database","GeoIP", "MaxMind","SQL","GeoLite2","Postgres"]
title = "How to import MaxMind's GeoLite2 Database to PostgreSQL"

[twitter]
  card = "summary"
  site = "@colinwiIson"
  title = "Importing MaxMind GeoLite2 to PostgreSQL (≥9.5)"
  description = "Importing MaxMind GeoLite2 to PostgreSQL (≥9.5)"
  image = "https://colinwilson.uk/img/import_geoip_sql/import_geoip_to_sql_opt.png"

+++

<p class="tc"><img src="/img/import_geoip_sql/import_geoip_to_sql_opt.png"></p>

## Introduction

[GeoLite2](https://dev.maxmind.com/geoip/geoip2/geolite2/) is a free (and fairly accurate) IP geolocation database offered by MaxMind. It's also updated once a month in order to maintain a reasonable level of accuracy and is available in binary or CSV formats.

The GeoLite2 database can help you determine the City or Country location of an IP as well as the ISP who owns it.

## Prerequisites

Before following this tutorial make sure you have:

* An installation of PostgreSQL 9.6 or greater.

## Step 1

Download and unzip the [CSV formatted versions](https://dev.maxmind.com/geoip/geoip2/geolite2/) of the GeoLite2 databases from MaxMind to a location on your system e.g. `/tmp/`

## Step 2

Login to your PostgreSQL database using [`psql`](https://www.postgresql.org/docs/current/app-psql.html) or your preferred database IDE (e.g. [DataGrip](https://www.jetbrains.com/datagrip/), [DBeaver](https://dbeaver.io/)) and run the following SQL statements to create the necessary tables and import the Geolite2 data from CSV files you extracted in **Step 1**:

<pre><code class="sql">CREATE TABLE geoip_blocks (
	network cidr,
	geoname_id bigint,
	registered_country_geoname_id bigint,
	represented_country_geoname_id bigint,
	is_anonymous_proxy bool,
	is_satellite_provider bool
);

copy geoip_blocks from '/tmp/GeoLite2-Country-Blocks-IPv4.csv' delimiter ',' csv header;
copy geoip_blocks from '/tmp/GeoLite2-Country-Blocks-IPv6.csv' delimiter ',' csv header;

CREATE INDEX geoip_blocks_network_idx ON geoip_blocks USING gist (network inet_ops);

CREATE TABLE geoip_locations (
	geoname_id bigint,
	locale_code varchar(2),
	continent_code varchar(2),
	continent_name varchar(255),
	country_iso_code varchar(2),
	country_name varchar(255),
	eu_member bool
);

copy geoip_locations from '/tmp/GeoLite2-Country-Locations-en.csv' delimiter ',' csv header;
</code></pre>

You may encounter the following error (especially when connecting to a remote database such as AWS RDS or Google Cloud SQL via a client/psql):

<pre><code class="sql">ERROR:  must be superuser or a member of the pg_read_server_files role to COPY from a file
HINT:  Anyone can COPY to stdout or from stdin. psql's \copy command also works for anyone.
</code></pre>

In this case you can copy the files from your client computer to your database using the psql's [\copy meta command](https://www.postgresql.org/docs/current/app-psql.html#APP-PSQL-META-COMMANDS-COPY):

<pre><code class="sql">psql -U username -d dbname -h hostname -p port -c "\copy geoip_blocks FROM 'C:\tmp\GeoLite2-Country-Blocks-IPv4.csv' with (format csv,header true, delimiter ',');"
Password for user test:
COPY 331103
</code></pre>

*Note: Since some of GeoLite2's CSV files are up to 190MB in size the \copy commands may take a while when working with remote cloud databases depending on your available bandwidth*

MaxMind's GeoLite2 database has now been successfully imported to your PostgreSQL database.

You can now run various queries against these tables to lookup various geolocation info on IP addresses.

### Example 1

Lookup the `network`, `country_name` & `country_iso_code` of an IP address

<pre><code class="sql">select
    network,
    country_name,
    country_iso_code
from
    geoip_blocks
        join geoip_locations on geoip_blocks.geoname_id = geoip_locations.geoname_id
where
    network >>= '194.168.4.100'::inet;
</code></pre>

Result:

<pre><code class="sql">    network     |  country_name  | country_iso_code
----------------+----------------+------------------
 194.168.0.0/16 | United Kingdom | GB
</code></pre>

### Example 2

So you have a database (PostgreSQL) table containing a column of IPs which needs to be resolved to Geo Locations.

These IPs could be client access IPs, email message origin IPs etc. Doesn't matter really.