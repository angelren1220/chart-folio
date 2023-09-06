import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import fetchData from '../hooks/fetchData';
import '../styles/mapchart.scss';

const MapChart = () => {

  const [eduData, setEduData] = useState([]);
  const [mapData, setMapData] = useState(null);

  const dataLinks = [
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json",
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
  ];

  // fetch and parse data
  useEffect(() => {
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
      const width = 960;
      const height = 600;

      const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);


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
  }, [eduData, mapData]);

  return (
    <div className='chart-container'>
      <h2 className='chart-title'>United States Educational Attainment</h2>
      <div id="description">
        Percentage of adults age 25 and older with a bachelor's degree or higher
        (2010-2014)
      </div>
      <svg ></svg>
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

export default MapChart;
