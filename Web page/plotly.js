    Plotly.d3.csv(`final_msa.csv`, function(number_killedData) {
      console.log("number_killedData: ", number_killedData);
           
      //This array holds all the incident dates in an array
      var incidentDates = number_killedData.map(row => row.incident_date)
      // console.log("Array of dates", incidentDates)
      var stateID = number_killedData.map(row => row.state)
    // // //   //////////////////TEST
    // // //   const dateArray = []

    // // //   let hold = 0
    // // //   for(let i = 0; i <= incidentDates.length; i++) {
        
    // // //     if (incidentDates[i] != hold) {
    // // //       // dateArray.push(incidentDates[i])
    // // //       dateArray.push(hold)
    // // //       hold = incidentDates[i]
    // // //     }
    // // //   }
    // // //   console.log(dateArray)
    // ///////////////////////////////////
    //   ////////////// Line CHART /////////
    //   ///////////////////////////////////

      var total_killed_arr = [] // total kills per year
      var year_arr = []

     var prev_year = 2021
     var total_killed = 0
      for(var i = 0; i < number_killedData.length; i++) {
        year = parseInt(number_killedData[i].incident_date)
        console.log(year)
        if (prev_year == year) {
          total_killed += parseInt(number_killedData[i].number_killed)
        }
        else {
          total_killed_arr.push(total_killed)
          total_killed = 0
          console.log(total_killed_arr)
          prev_year = year
        }
    
      
        // Build line chart
	        var trace1 = {
          x: ['2021', '2020', '2019', '2018', '2017', '2016',],
          y: total_killed_arr,
        
        };
        var data = [trace1];
        var layout = {
            title: "Mass Shooting Rates from 2017 to 2021",
            xaxis: { title: "Incident Date"},
            yaxis: { title: "Number Killed"}
        };
        Plotly.newPlot("line", data, layout);        
      };
    });
    //   ///////////////////////////////////
    //   ////////////// BAR CHART /////////
    //   ///////////////////////////////////
      
      
    //   // var first_state = 'Alabama'
    //   // var killed = 0 
    //   // for(var i = 0; i < number_killedData.length; i++) {
    //   //   states = number_killedData[i].state
    //   //   // console.log(states)
    //   //   if (first_state === states && incidentDates === 2020) {
    //   //     // killed += parseInt(number_killedData[i].number_killed)
    //   //   }
    //   //   else {
    //   //     state_arr.push(killed)
    //   //     killed = 0
    //   //     console.log(state_arr)
    //   //     first_state = states
    //   //   }
    //   // }

      
      // var state_arr = [] // holds all the states
      // // Loop through the csv to return all states in dataset in year 2020
      // for(var i = 0; i < number_killedData.length; i++) {
      //   allStates = number_killedData[i].state
        
      //   // Conditional statement showing each state in year 2020
      //   if (number_killedData[i].incident_date === "2020" && !state_arr.includes(allStates)) {
      //     state_arr.push(allStates)
      //     state_arr.sort()
      //   }        
      // };
      // console.log("States Array",state_arr)
      // //[Alabama, Arkansa, Delaware]
      // //[90]

      // var numberStateDeaths = [] // total # of deaths per state in year 2020
      // var totalDeaths = 0

      // for(var i = 0; i < state_arr.length; i++) {
      //   for(j = 0; j < number_killedData.length; j++) {
      //     // if (number_killedData[j].incident_date === "2020" && state_arr.includes(number_killedData[j].state)) {
      //     if (number_killedData[j].incident_date === "2020" && number_killedData[j].state === state_arr[i]) {
      //     totalDeaths += parseInt(number_killedData[j].number_killed)
      //       console.log("Total deaths",totalDeaths)
      //     }
      //     numberStateDeaths.push(totalDeaths)
      //   }
      // }
      // console.log("State Deaths", numberStateDeaths)
    
      //   // Build bar chart
      //   var myPlot = document.getElementById('bar'),
      //   data = [{
      //           x: state_arr,
      //           y: numberStateDeaths, //[1, 4, 2, 5]
      //           type: "bar",
      //           marker: {
      //               color: 'light blue'
      //           },
      //       }]
      //       layout = {
      //           title: "Mass Shootings By state in 2020",
      //           xaxis: { 
      //               tickangle: 40,
      //               tickfont: {
      //                   size: 9.5
      //               }
      //           },
      //           yaxis: {title: "Mass Shootings"},
      //           hovermode: 'closest'
      //       };

      //   Plotly.newPlot("bar", data, layout);
      //     });
  //   function buildCharts(year) {
  //     // TO DO: Iterate through all states
  
  //     d3.json("final_msa.json", function(yearData) {
  //         console.log(year);
  
  //         // Cast rates as numbers
  
  //         console.log('year data', yearData);
          
  //         // Build line chart
  //       var trace1 = {
  //             x: stateData.incident_date,
  //             y: stateData.number_killed,
  //             type: "line",
  //         };
  //         var data = [trace1];
  //         var layout = {
  //             title: "Mass Shooting Rates from 2016 - 2021",
  //             xaxis: { title: "Year"},
  //             yaxis: { title: "Number of People Killed"}
  //         };
  //         Plotly.newPlot("line", data, layout);        
  //     });
  
  //     // Build map with static data from 2016
  
  //     d3.json("final_msa.json", function(stateData) {
  //         console.log('2016 data', stateData)
  
  
  //         // Build bar chart
  //         var myPlot = document.getElementById('bar'),
  //             data = [{
  //                 x: stateData.states,
  //                 y: stateData.number_killed,
  //                 type: "bar",
  //                 marker: {
  //                     color: 'light blue'
  //                 },
  //             }];
  //             layout = {
  //                 title: "Mass Shooting Rates by State",
  //                 xaxis: { 
  //                     tickangle: 40,
  //                     tickfont: {
  //                         size: 9.5
  //                     }
  //                 },
  //                 yaxis: {title: "Number of People Killed"},
  //                 hovermode: 'closest'
  //             };
  
  //         Plotly.newPlot("bar", data, layout);
  
  //     });
      
  // }
  
//   function init() {      

//     // Set up the dropdown menu
//     // Grab a reference to the dropdown select element
//     var selector = d3.select("#selDataset");

//     // Use the list of sample names to populate the select options
//     d3.json("final_msa.json").then((year) => {
//         year.forEach((instance) => {
//         selector
//             .append("option")
//             .text(instance)
//             .property("value", instance);
//         });

//         // Use Alabama to build the initial plot
//         const defaultYear = year[0];
//         buildCharts(defaultyear);
//     });
// }

// function optionChanged(newYear) {
//     // Fetch new data each time a new state is selected
//     buildCharts(newYear);
// }

// init();
