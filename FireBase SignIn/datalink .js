var app_fireBase = {};
(function(){
// Your web app's Firebase configuration
var config = {
    apiKey: "AIzaSyAjCKPaytT8KgyD6N8enxPI8TysBePq2jQ",
    authDomain: "group8project1-cd703.firebaseapp.com",
    databaseURL: "https://group8project1-cd703.firebaseio.com",
    projectId: "group8project1-cd703",
    storageBucket: "",
    messagingSenderId: "98301800415",
    appId: "1:98301800415:web:41977ef82112f835579e6a",
    measurementId: "G-T74D3N65W8"
  };
  // Initialize Firebase
  firebase.initializeApp(config);

  app_fireBase = firebase;
  
})();

  var hikes = firebase.database().ref("hikes");


var submitHikes = function () {

  var organizer = $("#organizersName").val();
  var event = $("#eventTitle").val();
  var desc = $("#eventDesc").val();
  var date = $("#eventDate").val();
  var time = $("#eventTime").val();
  var zip = $("#searchZip").val();
  var distance = $("#minDist").val();
  var social = $("#eventSocial").val();

  hikes.push({
    "Organizer's Name": organizer,
    "Event Title": event,
    "Event Description": desc,
    "Event Date": date,
    "Event Time": time,
    "Zip Code": zip,
    "Shortest Distance": distance,
    "Event Social Location": social
  });
};

$(window).load(function () {

  $(".modal-content").submit(submitHikes);

});
