//Lets require/import the HTTP module
var http = require('http');
var FP = require('./NodeJS_Fingerprinting.js');
var calendar = require('./NodeJS_get_calendar.js');
var fs = require('fs');
var pg = require('pg');


//Lets define a port we want to listen to
const PORT=8000;

function calcRoute(nextEvent, startLine, destLine, response) {
    // Calculate the route 
    var conString = "postgres://postgres:Geomatics2015!@145.97.237.141:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();
    console.log("Start ", startLine, "End: ", destLine);
    var SQL_ID = '"Id"';
    var routeQuery = "SELECT "+SQL_ID+", ST_asGeoJSON(the_geom) as route FROM ways WHERE "+SQL_ID+" in (SELECT id1 AS node FROM pgr_dijkstra ('SELECT gid AS id, source::integer, target::integer, length::double precision AS cost FROM ways', "+startLine+", "+destLine+", false, false));";  
    var query1 = client.query(routeQuery);
    
    query1.on('row', function(row) {
        nextEvent.push(row.route);
    });

    query1.on('end', function() { 
        console.log("Received all rows, closing client");
        client.end();
        if (nextEvent.slice(3).length == 0) {
            destination = "Your route could not be computed!";
        } else {
            console.log("route computed!");

            // Send the calendar data to phone!
            var reply = nextEvent;
            response.write(JSON.stringify(reply));




            // return the route

            // everything has completed successfully
            console.log("End request");
            response.end();
        }
    });
}

function findStartline(position, nextEvent, destLine, response) {
    // Matches starting node to starting line
    console.log("finding startline");
    var conString = "postgres://postgres:Geomatics2015!@145.97.237.141:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();
    var startQuery = "SELECT neighborlines FROM mappings WHERE node = " + position + ";";  
    var query2 = client.query(startQuery);
    var rows = [];
    
    query2.on('row', function(row) {
        rows.push(row);
        startLine = row.neighborlines;
        console.log("startLine found!");
    });

    query2.on('end', function() { 
        client.end();
        if (rows.length == 0) {
            destination = "Your start location is not in the database!";
        } else {
            console.log("calculating route!");
            calcRoute(nextEvent, startLine, destLine, response);
        }
    });
}

function findDestnode (position, nextEvent, nextLoc, response) {
    var conString = "postgres://postgres:Geomatics2015!@145.97.237.141:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();
    var query_string = "SELECT node, neighborlines FROM mappings WHERE room = '" + nextLoc + "';";  
    var query = client.query(query_string);
    rows = [];
    console.log("first query done");
    
    query.on('row', function(row) {
        rows.push(row); 
        var destNode = row.node;
        destLine = row.neighborlines;
    });

    query.on('end', function() { 
        client.end();
        if (rows.length == 0) {
            destination = "Your destination is not in the database!";
        } else { 
            destination = "placeholder";
            console.log("calling findline");
            findStartline(position, nextEvent, destLine, response);
        }
    });
}



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
            
            // Get the next event from the calendar
            
            calendar.getCalendar(function callback(err, nextEvent){
                if (err) throw err;
                
                nextEvent = "13:00#SomeClass#BK-IZ R"
                nextEvent = nextEvent.split("#");

                // Parse Google Calendar API time to Javascript time object in milliseconds
                var nextTime = Date.parse(nextEvent[0]);
                nextEvent[0] = nextTime;
                console.log(nextEvent);

                // Matches the Calendar location to destination node
                var nextLoc = nextEvent[2];
                if (nextLoc.substr(0,2) == "BK") {
                    findDestnode(position, nextEvent, nextLoc, response);
                } else {
                    destination = "Your destination is not in BK!";
                }
            });
            
            
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
