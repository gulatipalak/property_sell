importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAx5N36CvBQRDAoDxB6MbSB9gc_s7EjhPg",
    authDomain: "property-bazaar-f0381.firebaseapp.com",
    projectId: "property-bazaar-f0381",
    storageBucket: "property-bazaar-f0381.appspot.com",
    messagingSenderId: "764139207835",
    appId: "1:764139207835:web:9cda8b0345412fabc51a3e",
    measurementId: "G-99DTZRJG15",
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Messaging
const messaging = firebase.messaging();

// Background Message Handling
messaging.onBackgroundMessage((payload) => {
    console.log("Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/firebase-logo.png"
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
