//Lets require/import the HTTP module
var http = require('http');
var FP = require('./NodeJS_Fingerprinting.js');
var calendar = require('./NodeJS_get_calendar.js');
var fs = require('fs');
var pg = require('pg');


//Lets define a port we want to listen to
const PORT=8000;

function calcRoute(startPoint, nextEvent, startLine, destLine, destPoint, response) {
    // Calculate the route 
    var conString = "postgres://postgres:Geomatics2015!@145.97.243.61:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();
    console.log("Start ", startLine, "End: ", destLine);
    var SQL_ID = '"Id"';
    var routeQuery = "SELECT "+SQL_ID+", ST_asGeoJSON(ST_Transform(ST_SetSRID(the_geom,3857),4326)) as route FROM ways WHERE "+SQL_ID+" in (SELECT id1 AS node FROM pgr_dijkstra ('SELECT gid AS id, source::integer, target::integer, length::double precision AS cost FROM ways', "+startLine+", "+destLine+", false, false));";  
    var query1 = client.query(routeQuery);
    route = [];
    
    query1.on('row', function(row) {
        route.push(row.route);
    });

    query1.on('end', function() { 
        console.log("Received all rows, closing client");
        client.end();
        if (route.length == 0) {
            destination = "Your route could not be computed!";
        } else {
            console.log("route computed!");
            
            // Adds the route to the nextevent array, then creates JSON
            start_parsed = JSON.parse(startPoint);
            dest_parsed = JSON.parse(destPoint);
            route_parsed = JSON.parse(route[0]);
            route_parsed.coordinates.splice(0,0,start_parsed.coordinates);
            route_parsed.coordinates.push(dest_parsed.coordinates);
            nextEvent.push(route_parsed);
            reply = JSON.stringify(nextEvent);
            console.log(reply);

            // return the calendar and route
            response.write(reply);

            // everything has completed successfully
            console.log("End request");
            response.end();
        }
    });
}

function getNodeGeom(position, nextEvent, startLine, destLine, destNode, response) {
    console.log("finding node geometry");
    var conString = "postgres://postgres:Geomatics2015!@145.97.243.61:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();
    var startQuery = "SELECT ST_asGeoJSON(ST_Transform(ST_SetSRID(the_geom,3857),4326)) FROM ways_vertices_pgr WHERE id = " + position + " OR id = " + destNode + ";";  
    var query2 = client.query(startQuery);
    rows = [];
    
    query2.on('row', function(row) {
        rows.push(row);
        console.log(rows);
    });

    query2.on('end', function() { 
        client.end();
        if (rows.length == 0) {
            destination = "Your geometry is not in the database!";
        } else {
            console.log("calculating route!");
            startPoint = rows[0].st_asgeojson;
            destPoint = rows[1].st_asgeojson;
            calcRoute(startPoint, nextEvent, startLine, destLine, destPoint, response);
        }
    });
}


function findStartline(position, nextEvent, destLine, destNode, response) {
    // Matches starting node to starting line
    console.log("finding startline");
    var conString = "postgres://postgres:Geomatics2015!@145.97.243.61:5432/postgres";
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
            getNodeGeom(position, nextEvent, startLine, destLine, destNode, response);
        }
    });
}

function findDestnode (position, nextEvent, nextLoc, response) {
    var conString = "postgres://postgres:Geomatics2015!@145.97.243.61:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();
    var query_string = "SELECT node, neighborlines FROM mappings WHERE room = '" + nextLoc + "';";  
    var query = client.query(query_string);
    rows = [];
    console.log("first query done");
    
    query.on('row', function(row) {
        rows.push(row); 
        destNode = row.node;
        destLine = row.neighborlines;
    });

    query.on('end', function() { 
        client.end();
        if (rows.length == 0) {
            destination = "Your destination is not in the database!";
        } else { 
            destination = "placeholder";
            console.log("calling findline");
            findStartline(position, nextEvent, destLine, destNode, response);
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
                
  //              nextEvent = "13:00#SomeClass#BK-IZ R"
                nextEvent = nextEvent.split("#");
                console.log(nextEvent);

                // Parse Google Calendar API time to Javascript time object in milliseconds
                var nextTime = Date.parse(nextEvent[0]);
                nextEvent[0] = nextTime;

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
