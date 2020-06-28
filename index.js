/**
 * @fileoverview Main plugin file
 * @author Anders Dahnielson (Original)
 * @author Wakeful Cloud (Refractor)
 * @author olafal0
 */

//Modules
const fs = require('fs');
const path = require('path');
const uglify = require('uglify-es');
const workbox = require('workbox-build');

module.exports = (bundle) => {
  bundle.on('buildEnd', () => {
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

    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const pkgConfig = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    //Get parent module config
    const config = {
      ...defaultConfig,
      ...pkgConfig.workbox,
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
      if (process.env.NODE_ENV === 'production') {
        const minfied = uglify.minify(fs.readFileSync(config.swDest, 'utf8'))
          .code;
        fs.writeFileSync(config.swDest, minfied);
      }
      console.log(`✔️ Built service worker as ${config.swDest}`);
    });

    // Inject service worker into Parcel entrypoint
    // If this is not injected on buildEnd, Parcel will look for the service
    // worker file before it exists
    // TODO: remove hardcoded entry point, get directly from Parcel? Can use
    // bundle.entryAsset
    const entry = path.resolve(out, 'index.html');
    let data = fs.readFileSync(entry, 'utf8');
    if (!data.includes('serviceWorker.register')) {
      let swTag = `
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', function() {
            navigator.serviceWorker.register('sw.js');
          });
        }
      `;
      if (bundle.options.minify) {
        swTag = uglify.minify(swTag);
        swTag = `<script>${swTag.code}</script></body>`;
      } else {
        swTag = `
        <script>
        ${swTag}
        </script>
      </body>`;
      }
      data = data.replace('</body>', swTag);
      fs.writeFileSync(entry, data);
      console.log(
        `✔️ Service worker injected into ${config.swDest}/index.html`
      );
    }
  });
};
