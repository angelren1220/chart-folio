import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import fetchData from '../hooks/fetchData';
import '../styles/barchart.scss';

const BarChart = () => {

  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);

  const w = 1200;
  const h = 600;
  const margin = { top: 10, right: 30, bottom: 60, left: 60 };
  const width = w - margin.left - margin.right;
  const height = h - margin.top - margin.bottom;


  const svgRef = useRef(null);

  // fetch and parse data
  useEffect(() => {
    const dataLink = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

    fetchData(dataLink)
      .then(data => {

        const description = data.description;
        const parsedData = [];
        const parseDate = d3.timeParse("%Y-%m-%d");

        data.data.forEach(item => {
          parsedData.push([parseDate(item[0]), item[1]]);
        });

        // sort data by date
        parsedData.sort((a, b) => a[0] - b[0]);

        setDescription(description);
        setData(parsedData);
      })
      .catch(error => console.error("Error fetching data:", error));

  }, []);

  // create bar chart
  useEffect(() => {
    if (data.length > 0) {

      const barWidth = width / data.length;

      const svg = d3.select(svgRef.current)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // create scales
      const years = data.map(d => d[0]);
      const xScale = d3.scaleTime()
        .domain([d3.min(years), d3.max(years)])
        .range([0, width]);

      const values = data.map(d => d[1]);
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(values)])
        .range([height, 0]);

      // create axis
      const xAxis = d3.axisBottom(xScale)
        .ticks(d3.timeYear.every(5))
        .tickFormat(d3.timeFormat("%Y"));
      const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => {
          if (d >= 1e9) return `${d / 1e9}B`;
          if (d >= 1e6) return `${d / 1e6}M`;
          if (d >= 1e3) return `${d / 1e3}K`;
          return d;
        });


      // Clear previous SVG content
      svg.selectAll('*').remove();

      // create bars
      svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d[0]))
        .attr("y", d => yScale(d[1]))
        .attr("width", barWidth)
        .attr("height", d => height - yScale(d[1]))
        .attr("fill", "#FFBB5C")
        .attr("class", "bar")
        .on("mouseover", (event, d) => {
          const [date, value] = d;
          const formatTime = d3.timeFormat("%Y Q%q");
          const formattedDate = formatTime(date);
          const barTop = yScale(d[1]);
          const tooltipY = barTop - 5;
          // highlight the bar
          d3.select(event.currentTarget)
            .classed("bar-highlighted", true);

          // display the tooltip
          d3.select(".tooltip")
            .html(`Year: ${formattedDate} <br>  $${value.toFixed(1)} Billion`)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style('left', event.pageX - barWidth + 'px')
            .style("top", tooltipY + "px")
            .style("display", "inline-block");


        })
        .on("mouseout", (event) => {
          // hide the tooltip
          d3.select(".tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0)
            .style("display", "none");

          // revert bar's color
          d3.select(event.currentTarget)
            .classed("bar-highlighted", false);
        });


      // add x-axis
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      // add y-axis
      svg.append("g")
        .call(yAxis);

      // labels for axes
      svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Year");
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Gross Domestic Product");

    }


  }, [data, height, margin.bottom, margin.left, margin.top, width]);


  return (
    <div className='chart-container'>
      <h2 className='chart-title'>United States Gross Domestic Product (GDP)</h2>
      <div className="chart-description">
        {description}
      </div>
      <div className='tooltip' style={{
        position: "absolute",
        display: "none",
        background: "#f9f9f9",
        padding: "5px",
        border: "1px solid #ccc"
      }}></div>
      <svg ref={svgRef} width={w} height={h}></svg>
    </div>
  );
};

export default BarChart;
