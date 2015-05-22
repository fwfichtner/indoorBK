//Lets require/import the HTTP module
var http = require('http');
var FP = require('./NodeJS_Fingerprinting.js');
var calendar = require('./NodeJS_get_calendar.js');
var fs = require('fs');

//Lets define a port we want to listen to
const PORT=8000;

//We need a function which handles requests and send response
function handleRequest(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	
	request.on("data", function(chunk) {
        console.log("receiving data");
        RSSI = JSON.parse(chunk);
        console.log(RSSI);
  	});
    
    request.on("end", function() {
        console.log("All data received");
        
        // Find the location of the user via WiFi Fingerprinting   
        FP.getFingerprints(RSSI, function (position, err) {
            if (err) throw err;
//            response.write("You are located at node: " + position);
            
            // Get the next event from the calendar
//            calendar.getCalendar();
//            var nextEvent = fs.readFileSync('./test.txt').toString();
//            console.log(nextEvent);
            
            var nextevent = "App building course!!";
            reply = "You are located at node: " + position + "|" + nextEvent;
            response.write(reply);
//            
            // Geocode the event location 


            // calculate the route 


            // return the route

            // everything has completed successfully
            console.log("End request");
            response.end();
            
            });   
  	});
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
