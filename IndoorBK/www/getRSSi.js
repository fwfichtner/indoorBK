//Here we should write the module that retrieves the RSSi values of the WiFi 
//networks and sends it to the server. 
// https://github.com/parsonsmatt/WifiWizard

function getRSSi(){
    // Call the print function to add text to the HTML div with the "nextAppoint" id in index.html
    var print = function(text) {
        $("#nextAppoint").html(text);
    }
    
    $("#pageone").hide();
    $("#Navigate").hide();
    $("#ToStart").hide();
    //$("#map").hide();
    $("#nextAppoint").hide();

    $("#Welcome").on("click", function(){
        $("#pageone").show();
        $("#Welcome").hide();
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

            print(listObjects.toString());

        } else {
            var listObjects = list;
        }
      


        // Sends the objects to the NodeJS server, and prints a message upon success
        // var RSSI = [
        //     { level : -58.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5E-69-21" },
        //     { level : -58.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-40" },
        //     { level : -57.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5E-69-20" },
        //     { level : -57.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-41" },
        //     { level : -56.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-42" }
        //     ];

        // Converts the BSSID to capital letters
        for (i = 0; i < listObjects.length; i++){
        listObjects[i].BSSID = listObjects[i].BSSID.toUpperCase();
        }


        // call startScan
        var options = {"numLevels": false};
        WifiWizard.startScan(win, fail);
        WifiWizard.getScanResults(options, listHandler, fail);

        $.ajax({
        url: 'http://145.97.237.141:8000',
        data: 'Success! Data was received from server!',
        type: 'POST',      
        success: function (data) {
            print(data.toString());
            $("#Loading").hide();
            $("#Navigate").show();
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
        });

    };
    
    $("#Loading").on("click", function(){
        alert("Just a second, almost ready!");
    });
    
    $("#Navigate").on("click", function(){
        alert("let's navigate!");
        $("#nextAppoint").hide();
        $("#map").show();
    });
    
    // Error callback function -- displays error message in alert
    var fail = function (err) {
        alert("error: "+err);
        print("FAHRRAD ZURUCK BITTE!!");
    };
    
    // Retrieves the RSSI values
    WifiWizard.getScanResults({numLevels: false}, listHandler, fail);

}

//window.onload = getRSSi;
document.addEventListener("deviceready", getRSSi, false);
