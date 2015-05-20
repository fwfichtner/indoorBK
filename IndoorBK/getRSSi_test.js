var http = require("http");

var RSSI = [
    { level : -58.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5e-69-21" },
    { level : -58.0, SSID: "TUvisitor", BSSID : "00-22-90-38-ae-40" },
    { level : -57.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5e-69-20" },
    { level : -57.0, SSID: "TUvisitor", BSSID : "00-22-90-38-ae-41" },
    { level : -56.0, SSID: "TUvisitor", BSSID : "00-22-90-38-ae-42" },
    ];

    for (i = 0; i < RSSI.length; i++){
      RSSI[i].BSSID = RSSI[i].BSSID.toUpperCase();
    }

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