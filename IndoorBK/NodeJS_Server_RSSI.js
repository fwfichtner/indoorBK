//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT=8000; 

//We need a function which handles requests and send response
function handleRequest(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	
	request.on("data", function(chunk) {
	console.log(JSON.parse(chunk));
    response.write("Success!");
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