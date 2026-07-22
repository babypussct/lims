importScripts('./ngsw-worker.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDZmI3PE-j1ZhkqUd3mQaYmX1pJpWqtwck",
    authDomain: "lims-cloud-by-otada.firebaseapp.com",
    projectId: "lims-cloud-by-otada",
    storageBucket: "lims-cloud-by-otada.firebasestorage.app",
    messagingSenderId: "498845778988",
    appId: "1:498845778988:web:e20c971a3af3a1ca5bfd89"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification?.title || 'Thông báo mới từ LIMS';
    const notificationOptions = {
        body: payload.notification?.body || 'Bạn có một thông báo mới chưa đọc.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Pass notification click events to the app
self.addEventListener('notificationclick', function(event) {
    console.log('[firebase-messaging-sw.js] Notification click Received.', event);
    const actionUrl = (event.notification.data && event.notification.data.actionUrl)
        ? event.notification.data.actionUrl
        : '/';
    event.notification.close();
    event.waitUntil(
        clients.matchAll({type: 'window', includeUncontrolled: true}).then( function(windowClients) {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, send SW_NAVIGATE message and focus it.
                if (client.url.indexOf(self.registration.scope) !== -1 && 'focus' in client) {
                    client.postMessage({ type: 'SW_NAVIGATE', url: actionUrl });
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(actionUrl);
            }
        })
    );
});
