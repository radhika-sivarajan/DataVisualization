var dateParse = d3.timeParse("%Y-%m-%m");

var margin = { top: 30, right: 20, bottom: 30, left: 50 };
var svgWidth = 700
var svgHeight = 500;

var canvas = d3.select('.bar-diagram')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleBand()
  .range([0, svgWidth]);

var yScale = d3.scaleLinear()
  .range([svgHeight, 0]);

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

d3.csv('https://gist.githubusercontent.com/radhika-sivarajan/d78e4444edf3816fb0c3d939da9bc3ed/raw/6ecaa93312d3c629d89f416343867fbb7f7108e4/datasrc.csv').then(function (data) {

  // Scale the range of the data
  xScale.domain(d3.range(0, data.length + 1));
  yScale.domain([d3.min(data, function (d) { return d.Value; }), d3.max(data, function (d) { return d.Value; })]);

  canvas.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('data', function (d) {
      return parseInt(d.Value);
    })
    .attr('width', xScale.bandwidth())
    .attr('height', function (d) {
      return (yScale(0) - yScale(parseInt(d.Value)));
    })
    .attr('x', function (d, i) {
      return xScale(i);
    })
    .attr('y', function (d) {
      return yScale(parseInt(d.Value));
    })
    .attr('fill', 'green');

  // Add the X Axis
  canvas.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + svgHeight + ")")
    .call(xAxis);

  // Add the Y Axis
  canvas.append("g")
    .attr("class", "y axis")
    .call(yAxis);
});