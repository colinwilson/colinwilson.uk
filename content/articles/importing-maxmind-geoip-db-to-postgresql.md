+++
author = "Colin Wilson"
categories = [""]
date = "2019-07-22T21:43:01+01:00"
description = "How to import MaxMind's GeoLite2 Database to PostgreSQL (≥9.6)"
draft = false
publishdate = "2019-07-24T01:29:00+01:00"
tags = ["PostgreSQL","Database","GeoIP", "ASN", "MaxMind","SQL","GeoLite2","Postgres", "Tutorial"]
title = "How to import MaxMind's GeoLite2 Database to PostgreSQL"

[twitter]
  card = "summary"
  site = "@colinwiIson"
  title = "How to import MaxMind's GeoLite2 Database to PostgreSQL (≥9.6)"
  description = "How to import MaxMind's GeoLite2 Database to PostgreSQL (≥9.6)"
  image = "https://colinwilson.uk/img/import_geoip_sql/import_geoip_to_sql_opt.png"

+++

<p class="tc"><img src="/img/import_geoip_sql/import_geoip_to_sql_opt.png"></p>

## Introduction

[GeoLite2](https://dev.maxmind.com/geoip/geoip2/geolite2/) is a free, monthly updated IP geolocation database offered by MaxMind. It is available to download in binary or CSV formats.

The GeoLite2 database can help you determine the City or Country location of an IP ([within a reasonable degree of accuracy](https://dev.maxmind.com/geoip/geoip2/geolite2/#IP_Geolocation_Usage)) as well as the ISP/Organisation that owns it.

## Prerequisites

Before following this tutorial make sure you have:

* An installation of PostgreSQL 9.6 or greater.

## Step 1 - Download GeoLite2

Download and unzip the [CSV formatted versions](https://dev.maxmind.com/geoip/geoip2/geolite2/) of the GeoLite2 databases from MaxMind to a location on your system e.g. `/tmp/`

## Step 2 - Import GeoLite2 CSV files to PostgreSQL

Login to your PostgreSQL database using [`psql`](https://www.postgresql.org/docs/current/app-psql.html) or your preferred database IDE (e.g. [DataGrip](https://www.jetbrains.com/datagrip/), [DBeaver](https://dbeaver.io/)) and run the following SQL statements to create the necessary tables and import the Geolite2 (City & ASN) data from the CSV files you extracted in **Step 1**:

### Import GeoLite2's city and ASN network blocks and city locations

**Note:** If you don't require the granularity or resolution of city names or the ASN database you can import only the country geoip blocks and locations by running the statements in the <a href="#country_import_only">Import GeoLite2's country network blocks and locations</a>
 section:

<pre><code class="sql">CREATE TABLE geoip_blocks (
    network cidr,
    geoname_id bigint,
    registered_country_geoname_id bigint,
    represented_country_geoname_id bigint,
    is_anonymous_proxy bool,
    is_satellite_provider bool,
	postal_code varchar(8),
	latitude decimal(9,6),
	longitude decimal(9,6),
	accuracy_radius smallint
);

/* If user is not a superuser or member of the pg_read_server_files role use
psql's \copy meta command to import CSV files to database */
copy geoip_blocks from '/tmp/GeoLite2-City-Blocks-IPv4.csv' delimiter ',' csv header;
copy geoip_blocks from '/tmp/GeoLite2-City-Blocks-IPv6.csv' delimiter ',' csv header;

CREATE INDEX geoip_blocks_network_idx ON geoip_blocks USING gist (network inet_ops);

CREATE TABLE asn_blocks (
    network cidr,
    autonomous_system_number bigint,
	autonomous_system_organization varchar(255)
);

copy asn_blocks from '/tmp/GeoLite2-ASN-Blocks-IPv4.csv' delimiter ',' csv header;
copy asn_blocks from '/tmp/GeoLite2-ASN-Blocks-IPv6.csv' delimiter ',' csv header;

CREATE INDEX asn_blocks_network_idx ON asn_blocks USING gist (network inet_ops);

CREATE TABLE geoip_locations (
    geoname_id bigint,
    locale_code varchar(2),
    continent_code varchar(2),
    continent_name varchar(255),
    country_iso_code varchar(2),
    country_name varchar(255),
	subdivision_1_iso_code varchar(3),
	subdivision_1_name varchar(255),
	subdivision_2_iso_code varchar(3),
	subdivision_2_name varchar(255),
	city_name varchar(255),
	metro_code varchar(3),
	time_zone varchar(255),
    is_in_european_union bool
);

copy geoip_locations from '/tmp/GeoLite2-City-Locations-en.csv' delimiter ',' csv header encoding 'UTF8';
</code></pre>

You may encounter the following error (particularly if connecting to a remote database such as AWS RDS or Google Cloud SQL via a client/psql using a **non**-superuser account):

<pre><code class="sql">ERROR:  must be superuser or a member of the pg_read_server_files role to COPY from a file
HINT:  Anyone can COPY to stdout or from stdin. psql's \copy command also works for anyone.
</code></pre>

In this case the simplest option is to run the `CREATE` statements and `copy` commands independently, but **in order**. Like the 'HINT' states, psql's [\copy meta command](https://www.postgresql.org/docs/current/app-psql.html#APP-PSQL-META-COMMANDS-COPY) can be used to copy the files from your client computer to your database:

<pre><code class="sql">psql -U test -d dbname -h hostname -p port -c "\copy geoip_blocks FROM 'C:\tmp\GeoLite2-Country-Blocks-IPv4.csv' with (format csv,header true, delimiter ',');"
Password for user test:
COPY 331103
</code></pre>

If you're client computer is a Windows system you may need to include an encoding option (`UTF8`) with the \copy command when importing the `GeoLite2-City-Locations-en.csv` file to avoid encoding compatibility errors:

<pre><code class="sql">psql -U test -d dbname -h hostname -p port -c "\copy geoip_locations FROM 'C:\tmp\GeoLite2-City-Locations-en.csv' with (format csv,header true, delimiter ',', encoding 'UTF8');"
Password for user test:
COPY 112566
</code></pre>

*Note: Since some of GeoLite2's CSV files are up to 190MB in size, depending on your available bandwidth the \copy commands may take a while when working with remote cloud databases via psql/client*

<h3 id="country_import_only">Import GeoLite2's country network blocks and locations</h3>

<pre><code class="sql">CREATE TABLE geoip_blocks (
	network cidr,
	geoname_id bigint,
	registered_country_geoname_id bigint,
	represented_country_geoname_id bigint,
	is_anonymous_proxy bool,
	is_satellite_provider bool
);

/* If user is not a superuser or member of the pg_read_server_files role use
psql's \copy meta command to import CSV files to database */
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
	is_in_european_union bool
);

copy geoip_locations from '/tmp/GeoLite2-Country-Locations-en.csv' delimiter ',' csv header;
</code></pre>

## Conclusion

You've now successfully imported MaxMind's GeoLite2 database to your PostgreSQL database.

You can now run various queries against the `geoip_blocks`, `asn_blocks` and `geo_locations` tables to lookup various geolocation info on IP addresses.

### Example 1

Lookup the `network`, `city_name`, `country_name` and `country_iso_code` of an IP address

<pre><code class="sql">SELECT
    network,
    city_name,
	country_name,
    country_iso_code,
	time_zone
FROM
    geoip_blocks
        INNER JOIN geoip_locations ON geoip_blocks.geoname_id = geoip_locations.geoname_id
WHERE
    network >>= '5.39.25.176'::inet;
</code></pre>

Result:

<pre><code class="sql">    network     | city_name |  country_name  | country_iso_code |   time_zone
----------------+-----------+----------------+------------------+---------------
 5.39.25.176/28 | London    | United Kingdom | GB               | Europe/London
</code></pre>

### Example 2

Lookup the `network` and `autonomous_system_organization` of an IP address

<pre><code class="sql">SELECT
    network,
    autonomous_system_organization
FROM
    asn_blocks
WHERE
    network >>= '1.1.1.1'::inet;
</code></pre>

Result:

<pre><code class="sql">  network   | autonomous_system_organization
------------+--------------------------------
 1.1.1.0/24 | Cloudflare, Inc.
</code></pre>

### Example 3

A common use case is batch resolving a table (`table_with_ips`) containing IP addresses. For example you may have a table containing a column of IPs, `ip_address`, each of which requires the corresponding geolocation resolved and stored in the `ip_country` column.

<pre><code class="sql">+---------------+------------+
|  ip_address   | ip_country |
+---------------+------------+
| 90.207.238.97 | null       |
| 194.168.4.100 | null       |
|   62.24.134.1 | null       |
|  212.23.3.100 | null       |
|   62.6.40.178 | null       |
+---------------+------------+
</code></pre>

Run an `UPDATE JOIN` statement using the `geoip_locations` and `geoip_blocks` tables:

<pre><code class="sql">UPDATE
    table_with_ips
SET
    ip_country = country_iso_code
FROM
    geoip_blocks
    INNER JOIN geoip_locations ON geoip_blocks.geoname_id = geoip_locations.geoname_id
WHERE
    network >>= table_with_ips.ip_address::inet
    AND ip_country IS null;
</code></pre>

Result:

<pre><code class="sql">+---------------+------------+
|  ip_address   | ip_country |
+---------------+------------+
| 90.207.238.97 | GB         |
| 194.168.4.100 | GB         |
|   62.24.134.1 | GB         |
|  212.23.3.100 | GB         |
|       8.8.4.4 | US         |
+---------------+------------+
</code></pre>