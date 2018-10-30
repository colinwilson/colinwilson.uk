---
title: "Creating Custom Login Forms for KEMP's Edge Security Pack (ESP)"
description: "How to create custom authentication/login forms for KEMP's Edge Security Pack (ESP)"
author: "Colin Wilson"
date: 2018-10-30T12:21:45Z
publishdate: = 2018-10-30T12:21:45Z
draft: false
categories: [""]
tags: ["KEMP Technologies","KEMP","ESP","Security","HTML5","Load Balancing","Exchange Server","OWA","Exchange 2016"]

twitter:
  card: "summary"
  site: "@colinwiIson"
  title: "Create Custom Login Forms for KEMP's ESP"
  description: "How to create custom authentication/login forms for KEMP's Edge Security Pack (ESP)"
  image: "https://colinwilson.uk/img/kemp-custom-auth-form-mockup-desktop-ds_opt.png"
---

<p class="tc"><img src="/img/kemp-custom-auth-form-mockup-desktop-ds_opt.png"></p>

KEMP's Edge Security Pack ([ESP](https://support.kemptechnologies.com/hc/en-us/articles/203125029-Edge-Security-Pack-ESP-)) useful for publishing services like Exchange Client Access Servers features '**Forms Based**' authentication. When enabled this option presents the client with a form to enter their credentials for authentication. The default form(s) are customisable, allowing you to create your own custom/corporate branded authentication forms.

## Default Forms

There are 7 default forms available:

+ Blank
+ Dual Factor Authentication
+ Exchange
+ Français Canadien - Blank
+ Français Canadien - Exchange
+ Português do Brasil - Blank
+ Português do Brasil - Exchange

![Default Blank Form](/img/blank-kemp-login-screen_opt.png)
<span class="f7 b">Default Blank Authentication Form</span><span class="f7 black-40"> | KEMP LoadMaster ESP</span>

## Basic Customisation

The default forms consist of basic HTML. It's possible to customise the section immediately above the radio buttons via the ESP **SSO Greeting Message** option. This option accepts either plain text or HTML (with the exception of accents (`) or single quotes ('')).

### Instructions

1. From the main menu, select **Virtual Services** and **View/Modify Services**.

2. Click **Modify** on the relevant Virtual Service.

3. Expand the **ESP Options** section.

    ![Default Blank Form](/img/kemp-sso-greeting-setting_opt.png)
    <span class="f7 b">SSO Greeting Message in Virtual Server ESP Options</span><span class="f7 black-40"> | KEMP LoadMaster ESP</span>

4. Ensure that ESP is enabled.

5. Ensure that the Client Authentication mode is set to Form Based.

6. Enter the text that you would like to appear on the form within the **SSO Greeting Message** text box.

7. Click the Set SSO Greeting Message button.

### Example SSO Greeting Message Settings & Screenshots

<table class="collapse ba br2 b--black-10 pv2 ph3 mw8">
    <thead>
      <tr class="striped--light-gray" style="vertical-align: top">
        <th></th>
        <th class="pv2 ph3 tc f6 fw6 ttu">Plain Text</th>
        <th class="pv2 ph3 tc f6 fw6 ttu">HTML</th>
      </tr>
    </thead>
    <tbody>
    <tr class="bb b--black-10" style="vertical-align: top">
      <td class="br b--black-10 pv2 ph3 b w-20">SSO Greeting Message Setting</td>
      <td class="br b--black-10 pv2 ph3 wrap-gist"><code data-gist-id="0ff52ac94f689f33ae306904a96410c7" data-gist-hide-footer="true" data-gist-hide-line-numbers="true"></code></td>
      <td class="pv2 ph3 wrap-gist"><code data-gist-id="98748bd86792e615f35a016ca9642c95" data-gist-hide-footer="true" data-gist-hide-line-numbers="true"></code></td>
    </tr>
    <tr style="vertical-align: top">
      <td class="br b--black-10 pv2 ph3 b w-20">Screenshot</td>
      <td class="br b--black-10 pv2 ph3"><img src="/img/blank-with-plain-text-sso-greeting-kemp-login-screen_opt.png"></td>
      <td class="pv2 ph3"><img src="/img/blank-with-html-sso-greeting-kemp-login-screen_opt.png"></td>
    </tr>
  </tbody>
</table>
<span class="f7 b">SSO Greeting Message Settings</span><span class="f7 black-40"> | KEMP LoadMaster ESP</span>

## Basic Image Set Structure & Customisation

KEMPs SSO Image Set customisation option allows you to create and upload your own customised basic login forms by amending a few image files.

![Basic Custom SSO Image Set](/img/kemp-sso-image-set-basic_opt.png)<br>
<span class="f7 b">Basic Custom SSO Image Set</span><span class="f7 black-40"> | with customised header and footer image files</span>

### Image Set Structure

First download the required Image Set templates. You can download these from [here](https://kemptechnologies.com/files/packages/current/SSOImageSet.zip).

The image set contains a .tar file structured as follows:

<code data-gist-id="06fa8c5048fc5729b197249f59a56063" data-gist-hide-footer="true" data-gist-hide-line-numbers="true"></code>

The easiest route to creating a custom image set is to make a duplicate of the existing **`<IMAGESETNAME>`** directory, rename it appropriately (e.g. 'Colin Wilson v1.0') and then amend the necessary files.

Each custom image set requires a minimum of 3 files to function:

+ MANIFEST
+ lm_initial.html
+ lm_logout.html

The **MANIFEST** file contains a list of all the files in the image set to be loaded when the form is requested by a client:

<code data-gist-id="c086692a677a1dfc12ccbb095f511405" data-gist-hide-footer="true"></code>

Any files present inside your image set sub directory not listed in the MANIFEST file will not be loaded when the form is requested.

**IMPORTANT: The last line of the `MANIFEST` file must be a new/blank line for the image set to function properly**

There is also an additional (but not mandatory) file named **`INFO`** which allows you to insert a description of your image set that will be displayed in the KEMP Load Balancer admin WUI once uploaded. This is useful for including author and version information with your image set.

### Basic Customisation

For a basic custom image set we need only update a couple of files.

+ **`espblank.gif`** - The forms header image
+ **`espbottom.gif`** The forms footer image

That's it! Once you're happy with your updates, save them to your named `imageset` subdirectory (if you've renamed the default files, remember to list them in the `MANIFEST`).

Your final image set structure should resemble the following:

<code data-gist-id="114cba8ab233a7607c58bd0f391c4ac0" data-gist-hide-footer="true" data-gist-hide-line-numbers="true"></code>

Using a compression application (e.g.7-Zip), tar the parent **`imagesets`** directory (NOT your custom image set subdirectory) to create the **`imagesets.tar`** file for uploading.

<code data-gist-id="494e154ab0ab99fef639f89a2483439c" data-gist-hide-footer="true" data-gist-hide-line-numbers="true"></code>

## Uploading your Image Set to the KEMP Load Balancer

To upload your custom SSO image set to the LoadMaster, follow the steps below in the LoadMaster WUI:

1. In the main menu, select Virtual Services and Manage SSO.

2. Click Choose File.

    ![Choose Custom SSO Image Set](/img/kemp-choose-sso-image-set_opt.png)<br>
    <span class="f7 b">Choose Custom SSO Image Set</span><span class="f7 black-40"> | KEMP LoadMaster ESP</span>

3. Browse to and select the .tar file.

4. Click Add Custom Image Set.

After adding the file, the supplied image set(s) is/are listed on this page.

![Uploaded Custom SSO Image Sets](/img/kemp-uploaded-sso-image-set_opt.png)<br>
<span class="f7 b">Uploaded Custom SSO Image Sets</span><span class="f7 black-40"> | My Image Set names are 'Blank - Custom' and 'Colin Wilson v1.0'</span>

They'll also be available to select in the SSO Image Set drop-down list in the ESP Options section of the Virtual Service modify screen.

![Select Custom SSO Image Set](/img/kemp-choose2-sso-image-set_opt.png)<br>
<span class="f7 b">Select Custom SSO Image Set</span><span class="f7 black-40"> | Choose your custom image set</span>

## Advanced Image Set Customisation

It's also possible make more extensive modifications to create a highly customised image set.

Providing you retain key sections of HTML code in the **`lm_initial.html`** file and ensure the **`lm_sso.js`** file is included in the image set, you can update/change almost everything else to your liking.

Using bootstrap, custom `CSS` and my own images, I modified the **`lm_initial.html`** & **`lm_logout.html`** files to create a responsive, clean, mobile ready, custom image set for use with accessing Microsoft Outlook Web App on Exchange 2016.

<table class="collapse ba br2 b--black-10 pv2 ph3 mw8">
    <thead>
      <tr class="striped--light-gray" style="vertical-align: top">
        <th class="pv2 ph3 tc f6 fw6 ttu">Desktop</th>
        <th class="pv2 ph3 tc f6 fw6 ttu">Mobile</th>
      </tr>
    </thead>
    <tbody>
    <tr class="bb b--black-10" style="vertical-align: top">
    <td class="br b--black-10 pv2 ph3">
<img src="/img/colin-wilson-sso-custom-login_opt.png" height="auto" width="550px">
</td>
<td class="pv2 ph3">
 <img src="/img/colin-wilson-sso-custom-login-mobile_opt.png" height="auto" width="260px">
 </td>
 </tr>
 </tbody>
 </table>
<span>
<span class="f7 b">Demo Custom SSO Image Sets</span><span class="f7 black-40"> | my responsive Image Set - 'Colin Wilson v1.0' for publishing OWA</span>

A few key guidelines when creating an *'advanced'*  image set:

+ You have two options when including links. You can include links to external assets (e.g. a CDN) or sites as normal. Alternatively you can include links to assets contained inside your image set. If doing so you'll need to include the load balancers `'lm_auth_proxy'` script URL in the hyper-link. e.g.

    '**`/lm_auth_proxy?LMimage=`**`custom-image.png`'

    For example. A stylesheet link to **`bootstrap.min.css`** located inside your image set subdirectory would be placed in the **`<head>`** section of the **`lm_initital.html`** file. It  would look like this:

    `<link href="`**`/lm_auth_proxy?LMimage`**`=bootstrap.min.css" type="text/css" rel="stylesheet">`

+ Retain the error script section in **`lm_initial.html`**. You may customise the error messages contained within to suit your needs:

    <code data-gist-id="ae680f937b6f8ef33833a19027627c69" data-gist-line="28-33" data-gist-hide-footer="true"></code>

+ You must include KEMP's JavaScript file **`lm_sso.js`** so the form can function:

    <code data-gist-id="ae680f937b6f8ef33833a19027627c69" data-gist-line="34" data-gist-hide-footer="true"></code>

+ Also include the `<noscript>` tag section to warn users that JavaScript is required in order for the form to work:

    <code data-gist-id="ae680f937b6f8ef33833a19027627c69" data-gist-line="37-46" data-gist-hide-footer="true"></code>

+ Don't alter anything in the opening **`<form>`** tag (such as **`action`, `method`, `id`** or **`onSubmit`**). The LoadMaster will not be able to process client login requests otherwise:

    <code data-gist-id="ae680f937b6f8ef33833a19027627c69" data-gist-line="47" data-gist-hide-footer="true"></code>

+ There are numerous **`id`** attributes dotted throughout the **`lm_initial.html`** file. It's best not to remove any of these. Doing so will result in a failure of a corresponding action (e.g removing **`id="password"`** will prevent the password input field being successfully submitted and an authentication failure).

Everything else inside the image set is open to customisation. The only limit is that of your imagination (and skill).

Here's a link to the repo of the demo image sets I made - \[WIP\] (feel free to fork / download / make pull requests / open issues):

<a href="https://github.com/colinwilson/kemp-esp-custom-forms" target="_blank"><img class="v-mid" src="/img/github-logo_.svg" height="30px"> &nbsp;https://github.com/colinwilson/kemp-esp-custom-forms</a>

### References

[KEMP Edge Security Pack Documentations](https://support.kemptechnologies.com/hc/en-us/articles/203125029-Edge-Security-Pack-ESP-)

[KEMP Custom Authentication Form Documentation](https://support.kemptechnologies.com/hc/en-us/articles/203126599-Custom-Authentication-Form)

[KEMP Custom Image Set Download](https://support.kemptechnologies.com/hc/en-us/articles/202220783-Custom-Image-Set)

[Custom Login Forms with KEMP](https://vknit.nl/en/2017/11/custom-login-forms-with-kemp/)