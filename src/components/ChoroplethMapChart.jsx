import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import fetchData from '../hooks/fetchData';
import '../styles/mapchart.scss';

const ChoroplethMapChart = () => {

  const [eduData, setEduData] = useState([]);
  const [mapData, setMapData] = useState(null);

  // Universal dimensions
  const w = 1200; // Total width
  const h = 600;  // Total height
  const margin = { top: 10, right: 30, bottom: 60, left: 60 };

  // Calculated width and height
  const width = w - margin.left - margin.right;
  const height = h - margin.top - margin.bottom;

  const svgRef = useRef(null);


  // fetch and parse data
  useEffect(() => {
    const dataLinks = [
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json",
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
    ];
    Promise.all([
      fetchData(dataLinks[0]),
      fetchData(dataLinks[1])
    ]).then(([edu, map]) => {
      setEduData(edu);
      setMapData(map);
    }).catch(err => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    if (eduData && mapData) {


      const svg = d3.select(svgRef.current)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);



      // Convert the topojson map data to geojson format.
      // geometric features of the counties to plot on the map.
      const counties = topojson.feature(mapData, mapData.objects.counties).features;
      const path = d3.geoPath();

      // Create a color scale to visualize the education data.
      // This determines the color of each county based on the percentage of residents with a bachelor's degree or higher.
      const colorScale = d3.scaleThreshold()
        .domain([10, 20, 30, 40, 50, 60, 70, 80, 90])
        .range(d3.schemeBlues[9]);

      svg.selectAll("path")
        .data(counties)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("d", path)
        .attr("fill", d => {
          // Find the matching county in the education data using the 'fips' identifier.
          const county = eduData.find(c => c.fips === d.id);
          return county ? colorScale(county.bachelorsOrHigher) : "#EEE";
        })
        // add tooltip event
        .on("mouseover", (event, d) => {
          // show tooltip
          const county = eduData.find(c => c.fips === d.id);

          if (county) {

            d3.select(event.currentTarget)
              .classed("map-highlighted", true);

            d3.select(".tooltip")
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 28) + "px")
              .style("display", "inline-block")
              .html(`${county.area_name}, ${county.state}, ${county.bachelorsOrHigher}%`);
          }
        })
        .on("mouseout", (event) => {
          // hide tooltip on mouseout
          d3.select(event.currentTarget)
            .classed("map-highlighted", false);
          d3.select(".tooltip")
            .style("display", "none");
        });


      // create the legend
      const legendWidth = 300;
      const legendHeight = 10;
      const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${(width - legendWidth) / 2}, 20)`);
      // create the legend's colored rectangles
      legend.selectAll("rect")
        .data(colorScale.range())
        .enter()
        .append("rect")
        .attr("width", legendWidth / colorScale.range().length)
        .attr("height", legendHeight)
        .attr("x", (d, i) => i * (legendWidth / colorScale.range().length))
        .attr("fill", d => d);

      //add tick marks to the legend
      legend.selectAll("text")
        .data(colorScale.domain())
        .enter()
        .append("text")
        .attr("x", (d, i) =>
          i * (legendWidth / colorScale.range().length))
        .attr("y", legendHeight + 10)
        .text(d => `${Math.round(d)}%`)
        .style("font-size", "10px")
        .style("text-anchor", "start");
    }
  }, [eduData, mapData, height, margin.left, margin.top, width]);

  return (
    <div className='chart-container'>
      <h2 className='chart-title'>United States Educational Attainment</h2>
      <div className="chart-description">
        Percentage of adults age 25 and older with a bachelor's degree or higher
        (2010-2014)
      </div>
      <svg ref={svgRef} width={w} height={h}></svg>
      <div className='tooltip' style={{
        position: "absolute",
        display: "none",
        background: "#f9f9f9",
        padding: "5px",
        border: "1px solid #ccc"
      }}></div>
    </div>
  );
};

export default ChoroplethMapChart;
