const admin = require("firebase-admin");
const firebase = require("firebase/app");

const credentials = require("./credential.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: "DATABASE_URL",
});

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "AUTH_DOMAIN",
  databaseURL: "DATABASE_URL",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "MESSAGE_SENDER_ID",
  appId: "APP_ID",
  measurementId: "MEASUREMENTID",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

exports.admin = admin;
exports.db = admin.database().app.firestore();
exports.firebase = firebase;
exports.firebaseConfig = firebaseConfig;
