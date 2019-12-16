/**
 * @fileoverview Main plugin file
 * @author Anders Dahnielson (Original)
 * @author Wakeful Cloud (Refractor)
 */

//Modules
const fs = require('fs');
const parent = require('parent-module');
const path = require('path');
const pkg = require('read-pkg-up');
const uglify = require('uglify-es');
const workbox = require('workbox-build');

module.exports = bundle => 
{
  bundle.on('buildStart', () => 
  {
    //Get output directory
    const out = bundle.options.outDir;

    //Get parent module config
    const config = pkg.sync({cwd: path.dirname(parent())}).packageJson.workbox;

    //Glob directory
    if (config.globDirectory == null)
    {
      config.globDirectory = out;
    }

    //Overwrite import directory
    config.importScripts = config.importScripts.map(script => `./${path.basename(script)}`);

    //Set swDest relative output directory
    config.swDest = path.join(out, config.swDest);

    //Generate SW
    workbox.generateSW(config).then(() =>
    {
      //Minify
      if (process.env.NODE_ENV == 'production')
      {
        const minfied = uglify.minify(fs.readFileSync(config.swDest, 'utf8')).code;
        fs.writeFileSync(config.swDest, minfied);
      }
      console.log('√  Built service worker!');
    });
  });
};