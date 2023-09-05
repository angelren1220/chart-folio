import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import fetchData from '../hooks/fetchData';

const MapChart = () => {

  const [title, setTitle] = useState("");
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

      const counties = topojson.feature(mapData, mapData.objects.counties).features;
      const path = d3.geoPath();

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
          const county = eduData.find(c => c.fips === d.id);
          return county ? colorScale(county.bachelorsOrHigher) : "#EEE";
        });
    }
  }, [eduData, mapData]);

  return (
    <div className='chart-container'>
      <h2 className='chart-title'>Map Chart</h2>
      <svg ></svg>
    </div>
  );
};

export default MapChart;
