---
title: "Creating Custom Login Forms for KEMP's ESP"
description: "How to create custom authentication/login forms for KEMP's Edge Security Pack (ESP)"
author: "Colin Wilson"
date: 2018-10-29T23:17:32Z
draft: true
categories: [""]
tags: ["KEMP Technologies","KEMP","Security","HTML5","Load Balancing","Exchange Server","OWA","Exchange 2016"]

twitter:
  card: "summary"
  site: "@colinwiIson"
  title: "Create Custom Login Forms for KEMP's ESP"
  description: "How to create custom authentication/login forms for KEMP's Edge Security Pack (ESP)"
  image: "https://colinwilson.uk/img/kemp-custom-auth-form-mockup-desktop-ds_opt.png"
---

<p class="tc"><img src="/img/kemp-custom-auth-form-mockup-desktop-ds_opt.png"></p>

KEMP's Edge Security Pack ([ESP](https://support.kemptechnologies.com/hc/en-us/articles/203125029-Edge-Security-Pack-ESP-)) features '**Forms Based**' authentication. When enabled this option presents the client with a form to enter their credentials for authentication. It's also possible to customise the default form(s) to create your own custom/corporate branded authentication forms.

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

The default forms offer basic customisation of the section immediately above the form input and radio buttons via the **SSO Greeting Message** option. This option accepts either plain text or html (with the exception of accents (`) or single quotes ('')).

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

Using the SSO Image Set customisation option you can create and upload your own customised basic login form by amending a few image files.

![Basic Custom SSO Image Set](/img/kemp-sso-image-set-basic_opt.png)<br>
<span class="f7 b">Basic Custom SSO Image Set</span><span class="f7 black-40"> | With customised header and footer image files</span>

### Image Set Structure

First download the required Image Set templates. You can download these from [here](https://kemptechnologies.com/files/packages/current/SSOImageSet.zip).

The image set contains a .tar file structured as follows:

<code data-gist-id="06fa8c5048fc5729b197249f59a56063" data-gist-hide-footer="true" data-gist-hide-line-numbers="true"></code>

The easiest route to creating a custom image set is to make a duplicate of the **`<IMAGESETNAME>`** directory, rename it to your desired image set name (e.g. 'Colin Wilson v1.0') and then amend the necessary files.

Each custom image set requires a minimum of 3 files to function:

+ MANIFEST
+ lm_initial.html
+ lm_logout.html

The **MANIFEST** file contains a list of all the files to be loaded in the image set:

<code data-gist-id="c086692a677a1dfc12ccbb095f511405" data-gist-hide-footer="true"></code>

Any files inside your image set sub directory not included in the MANIFEST file will not be loaded by the load balancer.

**IMPORTANT: The last line of the `MANIFEST` file must be a new/blank line for the image set to function properly**

There is also an additional (non-mandetory) file named **`INFO`** allows you to insert a description of your image set that will be displayed in the KEMP Load Balancer admin WUI once uploaded. You could included author and version information in this file.

### Basic Customisation

For a basic custom image set we need only update a couple of files.

+ **`espblank.gif`** - The forms header image
+ **`espbottom.gif`** The forms footer image

That's it! Once you're happy with your updates save them to your named imageset subdirectory (remember to list them in the `MANIFEST` file if you've renamed the defaults).

Your final image set structure should resemble the following:

<code data-gist-id="114cba8ab233a7607c58bd0f391c4ac0" data-gist-hide-footer="true" data-gist-hide-line-numbers="true"></code>

Using a compression application (e.g.7-Zip) tar the parent **`imagesets`** directory (NOT your image set subdirectory) to create the **`imagesets.tar`** file for uploading.

## Uploading your Image Set to KEMP Load Balancer

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

It's also possible to radically customise the default image set to create a more comprehensive login form that may better matche your requirements.

As long as you retain key secitons of HTML code in the **`lm_initial.html`** & **`lm_logout.html`** files along with the **`lm_sso.js`** file, you can update almost everything else to your liking.

My custom image set form demo utilises bootstrap and custom `CSS` in the **`lm_initial.html`** & **`lm_logout.html`** files to create a responsive, clean, mobile ready, custom authentication form.

![Uploaded Custom SSO Image Sets](/img/colin-wilson-sso-custom-login_opt.png)<br>
<span class="f7 b">Uploaded Custom SSO Image Sets</span><span class="f7 black-40"> | My Image Set names are 'Blank - Custom' and 'Colin Wilson v1.0'</span>