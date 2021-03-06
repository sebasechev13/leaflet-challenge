// Create the tile layer that will be the background of our map
var queryUrl =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
// create api call to the eathrquak website  


var circles = []
// Define streetmap and darkmap layers
  
circle_group = L.layerGroup(circles)

var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.run-bike-hike",
      accessToken: API_KEY
    });
    var comic = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.high-contrast",
      accessToken: API_KEY
    });
    var satilite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets-satellite",
      accessToken: API_KEY
    });

  
    // Define a baseMaps object to hold our base layers
var earthquakes =  new L.LayerGroup();
var tectonicplates = new L.layerGroup();

;
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -105.71
      ],
      zoom: 5,
      layers: []
    });
    
    earthquakes.addTo(myMap)

    //add our street map to map
    comic.addTo(myMap);

    //creating the base maps of the different maps 
    var baseMaps ={
      "Satellite" : satilite,
      "Comic": comic,
      "Light":light
    
    }
    //create an overlays object to add to the layer control
    var overlays = {
      "Earthquakes": earthquakes,
      "Tectonicplates" : tectonicplates
    };

    // Create a layer control
    L.control.layers(null,overlays).addTo(myMap);
    L.control.layers(baseMaps).addTo(myMap);
    // Create a legend to display information about our map


    d3.json(queryUrl, function(data) {


      // Once we get a response, send the data.features object to the createFeatures function
      data.features.forEach(earthquake =>{
  
          var newCircle = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]] , {
            fillOpacity: 1,
            weight: 1,
            color: "Black",
            fillColor: color_c(earthquake.properties.mag),
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its population
            radius: markerSize(earthquake.properties.mag)
            
          })
          newCircle.bindPopup("<h1>Location:" + earthquake.properties.place + "</h1> <hr> <h3>Magnitued of the earthquake: " + earthquake.properties.mag + "</h3>");
          newCircle.addTo(earthquakes)
          //create the legend!

        })

        // an object legend
    
    });


    
    circle_group = L.layerGroup(circles)
  function markerSize(magnitude) {
    if(magnitude === 0){
      return 1*10000
    }

    return magnitude * 10000;
  }
  function color_c(magnitude) {
   
      if (magnitude >5 ){
          return color = "DarkRed "
      }
      if (magnitude >4){
          return color = "Red "
      }
      if (magnitude >3 ){
          return color = "Orange" 
      }
      if (magnitude >2 ){
        return color = "Yellow" 
    }
      else {
          return color = "GreenYellow"
      }
  }
  
  var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + color_c(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {
 
      L.geoJson(platedata, {
        color: "orange",
        weight: 2
      })
      .addTo(tectonicplates);

      // add the tectonicplates layer to the map.
      tectonicplates.addTo(myMap);
    });