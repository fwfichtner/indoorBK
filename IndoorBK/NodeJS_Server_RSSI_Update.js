//Lets require/import the HTTP module
var http = require('http');
var FP = require('./NodeJS_Fingerprinting.js');
var fs = require('fs');
var pg = require('pg');


//Lets define a port we want to listen to
const PORT=8080;

function calcRoute(startPoint, startLine, source, target, destPoint, response) {
    // Calculate the route 
    var conString = "postgres://postgres:Geomatics2015!@145.97.243.61:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();
    var SQL_ID = 'gid';
    var routeQuery = "SELECT "+SQL_ID+", ST_asGeoJSON(ST_Transform(ST_SetSRID(the_geom,3857),4326)) as route FROM ways WHERE "+SQL_ID+" in (SELECT id2 AS edge FROM pgr_dijkstra ('SELECT gid AS id, source::integer, target::integer, length::double precision AS cost FROM ways', "+source+", "+target+", false, false));";  
    var query1 = client.query(routeQuery);
    route = [];
    nextEvent = [];
    
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
 //           nextEvent[nextEvent.length - 1].coordinates.splice(0,0,dest_parsed.coordinates);
 //           nextEvent[3].coordinates.push(start_parsed.coordinates);
            
            // Adds start and end point to the route (so we can display them...)
            nextEvent.push(start_parsed);
            nextEvent.push(dest_parsed);
            nextEvent.push(startLine_parsed);

            // return the updated route
            reply = JSON.stringify(nextEvent);
            response.write(reply);

            // everything has completed successfully
            console.log("End request");
            response.end();
        }
    });
}

function getStartlineGeom(startGid, startPoint, source, target, destPoint, response) {
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
            calcRoute(startPoint, startLine, source, target, destPoint, response);
        }
    });
}


function getNodeGeom(position, startGid, source, target, destNode, response) {
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
            getStartlineGeom(startGid, startPoint, source, target, destPoint, response);
        }
    });
}


function findStartline(position, target, destNode, response) {
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
            getNodeGeom(position, startGid, source, target, destNode, response);
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

        destNode = RSSI[RSSI.length - 2];
        target = RSSI[RSSI.length - 1];
        
        // Find the location of the user via WiFi Fingerprinting   
        FP.getFingerprints(RSSI.slice(0,RSSI.length - 2), function (position, err) {
            if (err) throw err;
               
                if (position == -1) {
                    reply = [position];
                    response.write(JSON.stringify(reply));
                    console.log("The location is not in BK!");
                    response.end();                    
                } else {
                    findStartline(position, target, destNode, response);
                }
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
