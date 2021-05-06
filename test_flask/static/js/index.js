

// var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
// });
   

// var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "dark-v10",
//     accessToken: API_KEY
// });
  
// var waterColor = L.tileLayer.provider('Stamen.Watercolor');
  
// var nasa = L.tileLayer.provider('NASAGIBS.ViirsEarthAtNight2012');
  
// // Only one base layer can be shown at a time
// var baseMaps = {
//     Street: streetmap,
//     Dark: dark,
//     Water: waterColor,
//     Nasa: nasa
// };
  
// // Create a map object
// var myMap = L.map("map", {
//     center: [37.09, -95.71],
//     // center: [40.7128, -74.0059],
//     zoom: 4,
//     layers:[streetmap]
// });



// var link = "/static/data/us_counties.json";
var link = "static/data/us_states.json";
// var link = "static/data/us_congressional.json";

// Function to generate random color codes //
function randomColors(n) {
      var color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      return color;
};

// d3.csv("static/data/state_coordinates.csv").then(function(stateCoord) {
//   console.log(stateCoord)
//   // for (i=0; i < stateCoord.length; i++) {
//   //   console.log(stateCoord[i].name);
//   // };
// });

// MSA Json data
d3.json("/data").then(function(data) {
  // console.log(data.data.killed)
  // Grabbing our GeoJSON data..
  d3.json(link).then(function(geoData) {
    // State coordinates
    d3.csv("static/data/state_coordinates.csv").then(function(stateCoord) {

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });
   

    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
    });
  
    var waterColor = L.tileLayer.provider('Stamen.Watercolor');
  
    var nasa = L.tileLayer.provider('NASAGIBS.ViirsEarthAtNight2012');
  
    // Only one base layer can be shown at a time
    var baseMaps = {
        Street: streetmap,
        Dark: dark,
        Water: waterColor,
        Nasa: nasa
    };

    // console.log(data)
    // console.log(data[0].incident_date.slice(0,4))
    // Grab all unique states values to create a dropdown menu
    var states = []
    for (var i=0;i<data.length;i++){
      var currentState = data[i].state
      if (!states.includes(currentState)) {
          // Add an all option to array
          if (i === 0) {
            states.push("-All-")
          }
          states.push(currentState)
      }
    };
    // Sort States Array
    var sortedStates = states.sort()

    // Update HTML by adding States to drop down menu
    sortedStates.forEach((value) => {
      var option = d3.select('select').append('option');
      option.attr('value', value);
      option.text(value);
    });
    // console.log(sortedStates)

    // -------------------------------------------------- //
    //              Incident Cluster Markers              //
    // -------------------------------------------------- //

    // Create a new marker cluster group
    // var markers = L.markerClusterGroup();
    // var markers = L.markerClusterGroup({
    //   spiderfyOnMaxZoom: true,
    //   showCoverageOnHover: true,
    //   zoomToBoundsOnClick: true
    // });

    var shootingsMarkers = []
    for (var i = 0; i < data.length; i++) {
      var lat = +data[i].latitude;
      var lng = +data[i].longitude;
      var coordinates = [lat, lng];
      // console.log(coordinates)

      // Add a new marker to the cluster group and bind a pop-up
      // markers.addLayer(L.marker([lat, lng])
      //   .bindPopup(data[i].address));
      shootingsMarkers.push(L.marker([lat, lng])
      .bindPopup(data[i].address));
      // .addTo(myMap);

    }
    // Create layer groups:
    var shootings = L.layerGroup(shootingsMarkers);

    // Create a map object
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      // center: ["42.407211", "-71.382437"],
      zoom: 4,
      layers:[streetmap, shootings]
    });

    var overlayMaps = {
      Shootings: shootings,
    };
    
    // Add our marker cluster layer to the map
    // myMap.addLayer(markers);

    // Creating a geoJSON layer with the retrieved data
    L.geoJson(geoData, {
      // Passing in our style object
      style: function (feature) {
        return {
        color:"white",
        fillColor: randomColors(feature.features),
        fillOpacity: 0.5,
        weight: 1.5
      };
    }
    }).addTo(myMap);
  
  

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    // Default State
    // console.log(d3.select('#selDataset').property("value"))

    // Event listeners
    // d3.select('#selDataset').on("change", stateSelection);
    d3.select('#selDataset').on("change", updateMap);



    function updateMap(){
      // console.log(d3.select('#selDataset').property("value"))
      var selection = d3.select('#selDataset').property("value")
      console.log(selection)
      for (i=0; i < stateCoord.length; i++){
        if (selection === stateCoord[i].name){
          var coordinate = [stateCoord[i].latitude, stateCoord[i].longitude];
          var zoom = 8
          console.log(coordinate);
        }
        else if (selection === '-All-') {
          console.log('Entire country selected');
          var coordinate = [37.09, -95.71];
          var zoom = 4;
        }
      }
    };




    }); //StateCoord
  });//geoJson
}); //msa data

// Zoom in on Map depending on user selection
function stateSelection(states){
  console.log(d3.select(this).property("value"))
  // console.log(d3.select('#selDataset').property("value"))
};

//

// function updateMap(data, geoData, stateCoord){
//   console.log(d3.select('#selDataset').property("value"))
  
//   // var selection = d3.select('#selDataset').property("value")
//   // console.log(selection)
//   // var coordinates = stateSelection()
//   // var names = states.map(function(data) {
//   //   return data.name;
//   // });
//   // for (i=0; i < stateCoord.length; i++){
//   //   if (selection === stateCoord[i].name){
//   //     console.log(coordinate = [stateCoord[i].latitude, stateCoord[i].longitude]);
//   //   }
//   //   else if (selection === '-All-') {
//   //     console.log('Entire country selected');
//   //   }
//   // }
// };




// // Event listeners
// d3.select('#selDataset').on("change", stateSelection);
// d3.select('#selDataset').on("change", updateMap);
// d3.select(window).on('load', stateSelection);


// d3.select('#selDataset').property("value").on('change', function(){
//   var id = d3.select(this)
//   console.log(id.property("value"))
// });

  





























// var myMap = L.map("map", {
//     center: [45.52, -122.67],
//     zoom: 13
//   });
  
//   // Adding a tile layer (the background map image) to our map
//   // We use the addTo method to add objects to our map
//   L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
//   }).addTo(myMap);
  