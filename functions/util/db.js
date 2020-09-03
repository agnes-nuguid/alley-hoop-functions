const admin = require("firebase-admin");

const serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://alley-hoop.firebaseio.com",
});

// Get a reference to the admin service
exports.db = admin.database();

exports.runtimeOpts = {
  timeoutSeconds: 5,
  memory: "128MB",
};
