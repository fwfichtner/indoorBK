/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var map;

require(["esri/map", "dojo/domReady!"], function(Map) {
    map = new Map("map", {
    basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
    center: [-122.45, 37.75], // longitude, latitude
    oom: 13
    });
});
