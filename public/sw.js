/**
 * @file sw.js
 * @directory gaivota.news\public
 * @author Gaivota News - gaivota.news
 * @version 0.0.1
 * @since 27/12/2025 21:10
 *
 * @description
 * Descrição objetiva da responsabilidade do arquivo
 *
 * @company Gaivota News
 * @system Em qual sistema este arquivo existe?
 * @module Qual parte funcional do sistema ele implementa?
 *
 * @maintenance
 * Alterações devem ser registradas conforme normas internas.
 */

const CACHE_NAME = 'template-nextjs-v2';
const OFFLINE_URL = '/offline';

// Ficheiros que devem ser colocados em cache imediatamente
const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/favicon.ico',
  '/manifest.json',
  '/logo.png', // Certifica-te que este ficheiro existe em public/
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a rede responder, guardamos em cache se for um recurso válido
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cacheResponse = await caches.match(event.request);
        if (cacheResponse) return cacheResponse;

        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      })
  );
});

self.addEventListener('push', function (event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) return;

  const data = event.data?.json() ?? {};
  const title = data.title || 'Gaivota News';
  const options = {
    body: data.body || 'Nova notificação',
    icon: '/logo.png',
    badge: '/logo.png',
    data: data.url || '/',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
