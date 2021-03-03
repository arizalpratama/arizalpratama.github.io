importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox){
    console.log(`Workbox berhasil dimuat`);
    workbox.precaching.precacheAndRoute([
        { url: '/', revision: '3' },
        { url: '/index.html', revision: '3' },
        { url: '/manifest.json', revision: '3' },
        { url: './serviceWorker.js', revision: '3' },
        { url: './page/fav-team.html', revision: '3'},
        { url: './page/ranking.html', revision: '3'},
        { url: './page/match.html', revision: '3'},
        { url: './page/team.html', revision: '3'},
        { url: './assets/shell/nav-shell.html', revision: '3'},
        { url: './assets/css/materialize.css', revision: '3'},
        { url: './assets/css/style.css', revision: '3'},
        { url: './assets/images/background-nav.jpg', revision: '3'},
        { url: './assets/images/user/user.jpg', revision: '3'},
        { url: './assets/images/home/home1.jpg', revision: '3'},
        { url: './assets/images/home/home2.jpg', revision: '3'},
        { url: './assets/images/app/arrow-left-solid.svg', revision: '3'},
        { url: './assets/images/icons/icon-128x128.png', revision: '3'},
        { url: './assets/images/icons/icon-144x144.png', revision: '3'},
        { url: './assets/images/icons/icon-152x152.png', revision: '3'},
        { url: './assets/images/icons/icon-192x192.png', revision: '3'},
        { url: './assets/images/icons/icon-384x384.png', revision: '3'},
        { url: './assets/images/icons/icon-512x512.png', revision: '3'},
        { url: './assets/images/icons/icon-72x72.png', revision: '3'},
        { url: './assets/images/icons/icon-96x96.png', revision: '3'},
        { url: './assets/js/api.js', revision: '3'},
        { url: './assets/js/db.js', revision:  '3'},
        { url: './assets/js/functions.js', revision: '3'},
        { url: './assets/js/idb.js', revision: '3'},
        { url: './assets/js/init.js', revision: '3'},
        { url: './assets/js/materialize.js', revision: '3'},
        { url: './assets/js/script.js', revision: '3'},
        ]);
        
    workbox.routing.registerRoute(
        /.*(?:png|gif|jpg|jpeg|svg|ico)$/,
        workbox.strategies.cacheFirst({
            cacheName: 'images-cache',
            plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
            new workbox.expiration.Plugin({
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
            ]
        })
        );


    workbox.routing.registerRoute(
        new RegExp('https://api.football-data.org/'),
        workbox.strategies.staleWhileRevalidate()
        )

  // Caching Google Fonts
  workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
  })
    );

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

workbox.routing.registerRoute(
  new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'pages'
    })
);

}else{
  console.log(`Workbox gagal dimuat`);
}


// const CACHE_NAME = 'submission-2 v0.2'
// const urlToCache = [
//     '/',
//     './index.html',
//     './manifest.json',
//     './serviceWorker.js',
//     './page/fav-team.html',
//     './page/ranking.html',
//     './page/match.html',
//     './page/team.html',
//     './assets/shell/nav-shell.html',
//     './assets/css/materialize.css',
//     './assets/css/style.css',
//     './assets/images/background-nav.jpg',
//     './assets/images/user/user.jpg',
//     './assets/images/home/home1.jpg',
//     './assets/images/home/home2.jpg',
//     './assets/images/app/arrow-left-solid.svg',
//     './assets/images/icons/icon-128x128.png',
//     './assets/images/icons/icon-144x144.png',
//     './assets/images/icons/icon-152x152.png',
//     './assets/images/icons/icon-192x192.png',
//     './assets/images/icons/icon-384x384.png',
//     './assets/images/icons/icon-512x512.png',
//     './assets/images/icons/icon-72x72.png',
//     './assets/images/icons/icon-96x96.png',
//     './assets/js/api.js',
//     './assets/js/db.js',
//     './assets/js/functions.js',
//     './assets/js/idb.js',
//     './assets/js/init.js',
//     './assets/js/materialize.js',
//     './assets/js/script.js'
// ]
// const base_url = 'https://api.football-data.org/v2'
// const base_url2 = 'https://upload.wikimedia.org/wikipedia'

// Install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlToCache)
        })
    )
})

// Fetch
self.addEventListener('fetch', event => {
    if (event.request.url.indexOf(base_url) > -1 || event.request.url.indexOf(base_url2) > -1) {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE_NAME)
                const res = await fetch(event.request)
                cache.put(event.request.url, res.clone())
                return res
            })()
        )
    } else {
        event.respondWith(
            (async () => {
                return await caches.match(event.request.url, {
                    ignoreSearch: true
                }) || await fetch(event.request)
            })()
        )
    }
})

// Delete
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then( cacheNames => {
            return Promise.all(
                cacheNames.map( cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('cache '+cacheName+' dihapus')
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})

// Push notification
self.addEventListener('push', event => {
    console.log(event);
    let body;
    if (event.data) {
        body = event.data.text()
    }else{
        body = "push message no payload"
    }

    let opt ={
        body,
        icon : './assets/images/icons/icon-512x512.png',
        vibrate : [100,50,100],
        data : {
            dateOfArrival : Date.now(),
            primaryKey : 1
        }
    }

    event.waitUntil(
        self.registration.showNotification('Push notification',opt)
    )
})


