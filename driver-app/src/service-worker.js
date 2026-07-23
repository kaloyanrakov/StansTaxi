/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/bookings'),
  new StaleWhileRevalidate({ cacheName: 'bookings-cache' })
);

registerRoute(
  ({ url }) => /\/api\/bookings\/.*\/(accept|decline)/.test(url.pathname),
  new NetworkFirst({ cacheName: 'booking-actions' })
);

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'New Booking', {
      body: data.body || 'A new booking is waiting.',
      icon: '/logo192.png',
      tag: 'new-booking',
      data: { bookingId: data.bookingId },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientsArr) => {
      const client = clientsArr.find((c) => c.url.includes(self.location.origin));
      if (client) return client.focus();
      return self.clients.openWindow('/');
    })
  );
});