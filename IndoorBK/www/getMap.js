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
      "esri.layers.FeatureLayer",
      "dojo/domReady!"
        ], function(Map, arcgisUtils, FeatureLayer,Point){
            esri.arcgis.utils.arcgisUrl = esri.arcgis.utils.arcgisUrl.replace("file:", "http:");
            arcgisUtils.createMap("8fe4439f1f8541a2964500175814eb86", "map").then(function (response) {
                
                map = response.map; 
                map.disableMapNavigation();
                map.disablePan();
                map.hideZoomSlider();
                
                var featureCollection = {
                    layerDefinition: {
                        "geometryType": "esriGeometryPoint",
                        "fields": [
                            {
                            "name": "test",
                            "type": "esriFieldTypeOID"
                            }
                      ]
                    },
                        "features": [
                            {
                                "attributes": {
                                    OBJECTID : 1
                                },
                                "geometry": { "x": 4.370802, "y": 52.005523 }
                            }
                        ]
                };
          
                var featureLayer = new esri.layers.FeatureLayer(featureCollection);
                map.addLayers([featureLayer]);
          
            });
  });
