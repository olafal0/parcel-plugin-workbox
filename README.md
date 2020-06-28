# Parcel Plugin Workbox 3

[![issues](https://img.shields.io/github/issues/olafal0/parcel-plugin-workbox)](https://github.com/olafal0/core/issues)
[![last commit](https://img.shields.io/github/last-commit/olafal0/parcel-plugin-workbox)](https://github.com/olafal0/core/commits/master)

Fork of [parcel-plugin-workbox](https://github.com/dahnielson/parcel-plugin-workbox) by Anders Dahnielson, with refactor from [Cloud-CNC's fork](https://github.com/Cloud-CNC/parcel-plugin-workbox)

## Install

```bash
npm i parcel-plugin-workbox -D
```

## Usage

When you build with Parcel, this plugin will automatically run `generateSWString`. You can customize the settings by adding a `workbox` section to your `package.json`. The full configuration options can be found [here](https://developers.google.com/web/tools/workbox/modules/workbox-build#generateswstring_mode).

This plugin will also automatically inject code for registering the service worker into `index.html` (currently hardcoded). For a working service worker that provides basic caching of Parcel dist files, you need only install this plugin—everything else will be automatic. Even `workbox` options in `package.json` are not necessary if the defaults work for you.

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

---

**_Note: importing `package.json` is generally considered insecure_**

## FAQ

- Whats different between this and the original?
  - Still maintained
  - Fixed uglify JS
    - [Fixes parcel-plugin-workbox #19](https://github.com/dahnielson/parcel-plugin-workbox/issues/19)
  - Improved configuration support
    - Pass any configuration option you would normally pass to `generateSWString`
  - Local workbox copy
  - Reduced logging
  - Automatic injection of registration code
  - Removed the read-pkg-up/read-pkg/find-up/parse-json etc dependency chain that was responsible for 38 of the 94 dependencies despite being wholly replaceable by the single line of code `JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8'))`
