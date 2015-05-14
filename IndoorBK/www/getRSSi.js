//Here we should write the module that retrieves the RSSi values of the WiFi 
//networks and sends it to the server. 
// https://github.com/parsonsmatt/WifiWizard

function getRSSi(){
    // Call the print function to add text to the HTML div with the "nextAppoint" id in index.html
    var print = function(text) {
        $("#nextAppoint").html(text);
    }

    // Check the results of the getScanResults
    var listHandler = function (list) {      
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
       
    // Error callback function -- displays error message in alert
    var fail = function (err) {
        alert("error: "+err);
        print("FAHRRAD ZURUCK BITTE!!");
    };
    
    // Retrieves the RSSI values
    WifiWizard.getScanResults({numLevels: false}, listHandler, fail);

}

window.onload = getRSSi;
//document.addEventListener("deviceready", getRSSi, false);
