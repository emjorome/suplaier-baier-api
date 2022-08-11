
var admin = require("firebase-admin");

var serviceAccount = require("private_firebase_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
