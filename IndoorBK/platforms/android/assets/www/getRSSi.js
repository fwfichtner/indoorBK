//Here we should write the module that retrieves the RSSi values of the WiFi 
//networks and sends it to the server. 
// https://github.com/parsonsmatt/WifiWizard

function getRSSi(){
    // Call the print function to add text to the HTML div with the "nextAppoint" id in index.html
    var print = function(text) {
        $("#nextAppoint").html(text);
    }
<<<<<<< HEAD
    
    if (WifiWizard){
        // Check the results of the getScanResults
        var listHandler = function (list) {
            alert("listHandler");
            
             /*
             * Here we need to select the five networks with the highest signal
             * strength and send it to the server.
             * 
             */
            
            var stringNetworks = new String();
            
            for (var i = 0; i < list.length; i++) {
                var network = "SSID: " + list[i].SSID + " RSSI: " + list[i].level + "\n";
                stringNetworks += network;
            }
            
            print(stringNetworks);
            

        };
        
        // Check the results of startScan and call getScanResults
        var win = function(list) {
            print(list);
            /*
             * Here we have a list of networks at our disposal. I don't know 
             * if it's necessary to call this function, but that's something we
             * should figure out with some actual results
             * 
             */
        };
=======

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
            alert(threshValue);
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
      

        // The following translates the objects to a string which can be printed
        // into the html page        
        var stringNetworks = new String();
>>>>>>> origin/master
        
        for (var i = 0; i < listObjects.length; i++) {
            var network = "SSID: " + listObjects[i].SSID + " RSSI: " + listObjects[i].level + "\n";
            stringNetworks += network;
        }
        
<<<<<<< HEAD
        // call startScan
        var options = {"numLevels": false};
        WifiWizard.startScan(win, fail);
        WifiWizard.getScanResults(options, listHandler, fail);
=======
        print(stringNetworks); 

    };
       
    // Error callback function -- displays error message in alert
    var fail = function (err) {
        alert("error: "+err);
        print("FAHRRAD ZURUCK BITTE!!");
    };
    
    // Retrieves the RSSI values
    WifiWizard.getScanResults({numLevels: false}, listHandler, fail);
>>>>>>> origin/master

}

window.onload = getRSSi;
//document.addEventListener("deviceready", getRSSi, false);
