const d3 = require('d3');
const {sankey: Sankey, sankeyLinkHorizontal} = require('d3-sankey');
const _ = require('lodash');

// set the dimensions and margins of the graph
const height = 600;
const width = 975

// Color scale used
const color = d3.scaleOrdinal(d3.schemeCategory10);

const f = d3.format(",.0f");
const edgeColor = "none";

const data = {
  "nodes":[],
  "links":[]
};

function updateChart() {
  try{

    if (data.nodes.length === 0 || data.links.length === 0) return;

    // remove svg to reset
    d3.select("svg").remove();

    // append the svg object to the body of the page
    var svg = d3.select("#mySankey").append("svg")
      .attr("viewBox", [0, 0, width, height]);

    // Set the sankey diagram properties
    var sankey = Sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 5], [width - 1, height - 5]])
      .nodeId((d) => d.id);

    const {nodes, links} = sankey(_.cloneDeep(data));
      
    // NODES
    svg.append("g")
        .attr("stroke", "#000")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => color(d.name))
      .append("title")
        .text(d => `${d.name}\n${`$${f(d.value)}`}`);

    // LINKS
    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
      .selectAll("g")
      .data(links)
      .join("g")
        .style("mix-blend-mode", "multiply");

    if (edgeColor === "path") {
      const gradient = link.append("linearGradient")
          .attr("id", d => (d.uid = DOM.uid("link")).id)
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", d => d.source.x1)
          .attr("x2", d => d.target.x0);

      gradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", d => color(d.source.name));

      gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", d => color(d.target.name));
    }

    link.append("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("stroke", d => edgeColor === "none" ? "#aaa"
            : edgeColor === "path" ? d.uid 
            : edgeColor === "input" ? color(d.source.name) 
            : color(d.target.name))
        .attr("stroke-width", d => Math.max(1, d.width));

    link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${`$${f(d.value)}`}`);

    svg.append("g")
        .style("font", "10px sans-serif")
      .selectAll("text")
      .data(nodes)
      .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name);
  } catch(e) {
    console.log(e);
  }
}


/**
 * Updates
 */
ipcRenderer.on('nodes', (event, nodes) => {
  console.log('renderer - chart - nodes');

  data.nodes = nodes.map((node) => ({ 
    name: node.name,
    id: node.id,
  }));
  
  updateChart();
})

ipcRenderer.on('transactions', (event, transactions) => {
  console.log('renderer - chart - transactions');

  data.links = transactions.map((transaction) => ({ 
    source: transaction.source,
    target: transaction.target,
    value: transaction.amount,
  }));
  
  updateChart();
})