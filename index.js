/**
 * @fileoverview Main plugin file
 * @author Anders Dahnielson (Original)
 * @author Wakeful Cloud (Refractor)
 */

//Imports
const fs = require('fs');
const logger = require('@parcel/logger');
const path = require('path');
const uglifyJS = require('uglify-js');
const workbox = require('workbox-build');

module.exports = bundle => 
{
  bundle.on('buildEnd', async () => 
  {
    //Parse config
    const mainAsset = bundle.mainAsset || bundle.mainBundle.entryAsset || bundle.mainBundle.childBundles.values().next().value.entryAsset;
    const pkg = typeof mainAsset.getPackage === 'function' ? await mainAsset.getPackage() : mainAsset.package;
    const config = pkg.workbox;

    if (config.importScripts == null)
    {
      config.importScripts = ['./worker.js'];
    }

    if (config.globDirectory == null)
    {
      config.globDirectory = bundle.options.outDir;
    }

    if (config.globPatterns == null)
    {
      config.globPatterns = ['**\/*.{css,html,js,gif,ico,jpg,png,svg,webp,woff,woff2,ttf,otf}'];
    }

    const dest = path.resolve(bundle.options.outDir);

    //Add local workbox-sw
    config.importScripts.push('node_modules/workbox-sw/index.mjs');

    //Import scripts
    for (let i = 0; i < config.importScripts.length; i++) 
    {
      let dir = config.importScripts[i];
      fs.readFile(path.resolve(dir), (err, data) => 
      {
        if (err)
        {
          logger.error(err);
        }
        else
        {
          data = minify(data);
          dir = /[^\/]+$/.exec(dir)[0];
          fs.writeFileSync(path.resolve(dest, dir), data);
        }
      });
    }

    //Generate service worker
    workbox.generateSWString(config).then(swString => 
    {
      swString = swString.swString;
      swString = minify(swString);
      fs.writeFileSync(path.join(dest, 'sw.js'), swString);
    }).catch(err => 
    {
      logger.error(err);
    });

    //Get index for injection
    const entry = path.join(dest, 'index.html');

    //Inject service worker
    fs.readFile(entry, 'utf8', (err, data) => 
    {
      if (err) 
      {
        logger.error(err);
      }
      else
      {
        if (!data.includes('serviceWorker.register')) 
        {
          let template = minify(`
          if ('serviceWorker' in navigator)
          {
            window.addEventListener('load', function ()
            {
              navigator.serviceWorker.register('/sw.js');
            });
          }`);
          template = `<script>${template}</script></body>`;
          data = data.replace('</body>', template);
          fs.writeFileSync(entry, data);
          logger.success(`Service worker injected into ${dest}/index.html`);
        }
      }
    });
  });

  /**
   * Minify raw if specified by Parcel
   * @param {String} raw Unminified code
   * @returns {String} Minified code
   */
  function minify(raw)
  {
    return bundle.options.minify ? uglifyJS.minify(raw) : raw;
  }
};