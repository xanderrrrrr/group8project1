$.holdReady(true);

// first, when the user clicks submit, it will get the values for date, time and city
$("#findTrail").on("click", function (event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    var zip = $("#searchZip").val().trim();
    var shortDistance = $("#minDist").val().trim();
    console.log(zip + shortDistance)

    // Calling the api and passing through zip and time
    convertToLongLat(zip, shortDistance)
});

// function to convert zipcode so I can then get the trail results
function convertToLongLat(zip, shortDistance) {
    var queryURL = "http://www.mapquestapi.com/geocoding/v1/address?key=ci9tBRSfUcMens5FP57F6jUZKbbUx3Im&location=" + zip;


    // Creating an AJAX call for the submit button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // console logging the response so I can see
        console.log("latitude: " + response.results[0].locations[0].latLng.lat)
        console.log("longitude: " + response.results[0].locations[0].latLng.lng)
        // storing my long and lat in variables so I can then call to trailAPI
        var lat = response.results[0].locations[0].latLng.lat
        var lng = response.results[0].locations[0].latLng.lng

        // calling my trailAPI
        trailAPI(lat, lng, shortDistance)
    })
};

// function to get trail info
function trailAPI(lat, lng, shortDistance) {
    var queryURL = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lng + "&minLength=" + shortDistance + "&key=200610266-75d00174f7ac32d0c2d408b1ac1ac42f";


    // Creating an AJAX call for the submit button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // console logging the response so I can see
        console.log(response)


        // for loop so I can go through all of the results
        for (var i = 0; i < response.trails.length; i++) {
            // console logging the names of the trails
            console.log(response.trails[i].name)
            // Creating and storing a div tag
            var hikeDiv = $("<div>");
            // giving the wrapping div a class for bootstrap
            hikeDiv.attr("class", "radio")

            // giving the hike name a label tag because no text should be without 
            var hikeLabel = $("<label>").text(response.trails[i].name)

            var hikeInput = $("<input>")
            // giving it a radio field and giving it an ID so we can push that to firebase
            hikeInput.attr("type", "radio")
            hikeInput.attr("trailID", response.trails[i].name)
            hikeInput.attr("imageURL",response.trails[i].imgMedium)

            // appending our radio buttons to our div from above
            hikeDiv.append(hikeInput)

            // fixing to get our link in a new tab
            var hikeURL = $("<a>")
            hikeURL.attr("href", response.trails[i].url)
            hikeURL.attr("target", "_blank")
            // adding the label to our URL
            hikeURL.append(hikeLabel)
            // adding the URL to our Div
            hikeDiv.append(hikeURL);

            // Prependng the athleteDiv to the HTML page in the "#images-go-here" div
            $("#choices-go-here").prepend(hikeDiv);
        }

    })

};
// stuff needed to initialize firebase
var firebaseConfig = {
    apiKey: "AIzaSyCSCTXNQ6g8biGMK_CnL30Re9MQ0ib9hP0",
    authDomain: "group8project1.firebaseapp.com",
    databaseURL: "https://group8project1.firebaseio.com",
    projectId: "group8project1",
    storageBucket: "",
    messagingSenderId: "823193227900",
    appId: "1:823193227900:web:4cacaf402438b526496ff9",
    measurementId: "G-BXXYC8Q7VX"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database()

// the function that runs when the user hits submit button
function submitHikes() {

    // grabbing the user input values
    var organizer = $("#organizersName").val().trim();
    var event = $("#eventTitle").val().trim();
    var desc = $("#eventDesc").val().trim();
    var date = $("#eventDate").val().trim();
    var time = $("#eventTime").val().trim();
    var zip = $("#searchZip").val().trim();
    var distance = $("#minDist").val().trim();
    var social = $("#eventSocial").val().trim();
    var trailImage = $('input[type=radio]:checked').attr('imageURL')
    var trailID = $('input[type=radio]:checked').attr('trailid')

    // pushing those input values into firebase
    database.ref().push({
        "organizersName": organizer,
        "eventTitle": event,
        "eventDescription": desc,
        "eventDate": date,
        "eventTime": time,
        "zipCode": zip,
        "shortestDistance": distance,
        "eventSocialLocation": social,
        "trailID": trailID,
        "trailImage": trailImage,
        "attendees": [organizer]
    });


};
// on click listener for the final "create event" button that runs the function to submit hikes
$("#createEvent").on("click", function (event) {
    submitHikes()
});

// old way of doing it: event for putting the firebase events into HTML when a user adds an entry
// database.ref().on("child_added", function (childSnapshot) {
//     console.log(childSnapshot.val());

//     // Store everything into a variable.
//     var eventDate = childSnapshot.val().eventDate;
//     var eventDescription = childSnapshot.val().eventDescription
//     var eventSocialLocation = childSnapshot.val().eventSocialLocation;
//     var eventTime = childSnapshot.val().eventTime;
//     var eventTitle = childSnapshot.val().eventTitle;
//     var organizersName = childSnapshot.val().organizersName;
//     var trailID = childSnapshot.val().trailID;
//     var zipCode = childSnapshot.val().zipCode;

//     // Event Info
//     console.log(eventDate);
//     console.log(eventTitle);
//     console.log(trailID);

//     // Create the parent div of the card
//     var parentDiv = $("<div>")
//     // give the parent div a bootstrap class
//     parentDiv.attr("class","col-lg-4")

//     // creating a new card div
//     var cardDiv = $("<div>")
//     cardDiv.attr("class","card")
//     cardDiv.attr("style","width: 18rem;")

//     // creating the div for card body
//     var cardBody = $("<div>")
//     cardBody.attr("class","card-body")

//     // creating a span for the title
//     var titleSpan = $("<span>").append(
//         $("<h5>").text(eventTitle)
//     )

//     cardBody.append(titleSpan)
//     cardDiv.append(cardBody)
//     parentDiv.append(cardDiv)

//     // Append the new row to the table
//     $("#newGoesHere").append(parentDiv);
// });



// new way: Firebase event for putting the firebase events into HTML when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var eventDate = childSnapshot.val().eventDate;
    var eventDescription = childSnapshot.val().eventDescription
    var eventSocialLocation = childSnapshot.val().eventSocialLocation;
    var eventTime = childSnapshot.val().eventTime;
    var eventTitle = childSnapshot.val().eventTitle;
    var organizersName = childSnapshot.val().organizersName;
    var trailID = childSnapshot.val().trailID;
    var zipCode = childSnapshot.val().zipCode;
    var uniqueID = childSnapshot.key
    var trailImage = childSnapshot.val().trailImage;
    var newAttendees = childSnapshot.val().attendees
    console.log(newAttendees)
    var attendeesString = ""

    for(var i = 0;i < newAttendees.length; i++) {
        console.log(newAttendees[i])
        attendeesString+=newAttendees[i] + " "

    }
    console.log("new: " + attendeesString)
    var momentEventDate = moment(eventDate)
     if (momentEventDate >= moment()) {

    
        // database.ref(uniqueID+"/attendees").on("child_added", function (childSnapshot) {

        //     console.log(childSnapshot.val())
    
        // })


    // Append the entire card/modal to the table
    $('<div class="col-lg-4"><div id="newCard" class="card" style="width: 18rem;"><img src="' + trailImage + '" class="card-img-top"><div class="card-body"><h5><span id="eventTitle">' + eventTitle + 
    '</span></h5><p><span id="eventDesc">' + eventDescription+ '</span></p><p>Date: <span id="eventDate">' + eventDate + '</span></p><p>Time: <span id="eventTime">' + eventTime + 
    '</span></p><p>Meetup Spot: <span id="eventTrail">' + trailID + '</span></p><p>Happy Hour Spot: <span id="eventSocial">' + eventSocialLocation + '</span><button style="margin-top:10px;" type="button" class="btn btn-info btn-block" data-toggle="modal" data-target=#'+ uniqueID + '>Event Info</button><div id=' + uniqueID + ' class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="container"><br><h2 id="eventTitle"></h2><br><div class="row"><div class="col-md-5"><img src="' + trailImage +  '" class="img-fluid"></div><div class="col-md-7"><p><strong>Date: </strong><span id="eventDate" class="float-right">' + eventDate + 
    '</span></p><p><strong>Time: </strong><span id="eventTime" class="float-right">' + eventTime + '</span></p><p><strong>Trail: </strong><span id="eventTrail" class="float-right">' + trailID + '</span></p><p><strong>Happy Hour Spot: </strong><span id="eventSocial" class="float-right">' +eventSocialLocation +
     '</span></p></div></div><br><div class="row"><div class="container"><p><strong>Event Description: </strong><span id="eventDesc">' + eventDescription + 
     '</span></p></div></div><hr><h5><strong>Whos signed up so far: </strong></h5><div id="attendeesGoHere">' + attendeesString + '<div class="row"> <div class="form-group col-md-8"> <label class="float-left" for="eventSocial">Enter your name</label> <input type="text" class="form-control" id="attendee"> </div> <div class="col-md-4 float-right"> <br> <button type="button" id="' + uniqueID + '" class="btn btn-info my-2" data-backdrop="static" style="width: 180px" onclick="addName(this.id)">Join this event</button> </div> </div></div><br></div></div></div></div></div></div>').appendTo('#newGoesHere');
     }

     else {
         // Append the entire card/modal to the table
    $('<div class="col-lg-4"><div id="newCard" class="card" style="width: 18rem;"><img src="' + trailImage + '" class="card-img-top"><div class="card-body"><h5><span id="eventTitle">' + eventTitle + 
    '</span></h5><p><span id="eventDesc">' + eventDescription+ '</span></p><p>Date: <span id="eventDate">' + eventDate + '</span></p><p>Time: <span id="eventTime">' + eventTime + 
    '</span></p><p>Meetup Spot: <span id="eventTrail">' + trailID + '</span></p><p>Happy Hour Spot: <span id="eventSocial">' + eventSocialLocation + '</span><button style="margin-top:10px;" type="button" class="btn btn-info btn-block" data-toggle="modal" data-target=#'+ uniqueID + '>Event Info</button><div id=' + uniqueID + ' class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="container"><br><h2 id="eventTitle"></h2><br><div class="row"><div class="col-md-5"><img src="' + trailImage +  '" class="img-fluid"></div><div class="col-md-7"><p><strong>Date: </strong><span id="eventDate" class="float-right">' + eventDate + 
    '</span></p><p><strong>Time: </strong><span id="eventTime" class="float-right">' + eventTime + '</span></p><p><strong>Trail: </strong><span id="eventTrail" class="float-right">' + trailID + '</span></p><p><strong>Happy Hour Spot: </strong><span id="eventSocial" class="float-right">' +eventSocialLocation +
     '</span></p></div></div><br><div class="row"><div class="container"><p><strong>Event Description: </strong><span id="eventDesc">' + eventDescription + 
     '</span></p></div></div><hr><h5><strong>Whos signed up so far: </strong></h5><p>---this is where we need to return a list of who has registered/joined the event---</p><div class="row"><div class="container align-items-center"><button type="submit" id="createEvent" class="btn btn-info my-2" data-dismiss="modal" style="width: 300px">Close</button></div></div></div><br></div></div></div></div></div></div>').appendTo('#pastGoesHere');
     
         
     }
    });


 
function addName(x) {
    // grab the uniqueID so we know which to push to 
    // database.ref().on("child_added", function (childSnapshot) {
    // console.log('wat ' + database.ref(x).once('eventDate').then(function(snapshot) {}))
    database.ref(x).once('value').then(function(snapshot) {



    var attendees = (snapshot.val().attendees);
    // console.log(attendees)

    var attendee = $("#attendee").val().trim();
    attendees.push(attendee);
    console.log(attendees)

    database.ref(x).update({"attendees": attendees});
    
     $("#attendeesGoHere").prepend(attendee + " ")

    




  })



}


