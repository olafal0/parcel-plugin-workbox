/**
 * @fileoverview This will be injected into the entry file
 * This file is read, not imported
 */

if ('serviceWorker' in navigator)
{
  window.addEventListener('load', function ()
  {
    navigator.serviceWorker.register('/sw.js');
  });
}