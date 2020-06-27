# Parcel Plugin Workbox 3

[![issues](https://img.shields.io/github/issues/olafal0/parcel-plugin-workbox3)](https://github.com/olafal0/core/issues)
[![last commit](https://img.shields.io/github/last-commit/olafal0/parcel-plugin-workbox3)](https://github.com/olafal0/core/commits/master)

Fork of [parcel-plugin-workbox](https://github.com/dahnielson/parcel-plugin-workbox) by Anders Dahnielson, with refactor from [Cloud-CNC's fork](https://github.com/Cloud-CNC/parcel-plugin-workbox3)

## Install

```bash
npm i parcel-plugin-workbox3 -D
```

## Usage

When you build with Parcel, this plugin will automatically run `generateSWString`. You can customize the settings by adding a `workbox` section to your `package.json`. The full configuration options can be found [here](https://developers.google.com/web/tools/workbox/modules/workbox-build#generateswstring_mode). Unfortunately, parcel will not resolve files when you use `navigator.serviceWorker.register`, so you must add your service worker to your parcel build target (In addition to your `index` file).

## Example

_`package.json`_

```JavaScript
{
  "workbox": {
    "importScripts": [
      "./worker.js"
    ],
  }
}
```

**_Note: you must include at least one script in the `importScripts` property._**

---

_`index.js`_

```JavaScript
const pkg = require('package.json');
navigator.serviceWorker.register(`./${pkg.workbox.swDest}`);
```

**_Note: importing `package.json` is generally considered insecure_**

## FAQ

- Whats different between this and the original?
  - ~~Still maintained~~
  - Fixed uglify JS
    - [Fixes parcel-plugin-workbox #19](https://github.com/dahnielson/parcel-plugin-workbox/issues/19)
  - Improved configuration support
    - Pass any configuration option you would normally pass to `generateSWString`
  - Local workbox copy
  - Reduced logging
