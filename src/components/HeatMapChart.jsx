import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import fetchData from '../hooks/fetchData';

const HeatMapChart = () => {
  const [baseTemperature, setBaseTemperature] = useState();
  const [data, setData] = useState([]);

  const w = 1200;
  const h = 600;
  const margin = { top: 10, right: 30, bottom: 60, left: 60 };
  const width = w - margin.left - margin.right;
  const height = h - margin.top - margin.bottom;

  useEffect(() => {
    const dataLink = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
    
    fetchData(dataLink)
      .then(data => {

        const baseTemperature = data.baseTemperature;
        const parsedData = [];

        data.monthlyVariance.forEach(item => {
          parsedData.push(item);
        });

        console.log(parsedData);
        setData(parsedData);
        setBaseTemperature(baseTemperature);
      })
      .catch(error => console.error("Error fetching data:", error));

  }, []);

  const svgRef = useRef(null);

  // create heatmap
  useEffect(() => {
    if(data.length > 0) {
      const svg = d3.select(svgRef.current);

      // scales
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([margin.left, width - margin.right]);

      const yScale = d3.scaleBand()
        .domain(d3.range(1, 13))
        .range([margin.top, height - margin.bottom]);

      const variance = data.map(d => d.variance);
      // generate continuous, smooth color scales
      const colorScale = d3.scaleSequential(d3.interpolatePlasma)
        .domain([d3.min(variance), d3.max(variance)]);

      // draw rectangles for heatmap
      svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.month))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", d => colorScale(d.variance));

    }
  })


  return (
    <div className='chart-container'>
      <h2 className='chart-title'>Monthly Global Land-Surface Temperature</h2>
      <div id="description">
        1753 - 2015: base temperature {baseTemperature}℃
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

export default HeatMapChart;