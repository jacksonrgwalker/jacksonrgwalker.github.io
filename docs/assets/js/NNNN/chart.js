

// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 392 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#predictionPlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


// X axis
var x = d3.scaleBand()
    .range([0, width])
    .domain([...Array(10).keys()])
    .padding(0.5)


svg
    .append("g")
    .attr("transform", `translate(0,${height})`)      // This controls the rotate position of the Axis
    .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-size", 25)
        .style("fill", "#ffc107")
        .style('font-weight', '600')

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

// svg.append("g")
//     .attr("class", "myYaxis")
//     .call(d3.axisLeft(y));

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -margin.left+width/10)
    .attr("x", -margin.top+width/10)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .attr("fill", "#ffc107")
    .style('font-weight', 'bold')
    .text("confidence");


// A function that create / update the plot for a given variable:
function updatePlot() {

    data = window.scores

    var u = svg.selectAll("rect")
        .data(data)

    u
        .enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(100)
        .attr("x", function(d, i) {return ((i+0.5) * width/10.5);})
        .attr("y", function(d, i) {return height -  d*height})
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return  d*height })
        .attr("fill", "#ffc107")
}
