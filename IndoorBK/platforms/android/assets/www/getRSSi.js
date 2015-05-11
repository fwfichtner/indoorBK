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
        print("check WifiWizard")
        // Check the results of the getScanResults
        var listHandler = function (list) {
            alert("listHandler");
        };
        
        // Check the results of startScan and call getScanResults
        var win = function(list) {
            alert("win");
            WifiWizard.getScanResults({numLevels: false}, listHandler, fail);
        };
        
        // Error callback function
        var fail = function (err) {
            alert("error: "+err);
        };
        
        // call startScan
        WifiWizard.startScan(win, fail);

    } else {
        // The module WifiWizard is not found
        alert("no WifiWizard"); 
    }
}

window.onload = getRSSi;
//document.addEventListener("deviceready", getRSSi, false);
