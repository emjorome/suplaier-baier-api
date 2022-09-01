var admin = require("firebase-admin");

var serviceAccount = require("../contabillyapp-key.json");
function initApp(){
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
}

initApp();

const topic = "Contabilly";

const message = {
  data: {
      title: "TITULO DEL MENSAJE DE PRUEBA",
      message: "Estoy enviando una notificacion de prueba desde el back end",
  },
  token: "MI_TOKEN",
};

// Send a message to devices subscribed to the provided topic.
admin.messaging()
  .send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log("Successfully sent message:", response);
  })
  .catch((error) => {
    console.log("Error sending message:", error);
  });

function enviarNotificacionTopic(notificationData) {
  const message = {
    data: {
      title: notificationData.title,
      message: notificationData.message,
    },
    topic: notificationData.topic,
  };

  // Send a message to devices subscribed to the provided topic.
  getMessaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
}

module.exports = { enviarNotificacionTopic };
