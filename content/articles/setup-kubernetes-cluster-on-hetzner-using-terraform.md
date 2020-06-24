+++
author = "Colin Wilson"
categories = [""]
date = "2019-12-28T17:11:22+01:00"
description = "Setup a Kubernetes Cluster on Hetzner Cloud"
draft = true
publishdate = "2019-12-28T17:11:22+01:00"
tags = ["Git","Docker","Kubernetes","Kubectl", "Cloud", "Cluster", "Code","K8s", "Tutorial", "Iac", "Terraform"]
title = "Setup a Kubernetes Cluster on Hetzner Cloud using Terraform"

[twitter]
  card = "summary"
  site = "@ColinWilson_"
  title = "Setup a Kubernetes Cluster on Hetzner Cloud"
  description = "Setup a Kubernetes Cluster on Hetzner Cloud"
  image = "https://colinwilson.uk/img/k8s_hetzner/k8s_hetzner.png"

+++

<p class="tc"><img src="/img/k8s_hetzner/k8s_hetzner.png"></p>

## Introduction

Using managed kubernetes services such as GCP and EKS for small projects and development can be an expensive option. Hetzner (Europe) offers a cost effective solution with Hetzner Cloud.
This tutorial will cover setting up a low cost Kubernetes Cluster on Hetzner Cloud with LoadBalancer, Persistent Volumes & Private Network objects.

## Prerequisites

* Hetzner Cloud Account
* Knowledge of Kubernetes
* Linux Knowledge
* Command Line tools installed