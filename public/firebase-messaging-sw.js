/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js')

firebase.initializeApp({
    apiKey: "AIzaSyA7vCfMVherTQvTgH-KEYkRsj1ly7cKp7I",
    authDomain: "faithfuls.firebaseapp.com",
    projectId: "faithfuls",
    storageBucket: "faithfuls.appspot.com",
    messagingSenderId: "666380531899",
    appId: "1:666380531899:web:580f8858a73b75c138919e",
    measurementId: "G-RHTQH5ECRY"
})

const messaging = firebase.messaging()


messaging.setBackgroundMessageHandler(function(payload) {
    // Customize notification here
    const notificationTitle = "Background Message Title";
    const notificationOptions = {
        body: "Background Message body.",
        icon: "/carouselImage/amazon.png",
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
    );
});
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
// messaging.onMessage((payload) => {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//       body: 'Background Message body.',
//       icon: '/firebase-logo.png'
//     };
  
//     return self.registration.showNotification(notificationTitle,
//       notificationOptions);
//   });
  
  self.addEventListener("activate",evt => {
      console.log("we are listening")
  })
  self.addEventListener("install",evt => {
      console.log("successfully installed")
  })