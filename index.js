/**
 * @fileoverview Main plugin file
 * @author Anders Dahnielson (Original)
 * @author Wakeful Cloud (Refractor)
 * @author olafal0
 */

//Modules
const fs = require('fs');
const parent = require('parent-module');
const path = require('path');
const pkg = require('read-pkg-up');
const uglify = require('uglify-es');
const workbox = require('workbox-build');

module.exports = (bundle) => {
  bundle.on('buildStart', () => {
    //Get output directory
    const out = bundle.options.outDir;

    const defaultConfig = {
      swDest: 'sw.js',
      // scripts to import into sw
      importScripts: [],
      // directory to include
      globDirectory: out,
      // file types to include
      globPatterns: [
        '**/*.{css,html,js,gif,ico,jpg,png,svg,webp,woff,woff2,ttf,otf}',
      ],
    };

    //Get parent module config
    const config = {
      ...defaultConfig,
      ...pkg.sync({ cwd: path.dirname(parent()) }).packageJson.workbox,
    };

    //Overwrite import directory
    config.importScripts = config.importScripts.map(
      (script) => `./${path.basename(script)}`
    );

    //Set swDest relative output directory
    config.swDest = path.join(out, config.swDest);

    //Generate SW
    workbox.generateSW(config).then(() => {
      //Minify
      if (process.env.NODE_ENV == 'production') {
        const minfied = uglify.minify(fs.readFileSync(config.swDest, 'utf8'))
          .code;
        fs.writeFileSync(config.swDest, minfied);
      }
      console.log('√  Built service worker!');
    });
  });
};
