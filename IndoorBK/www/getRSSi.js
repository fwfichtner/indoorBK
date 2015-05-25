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


// This functino adds GeoJSON to map
var addGeoJSON = function(list){
    // it should remove the previous layers here first, but it doesn't work yet
//    map.eachLayer(function(layer){
//        if (layer._leaflet_id === "1"){
//            map.removeLayer(layer);
//	};
//    });
    
    // Make the new layer from the given GeoJSON
    var route = new L.GeoJSON();
//    route._leaflet_id = "1";
//    console.log(route._leaflet_id);
    list.forEach(function(line){        
        route.addData(line, { style: L.mapbox.simplestyle.style });
    });
    route.setStyle({color:'red'});
    route.addTo(map);
    map.fitBounds(route.getBounds());
    route.bringToFront();
};

// This function creates a hover-over effect for buttons 
function HoverButton(ID) {
    $("#"+ID).hover(function(){
        // If the mouse hovers over the buttons some CSS changes can be made
        // Pick whatever colours of styling you want!
        $("#"+ID).css("background-color", "#42A5F5");
        },function(){
        $("#"+ID).css("background-color", "#64B5F6");
     });    
}
  

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
    $("#map").hide();
    //$("#nextAppoint").hide();
    //$("#Loading").hide();
    
    // Add the onHover effect to clickable buttons
    HoverButton("Navigate");
    HoverButton("ToStart");

    
    // When welcome page is clicked it is replaced by the main page
    $("#Welcome").on("click", function(){
        $("#pageone").show();
        $("#Welcome").hide();
    });

    $("#Loading").on("click", function(){
        alert("Just a second, almost ready!");
    });

    $("#Navigate").on("click", function(){
        $("#Navigate").hide();
        $("#ToStart").show();
        $("#nextAppoint").hide();
        $("#map").show();
    });

    $("#ToStart").on("click", function(){
        // Start over again
        $("#nextAppoint").show();
        $("#Loading").show();
        //$("#Navigate").show();
        getRSSi();

    });  


    // test the printAppoint function with some dummy data
 //   printAppoint([((new Date).setHours((new Date).getHours() + (Math.random()*10))).toString(), "Some Geomatics Class", "BK-IZ U"]);
    
    // Dummy GeoJSON 
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

        //Sends the objects to the NodeJS server, and prints a message upon success
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
        url: 'http://192.168.0.117:8000',
        data: JSON.stringify(listObjects),
  //      data: JSON.stringify(RSSI),
        contentType: 'application/json',
        type: 'POST',      
        success: function (data) {
 //           alert("Test! I think you're at node ",data[0]);
            data = JSON.parse(data);
            printAppoint(data);
            $("#Loading").hide();
            $("#Navigate").show();
            addGeoJSON(data.slice(4));
        },
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
