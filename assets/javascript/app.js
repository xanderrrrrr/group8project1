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

        for (var i = 0; i < response.trails.length; i++) {

            console.log(response.trails[i].name)

            

        }

    })

};