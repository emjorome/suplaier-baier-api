var admin = require("firebase-admin");

var serviceAccount = require("../private_firebase_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// The topic name can be optionally prefixed with "/topics/".
const topic = "contabilly";

const message = {
  data: {
    score: "850",
    time: "2:45",
  },
  topic: topic,
};

// const sendNotification = (message, topic) => {
//     /*const message = {
//         data: message,
//         topic: topic,
//       };*/
    
//       // Send a message to devices subscribed to the provided topic.
//       getMessaging()
//         .send(message)
//         .then((response) => {
//           // Response is a message ID string.
//           console.log("Successfully sent message:", response);
//         })
//         .catch((error) => {
//           console.log("Error sending message:", error);
//         });
// };

module.exports = {
    admin,
    // sendNotification
};
