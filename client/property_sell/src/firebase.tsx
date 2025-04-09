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
            const device_token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
            });

            if (device_token) {
                // console.log("FCM Token:", token);
                localStorage.setItem("device_token", device_token);
                return device_token;
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
// onMessage(messaging, (payload) => {
//     console.log("Message received: ", payload);
//     // You can show notifications here
// });

onMessage(messaging, (payload) => {
    console.log("Message received: ", payload);
  
    const { title, body } = payload.notification || {};
    const { senderName, notification_type } = payload.data || {};
  
    // Show the browser notification
    if (Notification.permission === "granted") {
      new Notification(title || "New Notification", {
        body: body || `${senderName} sent you a ${notification_type}`,
        icon: "/path/to/icon.png", // optional
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title || "New Notification", {
            body: body || `${senderName} sent you a ${notification_type}`,
            icon: "/path/to/icon.png", // optional
          });
        }
      });
    }
  });

// Register Service Worker
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
