/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 var map;
  require([
    "esri/map", 
    "esri/layers/KMLLayer",
    "dojo/domReady!"
  ], function(
    Map, 
    KMLLayer
  ) {
    map = new Map("map", { 
      basemap: "satellite",
      center: [4.370802, 52.005523],
      zoom: 17
    });
    map.on("load", function() {
        map.disableMapNavigation();
        map.disablePan();
        map.hideZoomSlider();
    });

    var kmlUrl = "https://drive.google.com/uc?export=download&id=0B4QridFVh8uCR29fNXAyNGRXcDg";
    var kml = new KMLLayer(kmlUrl); 
    map.addLayer(kml);
  });