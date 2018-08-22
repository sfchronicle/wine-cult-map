
require("./ca.js")
const d3 = require('d3');
const L = require('leaflet');



const heatmap = d3.select('#time-heatmap')
const weekschart = d3.select('#weeks-chart')
const areaStyle = { 
  weight: 1,
  color: 'white',
  fillColor: "#ff0808",
  fillOpacity: 0.4,
  dashArray: 3
}

var markerOptions = {
    radius: 8,
    fillColor: "#ff0808",
    color: "white",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.4,
    dashArray: 3
};


var max_zoom_deg = window.innerWidth > 600 ? 16 : 15;
var min_zoom_deg = window.innerWidth > 600 ? 14 : 13;
//const voronoiRadius = 100
/*var corner1 = L.latLng(38.117916, -122.967946),
corner2 = L.latLng(37.443776, -121.403753),
bounds = L.latLngBounds(corner1, corner2);*/

// initialize map with center position and zoom levels
const map = L.map("map-leaflet", {
	center: [39.329571, -121.250342],
	zoom: 13.5,
	zoomSnap: 0,
  minZoom: min_zoom_deg,
  maxZoom: max_zoom_deg,
  //maxBounds: bounds,
  scrollWheelZoom: false,
});

map.zoomControl.setPosition('topright');


L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
}).addTo(map)

L.geoJson(oregon_house, {
	pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, markerOptions);
  },
	style: function (feature) {
		switch (feature.geometry.type) {
			case 'Polygon': 
				return areaStyle
		}
	},
	onEachFeature: function (feature, layer) {
		layer.bindPopup(`<div class="feature-name">${feature.properties.name}</div>${feature.properties.description}`);
	}
}).addTo(map);

var marker13 = new L.marker([39.344858,-121.265116], { opacity: 0.01 }); //opacity may be set to zero
marker13.bindTooltip("Oregon House", {permanent: true, className: "my-label", offset: [0, 0] });
marker13.addTo(map);



