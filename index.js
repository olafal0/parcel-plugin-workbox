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
  bundle.on('buildStart', ax => 
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

    //Generate SW
    workbox.generateSWString(config).then(data =>
    {
      //Uglify
      const uglified = process.env.NODE_ENV == 'production' ? uglify.minify(data.swString).code : data.swString;

      //Write to file
      fs.writeFile(path.join(out, 'sw.js'), uglified, err =>
      {
        if (err)
        {
          throw err;
        }
        else
        {
          console.log('√  Built service worker!');
        }
      });
    });
  });
};