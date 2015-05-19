var http = require("http");

var RSSI = [
    { level : -58.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5E-69-21" },
    { level : -58.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-40" },
    { level : -57.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5E-69-20" },
    { level : -57.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-41" },
    { level : -56.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-42" }
    ];

var request = http.request({
  hostname: "localhost",
  port: 8000,
  method: "POST"
}, function(response) {
  response.on("data", function(chunk) {
    process.stdout.write(chunk.toString());
  });
});
request.end(JSON.stringify(RSSI));