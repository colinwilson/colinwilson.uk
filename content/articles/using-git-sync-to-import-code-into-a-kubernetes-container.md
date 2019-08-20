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

    > ssh-keygen -t ed25519 -C "email@example.com"

or an RSA key pair:

    > ssh-keygen -o -t rsa -b 4096 -C "email@example.com"

### Step 2 - Copy the public SSH key to the clipboard

Copy the public SSH key to the clipboard by using one of the commands below depending on your Operating System:

**macOS**

    > pbcopy < ~/.ssh/id_ed25519.pub

**Linux (requires `xclip` be installed)**

    > xclip -sel clip < ~/.ssh/id_ed25519.pub

**Windows**

    > cat ~/.ssh/id_ed25519.pub | clip

You can also open the key in a graphical editor (e.g. Notepad++, Nano, vi) and copy it from there, but be careful not to accidentally alter anything since this can corrupt/invalidate the key.

### Step 3 - Add the **public** key to your Git account

Instructions for various online Git repositorys:

* [GitHub](https://help.github.com/en/articles/adding-a-new-ssh-key-to-your-github-account)
* [GitLab](https://docs.gitlab.com/ee/ssh/README.html#adding-an-ssh-key-to-your-gitlab-account)
* [BitBucket](https://confluence.atlassian.com/bitbucket/set-up-an-ssh-key-728138079.html#SetupanSSHkey-#installpublickeyStep3.AddthepublickeytoyourBitbucketsettings)

### Step 4 - Test your SSH key is setup correctly

You can run the following command to test your connection to GitHub/GitLab. The `-i` option selects a specific private key in the case of more than one key being available to choose from:

    > ssh -T git@github.com -i ~/.ssh/id_ed25519
      Hi colinwilson! You've successfully authenticated,
      but GitHub does not provide shell access.

### Step 5 - Create a secret in Kubernetes to store your SSH key

Using the `kubectl` cli tool create a secret to store your SSH key and `known_hosts` information.

First use the `ssh-keyscan` cmd to retrieve the `known_hosts` and store them in a file named `known_hosts`:

    > ssh-keyscan github.com > /tmp/known_hosts
      # github.com:22 SSH-2.0-babeld-216c4091
      # github.com:22 SSH-2.0-babeld-216c4091
      # github.com:22 SSH-2.0-babeld-216c4091

We can now use `kubectl` to create a secret to store your private SSH key:

    kubectl create secret generic git-creds \
    --from-file=ssh=$HOME/.ssh/id_ed25519 \
    --from-file=known_hosts=/tmp/known_hosts

### Step 6 - Configure git-sync init container with sample app (nginx)

Create a configMap with the necessary git-sync options:

**git-sync-configMap.yaml**
```
apiVersion: v1
kind: ConfigMap
metadata:
  labels:
	name: git-sync-config
  name: git-sync-config
data:
  GIT_SYNC_REPO: "git@github.com:colinwilson/test.git" # repository to clone
  GIT_SYNC_BRANCH: "master" # checkout the master branch
  GIT_SYNC_DEPTH: "1" # use a shallow clone
  GIT_SYNC_ROOT: "/usr/share/nginx" # the root directory for git operations
  GIT_SYNC_DEST: "html" # the name at which to publish the checked-out files under
  GIT_SYNC_ONE_TIME: "true" # exit after the initial checkout
  GIT_SYNC_MAX_SYNC_FAILURES: "-1" # number of consecutive failures allowed before aborting
  GIT_SYNC_SSH: "true" # use SSH for git operations
```
<button id="btn" style="cursor: pointer">show additional git-sync options</button>

<div id="wizard" style="display:none;">
<table class="tg">
  <tr>
    <th class="tg-0lax">Opions</th>
    <th class="tg-0lax">Default</th>
    <th class="tg-0lax">Description</th>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_SYNC_REPO</td>
    <td class="tg-buh4">none</td>
    <td class="tg-buh4">The git repository to clone</td>
  </tr>
  <tr>
    <td class="tg-0lax">GIT_SYNC_BRANCH</td>
    <td class="tg-0lax">master</td>
    <td class="tg-0lax">The git branch to check out</td>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_SYNC_REV</td>
    <td class="tg-buh4">HEAD</td>
    <td class="tg-buh4">The git revision (tag or hash) to check out</td>
  </tr>
  <tr>
    <td class="tg-0lax">GIT_SYNC_DEPTH</td>
    <td class="tg-0lax">0</td>
    <td class="tg-0lax">Use a shallow clone with a history truncated to the specified number of commits</td>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_SYNC_ROOT</td>
    <td class="tg-buh4"></td>
    <td class="tg-buh4">the root directory for git operations<br></td>
  </tr>
  <tr>
    <td class="tg-0lax">GIT_SYNC_DEST</td>
    <td class="tg-0lax">none</td>
    <td class="tg-0lax">the name at which to publish the checked-out files under --root (defaults to leaf dir of --repo)</td>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_SYNC_WAIT</td>
    <td class="tg-buh4">0</td>
    <td class="tg-buh4">the number of seconds between syncs</td>
  </tr>
  <tr>
    <td class="tg-0lax">GIT_SYNC_TIMEOUT</td>
    <td class="tg-0lax">120</td>
    <td class="tg-0lax">the max number of seconds for a complete sync</td>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_SYNC_ONE_TIME</td>
    <td class="tg-buh4">false</td>
    <td class="tg-buh4">exit after the initial checkout</td>
  </tr>
  <tr>
    <td class="tg-0lax">GIT_SYNC_MAX_SYNC_FAILURES</td>
    <td class="tg-0lax">0</td>
    <td class="tg-0lax">the number of consecutive failures allowed before aborting (the first pull must succeed, -1 disables aborting for any number of failures after the initial sync)</td>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_SYNC_PERMISSIONS</td>
    <td class="tg-buh4">0</td>
    <td class="tg-buh4">the file permissions to apply to the checked-out files</td>
  </tr>
  <tr>
    <td class="tg-0lax">GIT_SYNC_WEBHOOK_URL</td>
    <td class="tg-0lax">none</td>
    <td class="tg-0lax">the URL for the webook to send to. Default is "\" which disables the webook</td>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_SYNC_WEBHOOK_METHOD</td>
    <td class="tg-buh4">POST</td>
    <td class="tg-buh4">the method for the webook to send with</td>
  </tr>
  <tr>
    <td class="tg-0lax">GIT_SYNC_WEBHOOK_SUCCESS_STATUS</td>
    <td class="tg-0lax">200</td>
    <td class="tg-0lax">the status code which indicates a successful webhook call. A value of -1 disables success checks to make webhooks fire-and-forget</td>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_SYNC_WEBHOOK_TIMEOUT</td>
    <td class="tg-buh4"></td>
    <td class="tg-buh4">the timeout used when communicating with the webhook target</td>
  </tr>
  <tr>
    <td class="tg-0lax">GIT_SYNC_WEBHOOK_BACKOFF</td>
    <td class="tg-0lax"></td>
    <td class="tg-0lax">if a webhook call fails (dependant on webhook-success-status) this defines how much time to wait before retrying the call</td>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_SYNC_USERNAME</td>
    <td class="tg-buh4"></td>
    <td class="tg-buh4">the username to use</td>
  </tr>
  <tr>
    <td class="tg-0lax">GIT_SYNC_PASSWORD</td>
    <td class="tg-0lax"></td>
    <td class="tg-0lax">the password to use</td>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_SYNC_SSH</td>
    <td class="tg-buh4">false</td>
    <td class="tg-buh4">use SSH for git operations</td>
  </tr>
  <tr>
    <td class="tg-0lax">GIT_SSH_KEY_FILE</td>
    <td class="tg-0lax">/etc/git-secret/ssh</td>
    <td class="tg-0lax">the ssh key to use</td>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_KNOWN_HOSTS</td>
    <td class="tg-buh4">true</td>
    <td class="tg-buh4">enable SSH known_hosts verification</td>
  </tr>
  <tr>
    <td class="tg-0lax">GIT_SSH_KNOWN_HOSTS_FILE</td>
    <td class="tg-0lax">/etc/git-secret/known_hosts</td>
    <td class="tg-0lax">the known hosts file to use</td>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_COOKIE_FILE</td>
    <td class="tg-buh4">false</td>
    <td class="tg-buh4">use git cookiefile</td>
  </tr>
  <tr>
    <td class="tg-0lax">GIT_SYNC_GIT</td>
    <td class="tg-0lax">git</td>
    <td class="tg-0lax">the git command to run (subject to PATH search)</td>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_SYNC_HTTP_BIND</td>
    <td class="tg-buh4"></td>
    <td class="tg-buh4">the bind address (including port) for git-sync's HTTP endpoint</td>
  </tr>
  <tr>
    <td class="tg-0lax">GIT_SYNC_HTTP_METRICS</td>
    <td class="tg-0lax">true</td>
    <td class="tg-0lax">enable metrics on git-sync's HTTP endpoint</td>
  </tr>
  <tr>
    <td class="tg-buh4">GIT_SYNC_HTTP_PPROF</td>
    <td class="tg-buh4">false</td>
    <td class="tg-buh4">enable the pprof debug endpoints on git-sync's HTTP endpoint</td>
  </tr>
</table>
</div>

**git-sync-demo.yaml**
```
apiVersion: apps/v1beta2
kind: Deployment
metadata:
  labels:
    app: git-sync-demo
  name: git-sync-demo
  namespace: default
spec:
  replicas: 2
  selector:
    matchLabels:
      app: git-sync-demo
  template:
    metadata:
      labels:
        app: git-sync-demo
    spec:
      containers:
      - name: nginx
        image: nginx:1.17.3-alpine
        ports:
        - containerPort: 80
        volumeMounts:
        - name: git-sync-volume
          mountPath: /usr/share/nginx
      initContainers:
      - name: git-sync
        image: k8s.gcr.io/git-sync:v3.1.2
        imagePullPolicy: Always
        envFrom:
          - configMapRef:
              name: git-sync-config
        volumeMounts:
        - name: git-sync-volume
          mountPath: /usr/share/nginx
        - name: git-secret
          mountPath: /etc/git-secret
        securityContext:
          runAsUser: 65533 # git-sync user
      volumes:
      - name: git-sync-volume
        emptyDir: {}
      - name: git-secret
        secret:
          secretName: git-creds
          defaultMode: 288 # = mode 0440
      securityContext:
        fsGroup: 65533 # to make SSH key readable
---
kind: Service
apiVersion: v1
metadata:
  name: git-sync-demo
spec:
  type: NodePort
  selector:
    app: git-sync-demo
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```


<script>
  $('#btn').click(function(e) {
    e.preventDefault();
    $('#wizard').toggle();
});
</script>