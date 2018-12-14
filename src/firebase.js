 import firebase from 'firebase/app';
 import 'firebase/auth';
 import 'firebase/database';
 import 'firebase/storage'
 // Initialize Firebase
 let config = {
    apiKey: "AIzaSyAGs4vEoNYpRsgecsv9zBqXVn6dbhpdQUg",
    authDomain: "slack-chat-clone.firebaseapp.com",
    databaseURL: "https://slack-chat-clone.firebaseio.com",
    projectId: "slack-chat-clone",
    storageBucket: "slack-chat-clone.appspot.com",
    messagingSenderId: "1043832753264"
  };
  firebase.initializeApp(config);

  export default firebase;