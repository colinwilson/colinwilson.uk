+++
author = "Colin Wilson"
categories = [""]
date = "2017-06-19T00:20:01+01:00"
description = "Custom shell script to auto-update SSL certs on KEMPs LoadMaster via pfSense ACME package"
draft = false
publishdate = "2017-06-19T00:19:56+01:00"
tags = ["AWS","SSL","KEMP Technologies","Azure","Load Balancing","Kemp","Let's Encrypt","pfSense"]
title = "Auto-update SSL Certificates on KEMP LoadMaster via pfSense & Let's Encrypt"

[twitter]
  card = "summary"
  site = "@colinwiIson"
  title = "Auto-update Certificates on KEMP LoadMaster via pfSense & Let's Encrypt"
  description = "Use a shell script to auto-update SSL certs on KEMPs LoadMaster via pfSense ACME package"
  image = "https://colinwilson.uk/img/kemp_lm_opt.png"

+++

<p class="tc"><img src="/img/kemp_lm_opt.png"></p>

KEMP and pfSense both offer hardware, virtual appliance and cloud based deployment solutions (AWS & Azure) for their products. This makes for a solid, relatively low cost combination of "edge" router/firewall and load balancer for physical and especially cloud based assets.

## KEMP LoadMaster

One of the LoadMasters features is SSL/TLS offloading. Using the LoadMasters portal as a central point for SSL certificate management is a much more efficient solution for maintaining SSL certificates than painstakingly updating certificates for individual assets (e.g. IIS,Apache,Exchange).

KEMPs LoadMaster also offers a RESTful API interface for querying and configuring various settings and preferences.

## pfSense & Let's Encrypt

pfSense recently (2.3.2-p1) introduced the [ACME](https://doc.pfsense.org/index.php/ACME_package) package which interfaces with Let's Encrypt to handle certificate generation, validation and renewal. The package features an 'Actions list' option which enables you to automatically run a custom shell script after any scheduled certificate renewal or generation.
<p class="tc"><img src="/img/actions_list.png"></p>

## Auto update LoadMaster SSL Certificates

Using a custom shell script, it's possible to automatically update SSL certificates on a LoadMaster via its RESTful API whenever ACME runs a scheduled certificate renewal.

KEMPs LoadMaster API offers Basic and Certificate-Based Authentication. Create a unique user for the pfSense ACME package to utilize (basic or cert authorization). For more information on setting up a new user see the [KEMP RESTful API Documentation](https://support.kemptechnologies.com/hc/en-us/articles/203863435-RESTful-API#_Toc334085585).

Once a new user is setup, you can now upload your shell script to pfSense and add the appropriate command in the `Actions list` section of the ACME package configuration page. When the cronjob to renew the certificate is processed, your script will automatically execute and upload the renewed certificate to the LoadMaster replacing the existing certificate of the same name.
