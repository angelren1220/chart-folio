import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import fetchData from '../hooks/fetchData';
import gradientColors from '../hooks/gradientColors';

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
          parsedData.push({
            year: item.year,
            month: item.month,
            temp: item.variance + baseTemperature,
            variance: item.variance
          });
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
    if (data.length > 0) {
      const svg = d3.select(svgRef.current);

      // scales
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([margin.left, width - margin.right]);

      const yScale = d3.scaleBand()
        .domain(d3.range(1, 13))
        .range([margin.top, height - margin.bottom]);

      // set color scale
      const colors = gradientColors();

      const variance = data.map(d => d.variance);
      const temp = data.map(d => d.temp);
      const colorScale = d3.scaleQuantize()
        .domain([d3.min(variance), d3.max(variance)])
        .range(colors);

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

      // draw axes
      const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      const xAxis = d3.axisBottom(xScale).tickValues(xScale.domain().filter(year => year % 10 === 0));
      const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => monthNames[d]);

      svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

      svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height})`)
        .style("text-anchor", "middle")
        .text("Year");

      svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);

      // draw legends
      const legendWidth = 400;
      const legendHeight = 20;

      const legend = svg.append("g")
        .attr("transform", `translate(${width - legendWidth}, ${height + 40})`);

      const numRects = colors.length;
      const rectWidth = legendWidth / numRects;

      legend.selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * rectWidth)
        .attr("y",  legendHeight - 30)
        .attr("width", rectWidth)
        .attr("height", legendHeight)
        .attr("fill", d => d);

      // add labels
      const legendScale = d3.scaleLinear()
        .domain([0, numRects - 1])
        .range([d3.min(temp), d3.max(temp)]);

        legend.selectAll("text")
        .data(colors)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * rectWidth)
        .attr("y", legendHeight + 10)
        .text((d, i) => legendScale(i).toFixed(1))
        .style("font-size", "15px")
        .attr("text-anchor", "middle")
    }
  }, [data, height, margin.bottom, margin.left, margin.right, margin.top, width]);


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