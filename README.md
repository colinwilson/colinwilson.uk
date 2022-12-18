# 🌐 colinwilson.uk

[![Netlify Status](https://api.netlify.com/api/v1/badges/85de2299-dad7-4ebc-9fb6-d8e2b3a8878c/deploy-status)](https://app.netlify.com/sites/colinwilson/deploys)

Source code for my site at <https://colinwilson.uk>

![colinwilson.uk screenshot](https://res.cloudinary.com/qunux/image/upload/v1659461491/colinwilson.uk_screenshot_020822_qjadvs.webp)

Powered by [Hugo](https://gohugo.io/) and hosted by [Netlify](https://www.netlify.com/).

## 📝 Documentation
- [Getting started]()
- [Setup search with Algolia]()
- [Creating a prodution build]()
- [Updating the JS dependenies]()
## 🛠 Getting started

Before you start working with this theme, you need to have [Hugo](https://gohugo.io/) & [npm](https://nodejs.org/en/knowledge/getting-started/npm/what-is-npm/) installed. Then:
1. clone the repository using `git clone https://github.com/colinwilson/colinwilson.uk.git`
2. from the root of your cloned repository, 
    - run `npm install` to install the necessary JS pakages
    - start the Hugo server using `hugo server`


## 🔎 Setup search with Algolia
You need the following environment variables to be set. 
```
ALGOLIA_APP_ID
ALGOLIA_ADMIN_KEY
ALGOLIA_SEARCH_KEY
ALGOLIA_INDEX_NAME
ALGOLIA_INDEX_FILE
```

Values of `ALGOLIA_APP_ID`, `ALGOLIA_ADMIN_KEY`, `ALGOLIA_SEARCH_KEY` can be found from your Algolia account. Value of `ALGOLIA_INDEX_NAME` is **_yet to be filled_** & value of `ALGOLIA_INDEX_FILE` is **_yet to be filled_**

The paramters which are to be included in the search index can be configured in this section of `config.toml`:

```toml
[params.algolia]
vars = ["title", "summary", "date", "description", "publishdate", "permalink", "year"]
params = ["categories", "tags"]
```


## 🚀 Creating a prodution build
From the root of the repository run 

```
npm install && hugo && npm run algolia
```

The same command can be used to deploy using Netlify, Vercel or Cloudfare pages etc. For deployment using GitHub action you can take hints from [here](https://github.com/colinwilson/colinwilson.uk/blob/vercel/.github/workflows/deploy-production.yml).

## ⬆️ Updating the JS dependencies
To update the JS dependencies run **_yet to be filled_** from the root of the repository.

[![forthebadge](http://forthebadge.com/images/badges/cc-nc-sa.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
