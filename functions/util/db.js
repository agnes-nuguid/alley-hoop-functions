const firebase = require("firebase/app");
require("firebase/database");

const config = {
  apiKey: "AIzaSyDYSuC9NSZLvz5X1jUZfRPWSBifr1sJfDk",
  authDomain: "alley-hoop.firebaseapp.com",
  databaseURL: "https://alley-hoop.firebaseio.com",
  storageBucket: "alley-hoop.appspot.com",
};

firebase.initializeApp(config);

// Get a reference to the database service
exports.db = firebase.database();
