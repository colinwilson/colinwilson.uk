+++
author = "Colin Wilson"
categories = [""]
date = "2019-12-28T17:11:22+01:00"
description = "Deploy a Kubernetes Cluster on Hetzner Cloud"
draft = true
publishdate = "2019-12-28T17:11:22+01:00"
tags = ["Terraform", "Terraform Cloud", "Hetzner", "Kubernetes", "Rancher", "HCloud", "Git","K8s", "Tutorial", "IaC"]
title = "Deploy a Kubernetes Cluster on Hetzner Cloud using Terraform"

[twitter]
  card = "summary"
  site = "@ColinWilson_"
  title = "Deploy a Kubernetes Cluster on Hetzner Cloud"
  description = "Deploy a Kubernetes Cluster on Hetzner Cloud"
  image = "https://colinwilson.uk/img/k8s_hetzner/terraform_hcloud_manifest_illustration.png"

+++

<p class="tc"><img src="/img/k8s_hetzner/terraform_hcloud_manifest_illustration_h500px.png"></p>

## Introduction

Using managed Kubernetes services such as GCP and EKS for small projects and development can be an expensive option. Hetzner (Europe) offers a cost effective solution with Hetzner Cloud.
This tutorial covers setting up a low cost Kubernetes cluster on Hetzner Cloud with LoadBalancer, Persistent Volumes & Private Network objects.

## Prerequisites

* Hetzner Cloud Account (Hetzner Cloud API Token)
* Knowledge of Kubernetes
* Linux Knowledge
* Command Line tools installed