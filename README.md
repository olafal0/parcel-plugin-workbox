# Parcel Plugin Workbox 3
[![issues](https://img.shields.io/github/issues/Cloud-CNC/parcel-plugin-workbox3)](https://github.com/Cloud-CNC/core/issues)
[![last commit](https://img.shields.io/github/last-commit/Cloud-CNC/parcel-plugin-workbox3)](https://github.com/Cloud-CNC/core/commits/master)

## THIS PACKAGE IS DEPRECATED AND WILL BE DELETED!
Fork of [parcel-plugin-workbox](https://github.com/dahnielson/parcel-plugin-workbox) by Anders Dahnielson.

## Install
```bash
npm i parcel-plugin-workbox3 -D
```

## Usage
When you build with Parcel, this plugin will automatically run `generateSWString`. You can customize the settings by adding a `workbox` section to your `package.json`. The full configuration options can be found [here](https://developers.google.com/web/tools/workbox/modules/workbox-build#generateswstring_mode). Unfortunately, parcel will not resolve files when you use `navigator.serviceWorker.register`, so you must add your service worker to your parcel build target (In addition to your `index` file).

## Example
*`package.json`*
```JavaScript
{
  "workbox": {
    "importScripts": [
      "./worker.js"
    ],
  }
}
```
***Note: you must include at least one script in the `importScripts` property.***

---

*`index.js`*
```JavaScript
const pkg = require('package.json');
navigator.serviceWorker.register(`./${pkg.workbox.swDest}`);
```
***Note: importing `package.json` is generally considered insecure***

## FAQ
* Whats different between this and the original?
  * ~~Still maintained~~
  * Fixed uglify JS
    * [Fixes parcel-plugin-workbox #19](https://github.com/dahnielson/parcel-plugin-workbox/issues/19)
  * Improved configuration support
    * Pass any configuration option you would normally pass to `generateSWString`
  * Local workbox copy
  * Reduced logging
* Why not `parcel-plugin-workbox2`?
  * The name was already already taken on [NPM](https://npmjs.com/package/parcel-plugin-workbox2)
* Why is this deprecated?
  * The main reason why this was created was for [Cloud CNC](https://github.com/cloud-cnc) which as of February, 2020 is no longer using Parcel. I don't use Parcel on any other projects as of now so I decided to deprecate this package as I don't have time to maintain it.