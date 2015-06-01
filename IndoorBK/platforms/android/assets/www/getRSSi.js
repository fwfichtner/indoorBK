//Here we should write the module that retrieves the RSSi values of the WiFi 
//networks and sends it to the server. 
// https://github.com/parsonsmatt/WifiWizard

// First we define all of the general functions

// This function prints the appointment to the screen with the proper HTML format.
// It takes a list (array) as input:
// list[0] = date object
// list[1] = Event name
// list[2] = Location name
var printAppoint = function(list) {
    $("#nextAppoint").html(
            "<div>"+
                "<p><b>Next event:</b> </br>"+ list[1].toString() +"</p>"+
                "<p><b>Location:</b> </br>"+ list[2].toString() +"</p>"+
                "<p><b>In "+ Math.round(Math.abs((new Date).getTime() - list[0])
                *2.77778e-7).toString() +" hour(s)</b></p>"
            +"</div>"
            );

};

// Call the print function to add text to the HTML div with the "RSSI" id in index.html
var print = function(text) {
    $("#nextAppoint").html(text);
};


// This function adds GeoJSON to map
var addGeoJSON = function(list){
    // THis part should remove any previous route layers, but it doesn't work yet
//    map.eachLayer(function(layer){
//        if (layer._leaflet_id === "1"){
//            map.removeLayer(layer);
//	};
//    });
    
    // Make the new layer 
    route = new L.GeoJSON();
    // Add the individual GeoJSON linestrings to the layer
    list.forEach(function(line){        
        route.addData(line, { style: L.mapbox.simplestyle.style });
    });
    // Set some additional styling
    route.setStyle({color:'red'});
    // add the layer to the map
    route.addTo(map);
    // zoom to layer
 //   map.fitBounds(route.getBounds());
    // bring the layer on top of the floorplan
    route.bringToFront();
};

// Error callback function -- displays error message in alert
var fail = function (err) {
    alert("error: "+err);
    //print("Ajax fail");
};

// This is the main function that calls the server as well
function getRSSi(){

    // Show and hide specific divs
    $("#Welcome").show();
    $("#pageone").hide();
    $("#Navigate").hide();
    $("#ToStart").hide();
    $("#map").hide();
//     these below are for debugging:
//        $("#nextAppoint").hide();
//        $("#Loading").hide();

    // // When welcome page is clicked it is replaced by the main page
    // $("#Welcome").on("click", function(){
    //     $("#pageone").show();
    //     $("#Welcome").hide();
    // });

    // As long as we're waiting for the server data we ask for some patience
    $("#Loading").on("click", function(){
        alert("Just a second, almost ready!");
    });

    // When the navigate button is clicked the map is shown 
    // and the 'back to start' button is loaded.
    $("#Navigate").on("click", function(){
        $("#Navigate").hide();
        $("#ToStart").show();
        $("#nextAppoint").hide();
        $("#map").show();
    }); 

    // Check the results of the getScanResults
    var listHandler = function (list) {      

        // If more than 5 access points are available, this if-else statement finds
        // the 5 with strongest signal level and stores them in a new array
        if (list.length > 5) {

            // lists all rssi-levels and finds the fifth-largest value
            var listLevels = Array(); 
            for (var i = 0; i < list.length; i++) {
                listLevels.push(list[i].level);
            }
            listLevels.sort(function(a,b){return b-a});
            threshValue = listLevels[4];

            // finds all objects with rssi-levels above the fifth-largest value
            // and stores them in a new array
            var listObjects = Array();
            for (var i = 0; i < list.length; i++) {
                if (list[i].level >= threshValue) {
                    listObjects.push(list[i]);
                }
            }

        } else {
            var listObjects = list;
        }

        //Dummy RSSi values
        var RSSI = [
            { level : -58.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5E-69-21" },
            { level : -58.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-40" },
            { level : -57.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5E-69-20" },
            { level : -57.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-41" },
            { level : -56.0, SSID: "TUvisitor", BSSID : "00:22:90-38-AE-42" }
            ];

        // Converts the BSSID to capital letters
        for (i = 0; i < listObjects.length; i++){
        listObjects[i].BSSID = listObjects[i].BSSID.toUpperCase();
        listObjects[i].BSSID = listObjects[i].BSSID.replace(/:/g,"-");
        }

        if (confirm("Press 'OK' to use RSSI measurements, or press 'cancel' to use dummy values")) {
            connectServer(listObjects);
        } else {
            connectServer(RSSI);
        }
       

        // Calls the server and sends the RSSI readings.
        function connectServer(list) {
            $.ajax({
            url: 'http://145.97.243.61:8000',
            data: JSON.stringify(list),
            contentType: 'application/json',
            type: 'POST',      
            success: function (data) {
                data = JSON.parse(data);
                printAppoint(data.slice(0,3));
                $("#Welcome").hide();
                $("#pageone").show();
                $("#Loading").hide();
                $("#Navigate").show();

                if (data.length < 4) {
                    alert("Your destination is not in BK!");
                    if (confirm("Do you want to try again?")) {
                        $("#Welcome").show();
                        $("#pageone").hide();
                        connectServer(list);
                    } else {
                        alert("No route could be determined!");
                    }
                } else if (data[3] == -1) {
                    alert("Your current location is not in BK!");
                    if (confirm("Do you want to try again?")) {
                        $("#Welcome").show();
                        $("#pageone").hide();
                        getRSSi();
                    } else {
                        alert("No route could be determined!");
                    }
                } else {
                    addGeoJSON(data.slice(3));
                }
                
            },
                // When ajax fails the error message is shown as an alert
                error: function (xhr, status, error) {
                    alert('Error: an error occurred in the server!');
                    if (confirm("Do you want to try again?")) {
                        connectServer(list);
                    } else {
                        alert("Application stopped");
                    }
                }
            });
        }
    };
    
    // Retrieves the RSSI values
    WifiWizard.getScanResults({numLevels: false}, listHandler, fail);

};

//window.onload = getRSSi;
document.addEventListener("deviceready", getRSSi, false);
