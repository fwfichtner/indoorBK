//Lets require/import the HTTP module
var http = require('http');
// var FP = require('./NodeJS_Fingerprinting.js');

//Lets define a port we want to listen to
const PORT=8000; 
RSSI = [];
position = [];

//We need a function which handles requests and send response
function handleRequest(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	
	request.on("data", function(chunk) {
        //data = JSON.parse(chunk);
        console.log("hoi");
  	});
    
    request.on("end", function() {
        // Find the location of the user via WiFi Fingerprinting
        // position = FP(RSSI);
        // response.write("Success!");   
        // console.log(position);
        
        // Get the next event from the calendar

        // calculate the route 

        // return the route
        console.log("end");
        
        response.end();
  	});
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

