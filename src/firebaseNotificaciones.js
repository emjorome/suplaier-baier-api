var admin = require("firebase-admin");

var serviceAccount = require("../notificaciones-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
