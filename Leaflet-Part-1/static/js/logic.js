// Define the url for the GeoJSON the past 7 Days of earthquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Creating the map object
let myMap = L.map("map", {
    center: [41.15,-116.65],
    zoom: 5
  });

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Map Style
function chooseColor(depth) {
  if (depth < 10) return "rgb(163,246,0)";
  else if (depth <30 ) return "rgb(230,244,0)"; 
  else if (depth <50) return "rgb(247,219,17)";
  else if (depth<70) return"rgb(253,183,42)";
  else if (depth <90) return "rgb(252,155,75)"; 
  else return "rgb(225,87,91)";
};

// Getting our GeoJSON data
d3.json(url).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data,{
      pointToLayer: function (data, latlng) {
        return L.circleMarker(latlng, {
          radius: (data.properties.mag) *5,
          fillColor: chooseColor(data.geometry.coordinates[2]),
          color: "black",
          weight: 1,
          fillOpacity: 0.8
        });
      }
    }).bindPopup(function(layer){
        let place = `<h3>${layer.feature.properties.place}</h3><hr>`;
        let time = `<li>Date/Time: ${new Date(layer.feature.properties.time)}</li>`;
        let depth = `<li>Depth: ${layer.feature.geometry.coordinates[2]} km</li>`;
        let mag = `<li>Magnitude: ${layer.feature.properties.mag} ml</li>`;
        let textPop = place+"<p><ul>"+time+depth+mag +"</ul></p>";
      return textPop;
    }).addTo(myMap);

    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function(myMap) {
       let div = L.DomUtil.create("div", "info legend"),
        depthRange = [-10,10,30,50,70,90];
      
     //Legend Header
     div.innerHTML ="<strong>Depth (km)</strong><br>";
 
     //Legend Key
     for(let i=0; i<depthRange.length;i++){
      div.innerHTML +=
      '<i style="background:' + chooseColor(depthRange[i] + 1) + '"></i> ' +
          depthRange[i] + (depthRange[i + 1] ? ' &ndash; ' + depthRange[i + 1] + '<br>' : '+');
    }

     return div;
};

// Adding the legend to the map
legend.addTo(myMap);


});