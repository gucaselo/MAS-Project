// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Configure a parseTime function which will return a new Date object from a string
// var parseTime = d3.timeParse("%B");
var d = new Date("incident_date")
var parseTime = d.getFullYear();

d3.csv("final_msa.csv").then(function(msaData) {
    msaData.forEach(function(data){
        data.number_killed = +data.number_killed;
        data.incident_date = parseTime(data.incident_date);
    });

    var xTimeScale = d3.scaleTime()
    .range([0, chartWidth])
    .domain(d3.extent(msaData, data => data.incident_date));

    var yLinearScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([0, d3.max(msaData, data => data.number_killed)]);

    var bottomAxis = d3.axisBottom(xTimeScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var drawLine = d3
    .line()
    .x(data => xTimeScale(data.incident_date))
    .y(data => yLinearScale(data.number_killed));

    // Append an SVG path and plot its points using the line function
  chartGroup.append("path")
  // The drawLine function returns the instructions for creating the line 
  .attr("d", drawLine(msaData))
  .classed("line", true);

// Append an SVG group element to the SVG area, create the left axis inside of it
chartGroup.append("g")
  .classed("axis", true)
  .call(leftAxis);

// Append an SVG group element to the SVG area, create the bottom axis inside of it
// Translate the bottom axis to the bottom of the page
chartGroup.append("g")
  .classed("axis", true)
  .attr("transform", "translate(0, " + chartHeight + ")")
  .call(bottomAxis);
}).catch(function(error) {
console.log(error);
});