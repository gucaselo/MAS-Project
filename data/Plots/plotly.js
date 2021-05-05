// var trace1 = {
//     x: ["beer", "wine", "martini", "margarita",
//       "ice tea", "rum & coke", "mai tai", "gin & tonic"],
//     y: [22.7, 17.1, 9.9, 8.7, 7.2, 6.1, 6.0, 4.6],
//     type: "bar"
//   };
  
//   var data = [trace1];
  
//   var layout = {
//     title: "'Bar' Chart"
//   };
  
//   Plotly.newPlot("plot", data, layout);

function buildCharts(state) {
    // TO DO: Iterate through all states

    // Plotly.d3.csv(`final_msa.csv${number_killed}`, function(number_killedData) {
    //     console.log(number_killedData);
    d3.json("final_msa.csv", function(number_killedData) {
        console.log(state);

        console.log('number killed data', number_killedData);
        
        // Build line chart
	    var trace1 = {
            x: number_killedData.incident_date,
            y: number_killedData.number_killed,
            type: "line",
        };
        var data = [trace1];
        var layout = {
            title: `${state} Number Killed`,
            xaxis: { title: "Incident Date"},
            yaxis: { title: "Number Killed"}
        };
        Plotly.newPlot("line", data, layout);        
    });


        // Build bar chart
        var myPlot = document.getElementById('bar'),
            data = [{
                x:number_killedData.state,
                y:number_killedData.number_killed,
                type: "bar",
                marker: {
                    color: 'light blue'
                },
            }];
            layout = {
                title: "Mass Shootings By state in 2021",
                xaxis: { 
                    tickangle: 40,
                    tickfont: {
                        size: 9.5
                    }
                },
                yaxis: {title: "Mass Shootings"},
                hovermode: 'closest'
            };

        Plotly.newPlot("bar", data, layout);

;

function init() {      

    // Set up the dropdown menu
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json(`final_msa.csv`).then((state) => {
        state.forEach((instance) => {
        selector
            .append("option")
            .text(instance)
            .property("value", instance);
        });

        // Use Alabama to build the initial plot
        const defaultState = state[0];
        buildCharts(defaultState);
    });
}

function optionChanged(newState) {
    // Fetch new data each time a new state is selected
    buildCharts(newState);
}

init();
