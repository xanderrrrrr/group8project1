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
            hikeInput.attr("trailID", response.trails[i].id)

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

function submitHikes() {

    var organizer = $("#organizersName").val().trim();
    var event = $("#eventTitle").val().trim();
    var desc = $("#eventDesc").val().trim();
    var date = $("#eventDate").val().trim();
    var time = $("#eventTime").val().trim();
    var zip = $("#searchZip").val().trim();
    var distance = $("#minDist").val().trim();
    var social = $("#eventSocial").val().trim();
    var trailID = $('input[type=radio]:checked').attr('trailid')

    database.ref().push({
        "Organizer's Name": organizer,
        "Event Title": event,
        "Event Description": desc,
        "Event Date": date,
        "Event Time": time,
        "Zip Code": zip,
        "Shortest Distance": distance,
        "Event Social Location": social,
        "trailID": trailID
    });
};

$("#createEvent").on("click", function (event) {
    submitHikes()
});