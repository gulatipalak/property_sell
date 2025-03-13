import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

// Request Permission for Notifications
const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Notification permission granted.");

            // Get FCM Token
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
            });

            if (token) {
                console.log("FCM Token:", token);
                localStorage.setItem("device_token", token);
                return token;
            } else {
                console.log("No registration token available.");
            }
        } else {
            console.log("Notification permission denied.");
        }
    } catch (error) {
        console.error("Error requesting notification permission:", error);
    }
};

// Handle Incoming Messages
onMessage(messaging, (payload) => {
    console.log("Message received: ", payload);
    // You can show notifications here
});

// // Register Service Worker
if ("serviceWorker" in navigator) {
    // console.log(navigator,"navigator")
    navigator.serviceWorker.register("/firebase-messaging-sw.js")
        .then((registration) => {
            console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
            console.error("Service Worker registration failed:", error);
        });
}

export { messaging,requestNotificationPermission };
