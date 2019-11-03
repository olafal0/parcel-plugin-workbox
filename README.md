# Parcel Plugin Workbox 3

Fork of [parcel-plugin-workbox](https://github.com/dahnielson/parcel-plugin-workbox) by Anders Dahnielson.

## Install
```bash
npm i parcel-plugin-workbox3 -D
```

## Usage
When you build with Parcel, this plugin will automatically run `generateSWString`
You can customize the settings by adding a `workbox` section to your `package.json`.
The full configuration options can be found [here](https://developers.google.com/web/tools/workbox/modules/workbox-build#generateswstring_mode).
```JavaScript
"workbox": {
  "importScripts": [
    "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js",
    "./worker.js"
  ],
  "globDirectory": "./dist",
  "globPatterns": [
    "**/*.{css,html,gif,js,jpg,png,svg,webp}"
  ]
}
```
*Note: you must include a workbox source, either a local copy or from a cdn. At least two scripts must be specified (Workbox itself + your service worker).*

## FAQ
* Whats different between this and the original?
  * Fixed uglify JS
    * [Fixes parcel-plugin-workbox #19](https://github.com/dahnielson/parcel-plugin-workbox/issues/19)
  * Improved configuration support
    * Pass any configuration option you would normally pass to `generateSWString`
    * Choose workbox source (CDN or Local copy)
  * Reduced logging
* Why not `parcel-plugin-workbox2`?
  * The name was already already taken on [NPM](https://npmjs.com/package/parcel-plugin-workbox2)