importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');

self.__WB_MANIFEST;

if(workbox) {
    console.log('workbox');
} else {
    console.log('no workbox');
}

workbox.precaching.precacheAndRoute([]);
