var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = 1100 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var xValue = function(d) { return d['Sp. Def'];}, 
    xScale = d3.scale.linear().range([0, width]), 
    xMap = function(d) { return xScale(xValue(d));}, 
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

var yValue = function(d) { return d["Total"];}, 
    yScale = d3.scale.linear().range([height, 0]), 
    yMap = function(d) { return yScale(yValue(d));}, 
    yAxis = d3.svg.axis().scale(yScale).orient("left");

var colors = ["#4E79A7", "#A0CBE8", "#F28E2B", "#FFBE7D", "#59A14F", "#8CD17D", 
              "#B6992D", "#499894", "#86BCB6", "#FABFD2", "#E15759", "#FF9D9A",
              "#79706E", "#BAB0AC", "#D37295"];

var cValue = function(d) { return d["Type 1"];},
    color = d3.scale.ordinal()
    .range(colors);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)

d3.csv("pokemon.csv", function(error, data) {
    data.forEach(function(d) {
        d['Sp. Def'] = +d['Sp. Def'];
        d["Total"] = +d["Total"];
        d["Generation"]  = +d["Generation"];
    });

  xScale.domain([0, 220]);
  yScale.domain([0, 800]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Sp. Def");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Total");

  // draw dots
  svg.selectAll(".dot") 
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 6)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));}) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["Name"] + "<br/>" + d["Type 1"] + "<br/>" + d["Type 2"])
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  var legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})     
    
   makeGenerationFilterSection();
   makeLegendaryFilterSection();

});

function makeGenerationFilterSection() {
    const filter_section = d3.select('body').append('div')
      .styles({ display: 'inline', position: 'absolute', margin: '10px', top: '180px' });
    filter_section.append('p').html('Generation (group):');
    const filter_select = filter_section.append('select');

    filter_select.append('option').property('value', 0).text('(All)');
    filter_select.append('option').property('value', 1).text('1');
    filter_select.append('option').property('value', 2).text('2');
    filter_select.append('option').property('value', 3).text('3');
    filter_select.append('option').property('value', 4).text('4');
    filter_select.append('option').property('value', 5).text('5');
    filter_select.append('option').property('value', 6).text('6');

    filter_select.on('change', function () {
      const val = +this.value;
      d3.selectAll('circle')
        .style("opacity", 0)
        .filter(function (d) { return d['Generation'] > 0;})
        .style("opacity", 1);
      if (val > 0) {
        svg.selectAll('circle')
          .style("opacity", 0)
          .filter(function (d) { return d['Generation'] === val;})
          .style("opacity", 1);
        }
    });
}

function makeLegendaryFilterSection() {
    const filter_section = d3.select('body').append('div')
      .styles({ display: 'inline', position: 'absolute', margin: '10px', top: '240px' });
    filter_section.append('p').html('Legendary:');
    const filter_select = filter_section.append('select');

    filter_select.append('option').property('value', 0).text('(All)');
    filter_select.append('option').property('value', 1).text('False');
    filter_select.append('option').property('value', 2).text('True');

    filter_select.on('change', function () {
      const val = +this.value;
      if (val === 0) {
        d3.selectAll('circle')
        .style("opacity", 0)
        .filter(function (d) { return d['Legendary'] === 'True' || 'False';})
        .style("opacity", 1);
      } else if (val === 1) {
        svg.selectAll('circle')
          .style("opacity", 0)
          .filter(function (d) { return d['Legendary'] === 'False';})
          .style("opacity", 1);
      } else {
        svg.selectAll('circle')
          .style("opacity", 0)
          .filter(function (d) { return d['Legendary'] === 'True';})
          .style("opacity", 1);
      }
    });
}