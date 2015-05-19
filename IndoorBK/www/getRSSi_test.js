<html>
    <head>
        <link href="jquery.mobile-1.4.5.min.css" rel="stylesheet" type="text/css"/>
        <script src="jquery.min.js" type="text/javascript"></script>
        <script src="jquery.mobile-1.4.5.min.js" type="text/javascript"></script>
    </head>  
    <body>    
        <script>
            var RSSI = [
            { level : -58.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5E-69-21" },
            { level : -58.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-40" },
            { level : -57.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5E-69-20" },
            { level : -57.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-41" },
            { level : -56.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-42" }
            ];



            $.ajax({
            url: 'http://localhost:8000',
            data: JSON.stringify(RSSI),
            contentType: 'application/json',
            type: 'POST',      
            success: function (data) {
                // Should we return current location as well?
                console.log(data);
            },
            error: function (xhr, status, error) {
                alert('Error: ' + error.message);
            }
            });
        </script>
    </body>
</html>
