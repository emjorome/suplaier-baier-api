var admin = require("firebase-admin");
var getMessaging = require("firebase/compat/messaging");

var serviceAccount = require("../contabillyapp-key.json");

 function initApp(){
     admin.initializeApp({
         credential: admin.credential.cert(serviceAccount),
       });
 }

 initApp();

const topic = "Contabilly";

// const message = {
//   data: {
//       title: "TITULO DEL MENSAJE DE PRUEBA",
//       message: "Estoy enviando una notificacion de prueba desde el back end",
//   },
//   token: "cihtSbtdqjnCsteQQZ10bW:APA91bFvDHZI1y5KR48Lus-zOn-SmAf_P2Plq49jtxxhsu60sQUJiaLm0I7PzPDKAdf43RWbsErONjwm7CJN5Gl6ZgZMJggJpJjXM62Mfoa7FRC_sbpT07JBLM0T_8mquEBWFdiiE-d9",
// };

// Send a message to devices subscribed to the provided topic.
// admin.messaging()
//    .send(message)
//    .then((response) => {
//      // Response is a message ID string.
//      console.log("Successfully sent message:", response);
//    })
//    .catch((error) => {
//      console.log("Error sending message:", error);
//    });

function enviarNotificacionTopic(notificationData) {
  const message = {
    data: {
      title: notificationData.title,
      message: notificationData.message,
    },
    token: notificationData.token,
  };

  admin.messaging()
   .send(message)
   .then((response) => {
     // Response is a message ID string.
     console.log("Successfully sent message:", response);
   })
   .catch((error) => {
     console.log("Error sending message:", error);
   });

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
}

module.exports = { enviarNotificacionTopic };
