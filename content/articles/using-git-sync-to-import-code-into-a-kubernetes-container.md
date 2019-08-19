+++
author = "Colin Wilson"
categories = [""]
date = "2019-08-19T00:03:22+01:00"
description = "Git Clone a repository into a Kubernetes Container / Volume"
draft = true
publishdate = "2019-08-19T00:03:22+01:00"
tags = ["Git","Docker","Kubernetes","Kubectl", "Sidecar", "SSH", "git-sync", "Code","Codebase","K8s", "Tutorial"]
title = "Using Git-sync to Import Code into a Kubernetes Container / Volume"

[twitter]
  card = "summary"
  site = "@colinwiIson"
  title = "Using Git-sync to Import Code into a Kubernetes Container / Volume"
  description = "Using Git-sync to Import Code into a Kubernetes Container / Volume"
  image = "https://colinwilson.uk/img/git-sync-k8s/git-sync-k8s-illustration.png"

+++

<p class="tc"><img src="/img/git-sync-k8s/git-sync-k8s-illustration.svg"></p>

## Introduction

Cloning your code (git repository) into a container is a common task for most Kubernetes deployments. Kubernetes does feature a (now depreciated) [gitRepo volume plugin ](https://kubernetes.io/docs/concepts/storage/volumes/#gitrepo), however [git-sync](https://github.com/kubernetes/git-sync) offers a more flexible and secure alternative to this.

## What is git-sync?

<p class="tc"><img height="200px" src="/img/git-sync-k8s/k8s-sidecar-illustration_opt.svg"></p>

Git-sync is essentially a command ran inside a sidecar container that pulls files from a git repository into a kubernetes volume. It can pull one-time or at regular intervals. It can also make webhook calls upon successfull repo pulls.

### Feature summary

* **Pull one-time or upon repo update**
* **Supports SSH, HTTP and Cookiefiles**
* **Pull from branch HEAD, git tag, or specific git hash**
* **Supports shallow cloning**
* **Supports webhook calls**

There are many additional parameters supported by the git-sync command. See the table below.

## Using git-sync

Git-sync (as a sidecar container) can be utilised and configured in various ways.

## Scenario 1 - Importing a private git repository (via SSH) using a sidecar init container

<p class="tc"><img style="max-width:none;width:800px" src="/img/git-sync-k8s/git-sync-k8s-init-container-illustration_v1.1-flat_opt.svg"></p>

In this scenario git-sync is run via an [init container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/) to clone a **private** git repository into a Kubernetes persistant volume, which can then be mounted by an application container (e.g. Nginx, Apache).

### Step 1 - Generate or use an existing SSH key pair.

Generate a new ED25519 SSH key pair:

    ssh-keygen -t ed25519 -C "email@example.com"

or an RSA key pair:

    ssh-keygen -o -t rsa -b 4096 -C "email@example.com"

### Step 2 - Copy the public SSH key to the clipboard

Copy the public SSH key to the clipboard by using one of the commands below depending on your Operating System:

**macOS**

    pbcopy < ~/.ssh/id_ed25519.pub

**Linux (requires `xclip` be installed)**

    xclip -sel clip < ~/.ssh/id_ed25519.pub

**Windows**

    cat ~/.ssh/id_ed25519.pub | clip

You can also open the key in a graphical editor (e.g. Notepad++, Nano, vi) and copy it from there, but be careful not to accidentally alter anything since this can corrupt/invalidate the key.

### Step 3 - Add the **public** key to your Git account

Instructions for various online Git repositorys:

* [GitHub](https://help.github.com/en/articles/adding-a-new-ssh-key-to-your-github-account)
* [GitLab](https://docs.gitlab.com/ee/ssh/README.html#adding-an-ssh-key-to-your-gitlab-account)
* [BitBucket](https://confluence.atlassian.com/bitbucket/set-up-an-ssh-key-728138079.html#SetupanSSHkey-#installpublickeyStep3.AddthepublickeytoyourBitbucketsettings)

