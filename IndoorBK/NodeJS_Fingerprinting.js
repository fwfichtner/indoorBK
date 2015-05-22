exports.getFingerprints = function (RSSI, callback) {
//    //test dummy SSID WRONG!!!
//    var RSSI = [
//    { level : -58.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5E-69-21" },
//    { level : -58.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-40" },
//    { level : -57.0, SSID: "tudelft-dastud", BSSID : "00-22-90-5E-69-20" },
//    { level : -57.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-41" },
//    { level : -56.0, SSID: "TUvisitor", BSSID : "00-22-90-38-AE-42" }
//    ];

    loc_code = -1; 

    function parse_RSSI_log (RSSI){
        var arr_mac = [];
        var arr_strength = [];
        for (i = 0; i < RSSI.length; i++){
            arr_mac.push(RSSI[i].BSSID);
            arr_strength.push(Math.abs(RSSI[i].level))
        };

        //build query
        var part0 = "SELECT locations, groeperen, max(minimum) FROM (SELECT locations, groeperen, minimum FROM ("
        var part1 = "SELECT DISTINCT(tweede.loc) AS locations, sum(tellen) AS groeperen, count(loc) AS minimum FROM ("
        var part2 = "select loc, abs(signalstrength + "+arr_strength[0]+") as tellen from avg_fp where macadress = '"+arr_mac[0]+"' union all select loc, abs(signalstrength + "+arr_strength[1]+") as tellen from avg_fp where macadress = '"+arr_mac[1]+"' union all select loc, abs(signalstrength + "+arr_strength[2]+") as tellen from avg_fp where macadress = '"+arr_mac[2]+"' union all select loc, abs(signalstrength + "+arr_strength[3]+") as tellen from avg_fp where macadress = '"+arr_mac[3]+"' union all select loc, abs(signalstrength + "+arr_strength[4]+") as tellen from avg_fp where macadress = '"+arr_mac[4]+"'"
        var part3 = ") AS tweede GROUP BY tweede.loc ORDER BY groeperen) AS foo) AS b GROUP BY locations, groeperen ORDER BY max DESC, groeperen ASC LIMIT 1;"
        var main_query = part0 + part1 + part2 + part3
        //console.log(main_query)
        return main_query
    }



    function get_loc (RSSI){
        var main_query = parse_RSSI_log(RSSI)

        //connect to database
        var pg = require('pg');
        var conString = "postgres://postgres:Geomatics2015!@145.97.237.141:5432/postgres";

        var client = new pg.Client(conString);
        client.connect();

        var query = client.query(main_query);

        var rows = [];
        //fired after last row is emitted
        query.on('row', function(row) {
            //console.log(row);
            rows.push(row);
        });

        query.on('end', function() { 
            if (rows.length == 0) {
                loc_code = "You are not in BK!";
            } else {
                loc_code = rows[0].locations;
            }
            
            //console.log("FP: ",loc_code); 
            callback(loc_code);
            client.end();
        });
        
        
    }

    get_loc(RSSI);
}