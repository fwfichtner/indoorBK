//Lets require/import the HTTP module
var http = require('http');
var FP = require('./NodeJS_Fingerprinting.js');
var calendar = require('./NodeJS_get_calendar.js');
var fs = require('fs');
var pg = require('pg');


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

            calendar.getCalendar();
            var nextEvent = fs.readFileSync('./test.txt').toString();
            nextEvent = nextEvent.split("#");

            var nextTime = nextEvent[0].substr(11,19);
            nextEvent[0] = nextTime;
            var nextLoc = nextEvent[2];

            if (nextLoc.substr(0,2) == "BK") {
                var conString = "postgres://postgres:Geomatics2015!@localhost:5432/postgres";
                var client = new pg.Client(conString);
                client.connect();
                var query_string = "SELECT node FROM mappings WHERE room = '" + nextLoc + "';";  
                var query = client.query(query_string);
                var rows = [];
                
                query.on('row', function(row) {
                    rows.push(row);
                    var node = row.node;
                });

                query.on('end', function() { 
                    if (rows.length == 0) {
                        destination = "Your destination is not in the database!";
                    } else {
                        destination = "placeholder";
                    }
                });

            } else {
                destination = "Your destination is not in BK!";
            }

 //           var reply = "You are located at node: " + position + "| Your next event is: " + nextEvent + "Your destination is: " + destination;
            var reply = nextEvent;
            response.write(JSON.stringify(reply));
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
