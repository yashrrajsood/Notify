const firebase = require("firebase");
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());

// Required for side-effects
require("firebase/firestore");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
firebase.initializeApp({
  apiKey: "AIzaSyB8UoZ9havrz_3MJYxNRQrKwvxjEHAOY1g",
  authDomain: "notify-yash.firebaseapp.com",
  projectId: "notify-yash",
});
var db = firebase.firestore();

app.listen(port, () => {
  console.log("============================================");
  console.log(`Server Running & listening on port ${port}`)
  console.log("============================================");
});

app.get('/addNote/:receivedData', (req, response) => {

    var receivedData = req.params["receivedData"];

    console.log("[UPLOAD] Uploading '" + receivedData + "' to the database now" )
    

    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + "@"  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

    db.collection("notes").add({
      note_text: receivedData,
      dateTime: datetime,
    })
    .then((docRef) => {
      response.send(("Document for '" + receivedData +"' written with ID: ", docRef.id))
    })
    .catch((error) => {
      console.error("[ERROR] Error adding document: ", error);
    });
});


app.get('/getNotes', (req, response) => {
  var dataToSendNow = [];
  db.collection("notes").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var temp = {
        'data': null
      }
      temp.data = doc.data();
      temp.data["id"] = doc.id;
      dataToSendNow.push(temp)
    });
    console.log("[DOWNLOAD] Retrieved " + String(dataToSendNow.length) + " notes from database")
    response.send(dataToSendNow)
});
});

app.get('/deleteNote/:noteId', (req, response) => {
  var receivedData = req.params["noteId"];
  db.collection("notes").doc(receivedData).delete().then(() => {
      console.log("[DELETE] Document successfully deleted!");
      response.send("[DELETE] Successfully Deleted")
  }).catch((error) => {
      console.error("[ERROR] Error removing document: ", error);
      response.send("[ERROR] Error removing document: ", error)
  });
})