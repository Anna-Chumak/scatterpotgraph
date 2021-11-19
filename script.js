document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const dataset = data;
      console.log(dataset);
      //values for measurments
      const w = 840;
      const h = 490;
      const padding = 40;
      const radius = 5;

      //value for years (x-axis)
      const years = dataset.map(function (item) {
        return item.Year;
      });
      console.log(years);

      //values for time (y-axis)
      const times = dataset.map(function (item) {
        var parsedTime = item.Time.split(":");
        return new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
      });
      console.log(years);

      var tooltip = d3
        .select(".chart")
        .append("div")
        .attr("id", "tooltip")
        .attr("width", "60px")
        .attr("height", "40px")
        .style("font-size", "12px")
        .style("display", "none");

      const xScale = d3
        .scaleLinear()
        .domain([d3.min(years), d3.max(years)])
        .range([padding, w - padding]);

      const yScale = d3
        .scaleTime()
        .domain(
          d3.extent(dataset, function (d, i) {
            return times[i];
          })
        )
        .range([padding, h - padding]);

      const svg = d3
        .select(".chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      svg
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("data-xvalue", function (d, i) {
          return d.Year;
        })
        .attr("data-yvalue", function (d, i) {
          var parsedTime = d.Time.split(":");
          return new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
        })
        .attr("cx", (d, i) => xScale(years[i]))
        .attr("cy", (d, i) => yScale(times[i]))
        .attr("r", radius)
        .attr("class", "dot")
        .style("fill", (d) => {
          if (d.Doping === "") {
            return "#17ff78";
          }
          return "#33adff";
        })
        .on("mouseover", (event, d) => {
          event.target.style.fill = "red";
          tooltip
            .attr("data-year", event.target.dataset.xvalue)
            .attr("data-xvalue", d.Time)
            .style("display", "block")
            .html(
              `<p>Year: ${d.Year}</p>
                  <p>Time: ${d.Time}</p>
                  <p>Name: ${d.Name}</p>`
            )
            .style("top", h - 100 + "px");
        })
        .on("mouseout", (event, d) => {
          event.target.style.fill = "#33adff";
          tooltip.style("display", "none");
        });

      const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));

      const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

      svg
        .append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .attr("id", "x-axis")
        .call(xAxis);
      svg
        .append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .attr("id", "y-axis")
        .call(yAxis);

      const legend = d3.select("svg").append("g").attr("id", "legend");

      svg
        .select("#legend")
        .append("circle")
        .attr("cx", 550)
        .attr("cy", 130)
        .attr("r", 6)
        .style("fill", "#17ff78");
      svg
        .select("#legend")
        .append("circle")
        .attr("cx", 550)
        .attr("cy", 160)
        .attr("r", 6)
        .style("fill", "#33adff");
      svg
        .select("#legend")
        .append("text")
        .attr("x", 570)
        .attr("y", 130)
        .text("No allegations of using doping")
        .style("font-size", "15px")
        .attr("alignment-baseline", "middle");
      svg
        .select("#legend")
        .append("text")
        .attr("x", 570)
        .attr("y", 160)
        .text("Known allegations of using doping")
        .style("font-size", "15px")
        .attr("alignment-baseline", "middle");
    });
});
