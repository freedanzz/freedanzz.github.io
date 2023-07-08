importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

 //the Firebase config object 
const firebaseConfig = {
    apiKey: "AIzaSyBZm7jJI5mTuKRCe3j1KRA03HMZRhoEs2c",
    authDomain: "freedanzz.firebaseapp.com",
    projectId: "freedanzz",
    storageBucket: "freedanzz.appspot.com",
    messagingSenderId: "249663448787",
    appId: "1:249663448787:web:b701074ede84c39cc65626",
    measurementId: "G-JF2W0MHQNY"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});