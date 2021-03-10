importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if(workbox) {
    console.log('workbox');
} else {
    console.log('no workbox');
}

// Cache the Google Fonts stylesheets with a stale while revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  }),
);

// Cache the Google Fonts webfont files with a cache first strategy for 1 year.
workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.cacheFirst({
      cacheName: 'google-fonts',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 30,
        }),
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
      ],
    }),
  );

workbox.precaching.precacheAndRoute([
    {"revision":"d8eb7d0b8ea2d40a3ff01213a6c78ee1","url":"assets/audio/bgMusic.mp3"},
    {"revision":"c5738ed604b8411884c6dce7c82f74b0","url":"assets/audio/card-flip.mp3"},
    {"revision":"c03325cbee6aa9ecce96471370454d17","url":"assets/audio/card-match.wav"},
    {"revision":"5cd371c1d97b9f7725a01291079f53bf","url":"assets/audio/flip.wav"},
    {"revision":"f768a2ef67d85005f5b43d33eade7959","url":"assets/audio/gameOver.wav"},
    {"revision":"7ffc3cb00e265f332c1e6dfff41c580f","url":"assets/audio/match.wav"},
    {"revision":"817b3d8468667e4c37e97917323759e3","url":"assets/audio/no-card-match.wav"},
    {"revision":"fcab41c37ca3e209cdf7d2199d3518f5","url":"assets/audio/victory.wav"},
    {"revision":"d6abea4c2f4309990b5a9b6838075af1","url":"assets/css/style.css"},
    {"revision":"e8b8c4881d0242829413da86978d5515","url":"assets/data/cardData.json"},
    {"revision":"3f1217adbe8fa294a8053b4d50289ed3","url":"assets/data/gameData.json"},
    {"revision":"74cc4933a7adfa4639c30496aa649fe3","url":"assets/js/game.js"},
    {"revision":"12b69d0ae6c6f0c42942ae6da2896e84","url":"assets/js/jquery.min.js"},
    {"revision":"ed0266e1febbdd643f6622c932b8cf9d","url":"assets/js/js-fluid-meter.js"},
    {"revision":"8bf1a69c05f73a5a4036456ac8928883","url":"assets/js/sw/workbox-fa03aee3.js"},
    {"revision":"664397dc412fb031725ff121153d02b9","url":"assets/svg/angular.svg"},
    {"revision":"f09f45daff5b00602e80386cb6a73e5a","url":"assets/svg/aurelia.svg"},
    {"revision":"515e7b96eb6fdbc9824983d48d66fe7e","url":"assets/svg/Code_logo_grey_fit.svg"},
    {"revision":"d680b4570bd8511a42eef346d818e1e2","url":"assets/svg/js.svg"},
    {"revision":"b337a2fb0b1289e6757e632dc766ff6b","url":"assets/svg/nodejs.svg"},
    {"revision":"2c8cc4a64e1339f56547b5831a0d0504","url":"assets/svg/php.svg"},
    {"revision":"fbef321e03c16bcae42560f8507757d6","url":"assets/svg/python.svg"},
    {"revision":"1b7f7aac77d71ef59e4c9e8d2cb2067e","url":"assets/svg/react.svg"},
    {"revision":"3bf65ea46263aa887e954e2d55215ba5","url":"index.html"}
]);
