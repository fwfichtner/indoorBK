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

    if (typeof route !== 'undefined') {
        route.clearLayers();
    }

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
    
    // Shows navigation button once ready
    $("#Loading").hide();
    $("#Navigate").show();

};



// Error callback function -- displays error message in alert
var fail = function (err) {
    alert("error: "+err);
};




function update(destNode, destGid, target) {

    // Retrieves the updated RSSI values and executes listHandlerAuto
    WifiWizard.getScanResults({numLevels: false}, listHandlerAuto, fail);

    function listHandlerAuto (list) {      

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
            { level : -45.0, SSID: "TUvisitor", BSSID : "00-22-90-38-98-51" },
            { level : -45.0, SSID: "tudelft-dastud", BSSID : "00-22-90-38-98-52" },
            { level : -45.0, SSID: "eduroam", BSSID : "00-22-90-38-98-50" },
            { level : -59.0, SSID: "eduroam", BSSID : "00-22-90-5E-63-20" },
            { level : -60.0, SSID: "TUvisitor", BSSID : "00-22-90-38-98-5E" }
            ];

        // Converts the BSSID to capital letters
        for (i = 0; i < listObjects.length; i++){
        listObjects[i].BSSID = listObjects[i].BSSID.toUpperCase();
        listObjects[i].BSSID = listObjects[i].BSSID.replace(/:/g,"-");
        }

        listObjects.push(destNode);
        listObjects.push(destGid);
        listObjects.push(target);
        connectServerAuto(listObjects);

        // // Useful for debugging: Gives you the choice to use RSSI measurements, or dummy values
        // if (confirm("Press 'OK' to use RSSI measurements, or press 'cancel' to use dummy values")) {
        //     listObjects.push(destNode);
        //     listObjects.push(destGid);
        //     listObjects.push(target);
        //     connectServerAuto(listObjects);
        // } else {
        //     RSSI.push(destNode);
        //     RSSI.push(destGid);
        //     RSSI.push(target);
        //     connectServerAuto(RSSI);
        // }
    }

    function connectServerAuto(list) {
        $.ajax({
        url: 'http://145.90.76.92:8080',
        data: JSON.stringify(list),
        contentType: 'application/json',
        type: 'POST',      
        success: function (data) {
            data = JSON.parse(data);

            if (data[0] == -1) {
                alert("Your current location is not in BK!");       
            } else {
                addGeoJSON(data);
            }
            
        },
            // When ajax fails the error message is shown as an alert
            error: function (xhr, status, error) {
                alert('Error: an error occurred in the server!');
            }
        });
    }


}



// Calls the server and sends the RSSI readings.
function connectServer(list) {
    $.ajax({
    url: 'http://145.90.76.92:8000',
    data: JSON.stringify(list),
    contentType: 'application/json',
    type: 'POST',      
    success: function (data) {
        data = JSON.parse(data);
        printAppoint(data.slice(0,3));
        $("#Welcome").hide();
        $("#pageone").show();

        // if (data.length < 4) {
        //     alert("Your destination is not in BK!");
        //     if (confirm("Do you want to use a dummy destination?")) {
        //         $("#Welcome").show();
        //         $("#pageone").hide();
        //         list.push("BK-IZ R");
        //         connectServer(list);
        //     } else {
        //         $("#Loading").hide();
        //         $("#ToStart").show();
        //         alert("No route could be determined!");
        //     }
        if (data[3] == -1) {
            alert("Your current location is not in BK!");
            if (confirm("Do you want to try again?")) {
                $("#Welcome").show();
                $("#pageone").hide();
                getRSSi();
            } else {
                $("#Loading").hide();
                $("#ToStart").show();
                alert("No route could be determined!");
            }
        } else {
            addGeoJSON(data.slice(3,data.length - 1));
            var newdata = data[data.length - 1];
            destNode = newdata[0];
            destGid = newdata[1];
            target = newdata[2];
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



// Check the results of the getScanResults
function listHandler (list) {      

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

    // Useful for debugging: Gives you the choice to use RSSI measurements, or dummy values
    if (confirm("Press 'OK' to use RSSI measurements, or press 'cancel' to use dummy values")) {
        listObjects.push("BK-IZ R");
        connectServer(listObjects);
    } else {
        RSSI.push("BK-IZ R");
        connectServer(RSSI);
    }
}





// This is the main function that calls the server as well
function getRSSi(){

    // Show and hide specific divs
    $("#Welcome").show();
    $("#pageone").hide();
    $("#Navigate").hide();
    $("#ToStart").hide();
    $("#map").hide();

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
        
        // execute autoUpdate function after every 10 seconds
        window.setTimeout(autoUpdate, 5000);
        var autoUpdate = setInterval(function () {
            WifiWizard.startScan(window.setTimeout(update(destNode, destGid, target), 5000), fail);
        }, 5000);

    }); 

    // Implements restart button in map display
    $("#ToStart").on("click", function(){
        $("#ToStart").hide();
        $("#map").hide();
        $("#Welcome").show();
        location.reload(); 
    }); 
    
    // Retrieves the RSSI values
    WifiWizard.getScanResults({numLevels: false}, listHandler, fail);

};

//window.onload = getRSSi;
document.addEventListener("deviceready", getRSSi, false);
