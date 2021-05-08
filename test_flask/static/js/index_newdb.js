// var link = "/static/data/us_counties.json";
var link = "static/data/us_states.json";
// var link = "static/data/us_congressional.json";

// Function to generate random color codes //
function randomColors(n) {
      var color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      return color;
};

function getColor(d) {
  return d > 20  ? '#581845' :
         d > 15  ? '#900C3F' :
         d > 10  ? '#C70039' :
         d > 5  ? '#FF5733' :
                  '#FFC305';
}

function getPoverty(name, data) {
  for (i=0; i < data.length; i++) {
    if (name === data[i].state) {
      var value = parseFloat(data[i]['poverty_rates'])
      return value
    }
  }
}


function getFillColor(name, data) {
  povertyData = getPoverty(name, data);

  return povertyData > 20  ? '#581845' :
         povertyData > 15  ? '#900C3F' :
         povertyData > 10  ? '#C70039' :
         povertyData > 5  ? '#FF5733' :
                            '#FFC305';
  }

      //----------------------------------------------//
      //               Line Plot - Plotly             //
      //----------------------------------------------//









// MSA Json data
d3.json("/msa").then(function(data) {
  console.log(data[0].latitude)
  // console.log(data)
  // Grabbing our GeoJSON data..
  d3.json(link).then(function(geoData) {
    // console.log(geoData.features[0].properties.NAME);
    // console.log(geoData.features[0]);
    // State coordinates
    d3.csv("static/data/state_clean.csv").then(function(stateCoord) {
      // d3.csv("/state").then(function(stateCoord) {
        console.log(stateCoord);

      // Poverty data
      // d3.csv("static/data/poverty_data_cleaned.csv").then(function(povertyData) {
      d3.csv("/poverty").then(function(povertyData) {
        // var a = parseFloat(povertyData[0]['2019_poverty'])
        // var b = parseFloat(povertyData[1]['2019_poverty'])
        // console.log(a + b)

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
        var currentState = data[i].state[0]
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
      var markers = L.markerClusterGroup();

      // // Create layer support group 
      // var mcgLayerSupportGroup = L.markerClusterGroup.layerSupport(options);

      // var markers = L.markerClusterGroup({
      //   spiderfyOnMaxZoom: true,
      //   showCoverageOnHover: true,
      //   zoomToBoundsOnClick: true
      // });

      var shootingsMarkers = []
      for (var i = 0; i < data.length; i++) {
        console.log(i)
        var lat = parseFloat(data[i].latitude);
        var lng = parseFloat(data[i].longitude);
        var coordinates = [lat, lng];
        // console.log(coordinates)

        // Add a new marker to the cluster group and bind a pop-up
        // markers.addLayer(L.marker([lat, lng])
        //   .bindPopup(data[i].address));
        shootingsMarkers.push(L.marker([lat, lng])
        .bindPopup(data[i].address).update());
        // .addTo(myMap);

      }
      // Create layer groups:
      var shootings = L.layerGroup(shootingsMarkers);

      ///////////////////////////////////////
      /////////////////Legend///////////////
      var legend = L.control({position: 'bottomright'});
      // Create legend
      legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 5, 10, 15, 20],
          labels = [];

      // Loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
  };

      ////////////////////////////////////////



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
      var stateLayer = L.geoJson(geoData, {
        // Passing in our style object
        style: function (feature) {
          return {
          color:"white",
          // fillColor: randomColors(feature.features),
          fillColor:getFillColor(feature.properties.NAME, povertyData),
          fillOpacity: 0.5,
          weight: 1.5
        };
      }
      }).addTo(myMap);
    
      // Add legend to map
      legend.addTo(myMap);

      // Pass our map layers into our layer control
      // Add the layer control to the map
      var controller = L.control.layers(baseMaps, overlayMaps).addTo(myMap);

      // // //----------------------------------------------//
      // // //               Line Plot - Plotly             //
      // // //----------------------------------------------//
      

      










      //----------------------------------------------//
      //----------------------------------------------//

      // Default State
      // console.log(d3.select('#selDataset').property("value"))

      // Event listeners
      // d3.select('#selDataset').on("change", stateSelection);
      d3.select('#selDataset').on("change", updateMap);



      function updateMap(){
        var countiesJson = "/static/data/us_counties.json";
        d3.json(countiesJson).then(function(counties) {

          // console.log(d3.select('#selDataset').property("value"))
          var selection = d3.select('#selDataset').property("value")
          var defaultCoord = [37.09, -95.71];
          for (i=0; i < stateCoord.length; i++){
            if (selection === stateCoord[i].state){
              var coordinate = [stateCoord[i].latitude, stateCoord[i].longitude];
              var zoom = 7;
              // console.log(selection);
              // console.log(coordinate);
              // console.log(i)
              break
              
            }
            else if (selection === '-All-') {
              var coordinate = defaultCoord;
              var zoom = 4;
              console.log('Entire country selected');
              console.log(defaultCoord);
              // console.log(i)
              break
            }
          }
          // myMap.flyToBounds(coordinate, [50, 50])
          myMap.flyTo(coordinate, zoom)
          // myMap.panTo(coordinate, zoom)
          // myMap.setView(coordinate, zoom)
          // console.log('found value')

          myMap.removeControl(controller);
          myMap.removeLayer(shootings);
          myMap.removeLayer(stateLayer);
          // shootingsMarkers.clearLayers();
          var shootingsMarkersUpdated = [];
          for (var i = 0; i < data.length; i++) {
            lat = +data[i].latitude;
            lng = +data[i].longitude;
            if (selection === data[i].state) {
              // console.log(data[i].state)
              shootingsMarkersUpdated.push(L.marker([lat, lng])
              .bindPopup(data[i].address));
              // console.log(shootingsMarkers)
            }
            else if (selection === '-All-') {
              shootingsMarkersUpdated.push(L.marker([lat, lng])
              .bindPopup(data[i].address));
            }
          }
          
          // console.log(geoData.features[0].properties.NAME)
          console.log(counties)
          console.log(geoData)
          
          // Grab state ID to select counties when a state is selected by user
          for (i=0; i < geoData.features.length; i++) {
            if (selection === geoData.features[i].properties.NAME){
              var stateId = geoData.features[i].properties.STATE
            }
          }
          
          if (selection !== '-All-') {
            stateLayer = L.geoJson(counties, {
              // Passing in our style object
              style: function (feature) {
                // if the state name in the geojson file matches the user selection then draw it on the map
                if (feature.properties.STATE === stateId) {
                  console.log(feature)
                  return {
                    color:"black",
                    fillColor: randomColors(feature.features),
                    fillOpacity: 0.5,
                    weight: 1.5
                    };
                }
            /////////////////////////////////////
            // 100% functional for state layer
            // stateLayer = L.geoJson(geoData, {
            //   // Passing in our style object
            //   style: function (feature) {
            //     // if the state name in the geojson file matches the user selection then draw it on the map
            //     if (feature.properties.NAME === selection) {
            //       console.log("This is the data")
            //       console.log(feature)
            //       return {
            //         color:"black",
            //         // fillColor: randomColors(feature.features),
            //         fillColor:getFillColor(feature.properties.NAME, povertyData),
            //         fillOpacity: 0.5,
            //         weight: 1.5
            //         };
            //     }
                //////////////////////////////////////////////////
                // if values not found the L.geoJson will use a default line thickness (weight ~1.5), color (blue), fillcolor (blue)
                // and fillOpacity (~0.5). To avoid this I set color and fillcolor to none.
                else {
                  return {
                    color:"none",
                    fillColor: "none",
                    };
                }
              }
              }).addTo(myMap);
          } // end if
          else if (selection === '-All-') {
            stateLayer = L.geoJson(geoData, {
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
          } //end else if

          // Create layer groups:
          shootings = L.layerGroup(shootingsMarkersUpdated);
          myMap.addLayer(shootings);
          overlayMaps = {
            Shootings: shootings,
          };
          controller = L.control.layers(baseMaps, overlayMaps).addTo(myMap);

        }); //counties geoJson
      }; // function



      }); //Poverty Data
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