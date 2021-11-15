const MOVIE_SALES_DATA_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

d3.json(MOVIE_SALES_DATA_URL)
  .then((data) => callback(data))
  .catch((err) => console.log(err));

function callback(data) {
  const svgWidth = 1000;
  const svgHeight = 600;

  const canvas = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  const tooltip = d3
    .select("main")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  let hierarchy = d3
    .hierarchy(data, (node) => node.children)
    .sum((node) => node.value)
    .sort((node1, node2) => node2.value - node1.value);

  let createTreeMap = d3.treemap().size([1000, 600]);
  createTreeMap(hierarchy);

  let movieTileData = hierarchy.leaves();

  let blocks = canvas
    .selectAll("g")
    .data(movieTileData)
    .enter()
    .append("g")
    .attr("transform", (movie) => {
      return "translate(" + movie.x0 + ", " + movie.y0 + ")";
    });

  let tiles = blocks
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (movie) => {
      let category = movie.data.category;
      if (category === "Action") {
        return "#F2C14E";
      } else if (category === "Drama") {
        return "#788AA3";
      } else if (category === "Adventure") {
        return "#92B6B1";
      } else if (category === "Family") {
        return "#EE6C4D";
      } else if (category === "Animation") {
        return "#E8DDB5";
      } else if (category === "Comedy") {
        return "#B2C9AB";
      } else if (category === "Biography") {
        return "#F4C095";
      }
    })
    .attr("data-name", (movie) => movie.data.name)
    .attr("data-category", (movie) => movie.data.category)
    .attr("data-value", (movie) => movie.data.value)
    .attr("width", (movie) => movie.x1 - movie.x0)
    .attr("height", (movie) => movie.y1 - movie.y0)
    .on("mousemove", (event, movie) => {
      tooltip.style("opacity", 0.8);

      let revenue = movie.data.value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      tooltip
        .html(
          "<strong>" +
          movie.data.name +
          "</strong>" +
          "<br> " +
          movie.data.category +
          " • " +
          "$" +
          revenue
        )
        .attr("data-value", movie.data.value)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 80 + "px");
    })
    .on("mouseout", (movie) => {
      tooltip.style("opacity", 0);
    })

  let tileText = blocks
    .append("text")
    .attr("class", "tile-text")
    .text((movie) => movie.data.name)
    .attr("x", 5)
    .attr("y", 20);
}