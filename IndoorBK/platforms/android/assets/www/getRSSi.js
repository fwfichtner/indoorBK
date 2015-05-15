/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Here we should write the module that retrieves the RSSi values of the WiFi 
//networks and sends it to the server. 

// https://github.com/parsonsmatt/WifiWizard
// from WifiWizard we should use: WifiWizard.getScanResults([options], listHandler, fail);

function getRSSi(){
    // Call the print function to add text to the HTML div with the "nextAppoint" id in index.html
    var print = function(text) {
        $("#nextAppoint").html(text);
    }
    
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
        
        // Error callback function
        var fail = function (err) {
            // Here the error is displayed in an alert
            alert("error: "+err);
            print("FAHRRAD ZURUCK BITTE!!");
        };
        
        // call startScan
        var options = {"numLevels": false};
        WifiWizard.startScan(win, fail);
        WifiWizard.getScanResults(options, listHandler, fail);

    } else {
        // The module WifiWizard is not found
        print("no WifiWizard"); 
    }
}

window.onload = getRSSi;
//document.addEventListener("deviceready", getRSSi, false);
