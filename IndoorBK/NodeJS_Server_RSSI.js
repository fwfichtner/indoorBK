//Lets require/import the HTTP module
var http = require('http');
<<<<<<< HEAD

//Lets define a port we want to listen to
const PORT=8000; 
=======
var FP = require('./NodeJS_Fingerprinting.js');
var calendar = require('./NodeJS_get_calendar.js');

//Lets define a port we want to listen to
const PORT=8000;
>>>>>>> origin/master

//We need a function which handles requests and send response
function handleRequest(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	
	request.on("data", function(chunk) {
<<<<<<< HEAD
	console.log(JSON.parse(chunk));
    response.write("Success!");
  	});
    
    request.on("end", function() {
    response.end();
=======
        console.log("receiving data");
        RSSI = JSON.parse(chunk);
        console.log(RSSI);
  	});
    
    request.on("end", function() {
        console.log("All data received");
        
        // Find the location of the user via WiFi Fingerprinting
        
        FP.getFingerprints(RSSI, function (position, err) {
            if (err) throw err;
            
            console.log("callback");
            
            response.write(position);
            
            // Get the next event from the calendar
//            event = calendar.getCalendar();
//            console.log(event);
//            
            // Geocode the event location 


            // calculate the route 


            // return the route

            // everything has completed successfully
            console.log("End request");
            response.end();

            
            
            });
        
       
        
    
>>>>>>> origin/master
  	});
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
