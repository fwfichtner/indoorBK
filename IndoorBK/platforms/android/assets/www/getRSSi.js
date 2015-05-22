//Here we should write the module that retrieves the RSSi values of the WiFi 
//networks and sends it to the server. 
// https://github.com/parsonsmatt/WifiWizard

function getRSSi(){
    // Call the print function to add text to the HTML div with the "RSSI" id in index.html
    var print = function(text) {
        $("#RSSI").html(text);
    };
      var geojson = [
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
    var route = L.geoJson(geojson, { style: L.mapbox.simplestyle.style });
    route.addTo(map).bringToFront();
    
    
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
        $.ajax({
        url: 'http://145.97.237.141:8000',
        data: JSON.stringify(listObjects),
        contentType: 'application/json',
        type: 'POST',      
        success: function (data) {
            

            
            print(data.toString());
            $("#Loading").hide();
            $("#Navigate").show();
            route = data;
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
        
        $("#nextAppoint").hide();
        $("#map").show();
    });
    
    // Error callback function -- displays error message in alert
    var fail = function (err) {
        alert("error: "+err);
        print("Ajax fail");
    };
    
    // Retrieves the RSSI values
    WifiWizard.getScanResults({numLevels: false}, listHandler, fail);

}

//window.onload = getRSSi;
document.addEventListener("deviceready", getRSSi, false);
