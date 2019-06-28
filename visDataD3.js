var dateParse = d3.timeParse("%Y-%m-%m");
var fileName = 'https://gist.githubusercontent.com/radhika-sivarajan/d78e4444edf3816fb0c3d939da9bc3ed/raw/6ecaa93312d3c629d89f416343867fbb7f7108e4/datasrc.csv';

var margin = { top: 30, right: 50, bottom: 30, left: 50 };
var svgWidth = 700 - margin.left - margin.right;
var svgHeight = 500 - margin.top - margin.bottom;
var padding = 0.25;

var canvas = d3.select('.bar-diagram')
    .append('svg')
    .attr('width', svgWidth + margin.left + margin.right)
    .attr('height', svgHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Readd csv file
d3.csv(fileName).then(function(data) {
    makeOptions(data);
    makeVisChart(data);
});

function makeOptions(csvData) {

    // Get platform names
    var allPlatform = [];
    var uniquePlatform = [];
    csvData.forEach(function(d) {
        allPlatform.push(d.Platform);
    });
    uniquePlatform = [...new Set(allPlatform)];

    // Make drop-down list for selecting platform
    var platformMenu = d3.select("#selectPlatform");
    platformMenu.selectAll("option")
        .data(uniquePlatform)
        .enter()
        .append("option")
        .attr("value", function(d) { return d; })
        .text(function(d) { return d; });
    platformMenu.on("change", function(d) {
        var selectedPlatforms = d3.select("#selectPlatform").node().value;
        console.log(selectedPlatforms);
    })
}

function makeVisChart(data) {

    // Scale the range of the data
    var xScale = d3.scaleBand()
        .range([0, svgWidth], .1)
        .domain(d3.range(0, data.length + 1));

    var yScale = d3.scaleLinear()
        .range([svgHeight, 0])
        .domain([d3.min(data, function(d) { return d.Value; }), d3.max(data, function(d) { return d.Value; })]);

    canvas.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('data', function(d) {
            return parseInt(d.Value);
        })
        .attr('width', xScale.bandwidth())
        .attr('height', function(d) {
            return (yScale(0) - yScale(parseInt(d.Value)));
        })
        .attr('x', function(d, i) {
            return xScale(i);
        })
        .attr('y', function(d) {
            return yScale(parseInt(d.Value));
        })
        .attr('fill', 'green');

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Add the X Axis
    canvas.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + svgHeight + ")")
        .call(xAxis);

    // Add the Y Axis
    canvas.append("g")
        .attr("class", "y axis")
        .call(yAxis);

}