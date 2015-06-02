//Lets require/import the HTTP module
var http = require('http');
var FP = require('./NodeJS_Fingerprinting.js');
var calendar = require('./NodeJS_get_calendar.js');
var fs = require('fs');
var pg = require('pg');


//Lets define a port we want to listen to
const PORT=8000;

function calcRoute(startPoint, startLine, nextEvent, source, target, destPoint, destNode, destLine, destGid, response) {
    // Calculate the route 
    var conString = "postgres://postgres:Geomatics2015!@145.97.243.61:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();
    var SQL_ID = 'gid';
    var routeQuery = "SELECT "+SQL_ID+", ST_asGeoJSON(ST_Transform(ST_SetSRID(the_geom,3857),4326)) as route FROM ways WHERE "+SQL_ID+" in (SELECT id2 AS edge FROM pgr_dijkstra ('SELECT gid AS id, source::integer, target::integer, length::double precision AS cost FROM ways', "+source+", "+target+", false, false));";  
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
            
            // Adds the computed routes to the nextEvent
            for (i = 0; i < route.length; i++) {
                route[i] = JSON.parse(route[i]);
                nextEvent.push(route[i]);
            }

            // Adds the start and end point to the linestrings
            start_parsed = JSON.parse(startPoint);
            dest_parsed = JSON.parse(destPoint);
            startLine_parsed = JSON.parse(startLine);
            destLine_parsed = JSON.parse(destLine);
 //           nextEvent[nextEvent.length - 1].coordinates.splice(0,0,dest_parsed.coordinates);
 //           nextEvent[3].coordinates.push(start_parsed.coordinates);
            
            // Adds start and end point to the route (so we can display them...)
            nextEvent.push(start_parsed);
            nextEvent.push(dest_parsed);
            nextEvent.push(startLine_parsed);
            nextEvent.push(destLine_parsed);
            nextEvent.push([destNode, destGid, target]);

            // return the calendar and route
            reply = JSON.stringify(nextEvent);
            response.write(reply);

            // everything has completed successfully
            console.log("End request");
            response.end();
        }
    });
}

function getEndlineGeom(startPoint, startLine, nextEvent, source, target, destPoint, destNode, destGid, response) {
    console.log("finding startline geometry");
    var conString = "postgres://postgres:Geomatics2015!@145.97.243.61:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();
    var startQuery = "SELECT ST_asGeoJSON(ST_Transform(ST_SetSRID(the_geom,3857),4326)) FROM ways WHERE gid = " + destGid + ";";  
    var query2 = client.query(startQuery);
    rows = [];
    
    query2.on('row', function(row) {
        rows.push(row);
    });

    query2.on('end', function() { 
        client.end();
        if (rows.length == 0) {
            console.log("Your geometry is not in the database!");
        } else {
            console.log("calculating route!");
            destLine = rows[0].st_asgeojson;
            calcRoute(startPoint, startLine, nextEvent, source, target, destPoint, destNode, destLine, destGid, response);
        }
    });
}



function getStartlineGeom(startGid, startPoint, nextEvent, source, target, destPoint, destNode, destGid, response) {
    console.log("finding startline geometry");
    var conString = "postgres://postgres:Geomatics2015!@145.97.243.61:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();
    var startQuery = "SELECT ST_asGeoJSON(ST_Transform(ST_SetSRID(the_geom,3857),4326)) FROM ways WHERE gid = " + startGid + ";";  
    var query2 = client.query(startQuery);
    rows = [];
    
    query2.on('row', function(row) {
        rows.push(row);
    });

    query2.on('end', function() { 
        client.end();
        if (rows.length == 0) {
            console.log("Your geometry is not in the database!");
        } else {
            console.log("calculating route!");
            startLine = rows[0].st_asgeojson;
            getEndlineGeom(startPoint, startLine, nextEvent, source, target, destPoint, destNode, destGid, response);
        }
    });
}


function getNodeGeom(position, startGid, nextEvent, source, target, destNode, destGid, response) {
    console.log("finding node geometry");
    var conString = "postgres://postgres:Geomatics2015!@145.97.243.61:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();
    var startQuery = "SELECT ST_asGeoJSON(ST_Transform(ST_SetSRID(geom,3857),4326)) FROM nodes WHERE id = " + position + " OR id = " + destNode + ";";  
    var query2 = client.query(startQuery);
    rows = [];
    
    query2.on('row', function(row) {
        rows.push(row);
    });

    query2.on('end', function() { 
        client.end();
        if (rows.length == 0) {
            destination = "Your geometry is not in the database!";
        } else {
            console.log("fetching line geometry!");
            startPoint = rows[0].st_asgeojson;
            destPoint = rows[1].st_asgeojson;
            getStartlineGeom(startGid, startPoint, nextEvent, source, target, destPoint, destNode, destGid, response);
        }
    });
}


function findStartline(position, nextEvent, target, destNode, destGid, response) {
    // Matches starting node to source
    console.log("finding startline");
    var conString = "postgres://postgres:Geomatics2015!@145.97.243.61:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();
    var startQuery = "SELECT source, gid FROM mappings WHERE node = " + position + ";";  
    var query2 = client.query(startQuery);
    var rows = [];
    
    query2.on('row', function(row) {
        rows.push(row);
        source = row.source;
        startGid = row.gid;
        console.log("source found!");
    });

    query2.on('end', function() { 
        client.end();
        if (rows.length == 0) {
            destination = "Your source is not in the database!";
        } else {
            console.log("calculating route!");
            getNodeGeom(position, startGid, nextEvent, source, target, destNode, destGid, response);
        }
    });
}

function findDestnode (position, nextEvent, nextLoc, response) {
    var conString = "postgres://postgres:Geomatics2015!@145.97.243.61:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();
    var query_string = "SELECT node, target, gid FROM mappings WHERE room = '" + nextLoc + "';";  
    var query = client.query(query_string);
    rows = [];
    console.log("first query done");
    
    query.on('row', function(row) {
        rows.push(row); 
        target = row.target;
        destGid = row.gid;
        destNode = row.node;
    });

    query.on('end', function() { 
        client.end();
        if (rows.length == 0) {
            destination = "Your target is not in the database!";
        } else { 
            destination = "placeholder";
            console.log("calling findline");
            findStartline(position, nextEvent, target, destNode, destGid, response);
        }
    });
}



//We need a function which handles requests and send response
function handleRequest(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	
	request.on("data", function(chunk) {
        console.log("receiving data");
        RSSI = JSON.parse(chunk);
  	});
    
    request.on("end", function() {
        console.log("All data received");
        console.log(RSSI);
        
        // Find the location of the user via WiFi Fingerprinting   
        FP.getFingerprints(RSSI, function (position, err) {
            if (err) throw err;
            
            // Get the next event from the calendar
            
            calendar.getCalendar(function callback(err, nextEvent){
                if (err) throw err;
                
 //               nextEvent = "13:00#SomeClass#BK-IZ R"
                nextEvent = nextEvent.split("#");

                // Parse Google Calendar API time to Javascript time object in milliseconds
                var nextTime = Date.parse(nextEvent[0]);
                nextEvent[0] = nextTime;

                // Matches the Calendar location to destination node
                if (RSSI[RSSI.length - 1] == "BK-IZ R") {
                    var nextLoc = "BK-IZ R";
                    nextEvent[2] = nextLoc;
                } else {
                    var nextLoc = nextEvent[2];
                }              

                if (position == -1) {
                    nextEvent.push(position);
                    response.write(JSON.stringify(nextEvent));
                    console.log("The location is not in BK!");
                    response.end();                    
                } else if (["BK-IZ R","BK-IZ Z","BK-IZ V","Bouwpub","Geolab"].indexOf(nextLoc) !== -1) {
                    findDestnode(position, nextEvent, nextLoc, response);
                } else {
                    response.write(JSON.stringify(nextEvent));
                    console.log("The destination is not in BK!");
                    response.end();
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
