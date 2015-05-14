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
<<<<<<< HEAD
            print(list.toString());
=======
            var stringNetworks = new String();
            
            for (var i = 0; i < list.length; i++) {
                network = "SSID: " + list[i].SSID + " RSSI: " + list[i].level + "\n";
                stringNetworks += network;
            }
            
            print(stringNetworks);
>>>>>>> origin/master
            
            /*
             * Here we need to select the five networks with the highest signal
             * strength and send it to the server.
             * 
             */
        };
        
        // Check the results of startScan and call getScanResults
        var win = function(list) {
<<<<<<< HEAD
            alert("win");
=======
>>>>>>> origin/master
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
         /*
         * Here we need to select the five networks with the highest signal
         * strength and send it to the server.
         * 
         */
        
        var stringNetworks = new String();
>>>>>>> origin/Tom
        
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
