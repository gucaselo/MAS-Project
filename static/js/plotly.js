    Plotly.d3.csv("static/data/final_msa.csv", function(number_killedData) {
      console.log("number_killedData: ", number_killedData);
           
      //This array holds all the incident dates in an array
      var incidentDates = number_killedData.map(row => row.incident_date)
      // console.log("Array of dates", incidentDates)
      var stateID = number_killedData.map(row => row.state)

      var total_killed_arr = [] // total kills per year
      var year_arr = []

     var prev_year = 2021
     var total_killed = 0
      for(var i = 0; i < number_killedData.length; i++) {
        year = parseInt(number_killedData[i].incident_date)
        // console.log(year)
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