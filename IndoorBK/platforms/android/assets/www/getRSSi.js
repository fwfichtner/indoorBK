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
                // subtracting dates gives a result in millisecons. 
                // This is multiplied with 2.77778e-7 to get hours and then rounded.
//               "<p><b>In "+ Math.round(Math.abs(new Date() - list[0])
//                *2.77778e-7).toString() +" hour(s)</b></p>"+
            "</div>"
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
    var route = new L.GeoJSON();
    // Add the individual GeoJSON linestrings to the layer
    list.forEach(function(line){        
        route.addData(line, { style: L.mapbox.simplestyle.style });
    });
    // Set some additional styling
    route.setStyle({color:'red'});
    // add the layer to the map
    route.addTo(map);
    // zoom to layer
    map.fitBounds(route.getBounds());
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
    $("#pageone").hide();
    $("#Welcome").show();
    $("#Navigate").hide();
    $("#ToStart").hide();
    //$("#map").hide();
    // these below are for debugging:
        $("#nextAppoint").hide();
        //$("#Loading").hide();

    // When welcome page is clicked it is replaced by the main page
    $("#Welcome").on("click", function(){
        $("#pageone").show();
        $("#Welcome").hide();
    });

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

    // test the printAppoint function with some dummy data
 //   printAppoint([((new Date).setHours((new Date).getHours() + (Math.random()*10))).toString(), "Some Geomatics Class", "BK-IZ U"]);
    
    // 2 Dummy GeoJSON lineStrings
    var DummyGeoJSON1 = [
            {
              "type": "Feature",
              "geometry": {
                "type": "LineString",
                "coordinates": [
                  [4.370451,52.005726],
                  [4.371193,52.005348]
                ]
              },
              "properties": {
                "stroke": "#fc4353",
                "stroke-width": 5
              }
            }
          ];
    var DummyGeoJSON2 = [
            {
              "type": "Feature",
              "geometry": {
                "type": "LineString",
                "coordinates": [
                  [4.370451,52.005726],
                  [4.370137,52.005410]
                ]
              },
              "properties": {
                "stroke": "#fc4353",
                "stroke-width": 5
              }
            }
          ];
    // test the addGeoJSON function with dummy data
    addGeoJSON([DummyGeoJSON1,DummyGeoJSON2]);

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
        // var RSSI = [
        //     { level : -58.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5E-69-21" },
        //     { level : -58.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-40" },
        //     { level : -57.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5E-69-20" },
        //     { level : -57.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-41" },
        //     { level : -56.0, SSID: "TUvisitor", BSSID : "00:22:90-38-AE-42" }
        //     ];

        // Converts the BSSID to capital letters
        for (i = 0; i < listObjects.length; i++){
        listObjects[i].BSSID = listObjects[i].BSSID.toUpperCase();
        listObjects[i].BSSID = listObjects[i].BSSID.replace(/:/g,"-");
        }

        //print(JSON.stringify(listObjects));
        
        // Calls the server and sends the RSSI readings.
        $.ajax({
        url: 'http://145.97.237.141:8000',
        data: JSON.stringify(listObjects),
        // data: JSON.stringify(RSSI),
        contentType: 'application/json',
        type: 'POST',      
        success: function (data) {

 //           alert("Test! I think you're at node ",data[0]);
            data = JSON.parse(data);
            printAppoint(data);
         
            // The navigate button is enabled
            $("#Loading").hide();
            $("#Navigate").show();
            
            // The GeoJSON layers are already loaded to the map (in the background)
            // As soon as the navigate button is clicked it will be shown.
            
//            addGeoJSON(data.slice(4));
        },
            // When ajax fails the error message is shown as an alert
            error: function (xhr, status, error) {
                alert('Error: ' + error.message);
            }
        });
    };
    
    // Retrieves the RSSI values
    WifiWizard.getScanResults({numLevels: false}, listHandler, fail);

};

//window.onload = getRSSi;
document.addEventListener("deviceready", getRSSi, false);
