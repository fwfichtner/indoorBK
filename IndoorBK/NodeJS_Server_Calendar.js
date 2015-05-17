//Lets require/import the HTTP module and Calendar module
var http = require('http');
var calendar = require('./NodeJS_get_calendar.js')
var fs = require('fs');

//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	
	request.on("data", function(chunk) {
	  console.log('cal request received');
    calendar.getCalendar();
    var nextEvent = fs.readFileSync('./test.txt').toString();
    response.write(nextEvent);
  	});
    
  request.on("end", function() {
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