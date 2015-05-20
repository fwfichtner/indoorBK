//
//    var map;
//  require([
//    "esri/map", 
//    "esri/layers/KMLLayer",
//    "dojo/domReady!"
//  ], function(
//    Map, 
//    KMLLayer
//  ) {
//    map = new Map("map", { 
//      basemap: "satellite",
//      center: [4.370802, 52.005523],
//      zoom: 17
//    });
//    map.on("load", function() {
//        map.disableMapNavigation();
//        map.disablePan();
//        map.hideZoomSlider();
//    });
//
//    var kmlUrl = "https://drive.google.com/uc?export=download&id=0B4QridFVh8uCR29fNXAyNGRXcDg";
//    var kml = new KMLLayer(kmlUrl); 
//    map.addLayer(kml);
//    
//
//        //"http://www.arcgis.com/apps/Embed/index.html?webmap=8fe4439f1f8541a2964500175814eb86&amp;extent=4.3684,52.0042,4.3728,52.007&amp;zoom=true&amp;scale=true&amp;theme=light",
//
//  });

var map;
    require([
      "esri/map",
      "esri/arcgis/utils",
      "esri/layers/KMLLayer",
      "dojo/domReady!"
        ], function(Map, arcgisUtils, KMLLayer){
            esri.arcgis.utils.arcgisUrl = esri.arcgis.utils.arcgisUrl.replace("file:", "http:");
            arcgisUtils.createMap("8fe4439f1f8541a2964500175814eb86", "map").then(function (response) {
                map = response.map; 
            });
//          var kmlUrl = "https://drive.google.com/uc?export=download&id=0B4QridFVh8uCR29fNXAyNGRXcDg";
//          var kml = new KMLLayer(kmlUrl); 
//          map.addLayer(kml);
  });
