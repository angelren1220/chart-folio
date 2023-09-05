import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import fetchData from '../hooks/fetchData';

const BarChart = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);

  const dataLink = "http://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json";

  const w = 1200;
  const h = 600;
  const margin = { top: 10, right: 30, bottom: 60, left: 60 };
  const width = w - margin.left - margin.right;
  const height = h - margin.top - margin.bottom;


  const svgRef = useRef(null);

  // fetch and parse data
  useEffect(() => {
    fetchData(dataLink)
      .then(data => {

        const parsedData = [];
        const parsedTitle = data[1][0].indicator.value + " - " + data[1][0].country.value;

        data[1].forEach(item => {
          parsedData.push([item.date, item.value]);
        });

        // sort data by date
        parsedData.sort((a, b) => a[0] - b[0]);

        setTitle(parsedTitle);
        setData(parsedData);
      })
      .catch(error => console.error("Error fetching data:", error));

  }, []);

  // create bar chart
  useEffect(() => {
    if (data.length > 0) {

      const barWidth = width / data.length - 2;

      const svg = d3.select(svgRef.current)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // create scales
      const years = data.map(d => d[0]);
      const xScale = d3.scaleLinear()
        .domain([d3.min(years), d3.max(years)])
        .range([0, width]);

      const values = data.map(d => d[1]);
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(values)])
        .range([height, 0]);

      // create axis
      const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"));
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
        .attr("fill", "navy")
        .attr("class", "bar")
        .on("mouseover", (event, d) => {
          const [year, value] = d;
          // highlight the bar
          d3.select(event.currentTarget)
            .attr("fill", "lightblue");

          // display the tooltip
          d3.select(".tooltip")
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("display", "inline-block")
            .html(`Year: ${year} <br> Population: ${value}`);


        })
        .on("mouseout", (event) => {
          // hide the tooltip
          d3.select(".tooltip")
            .style("display", "none");

          // revert bar's color
          d3.select(event.currentTarget)
            .attr("fill", "navy");
        })


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
        .text("Population");

    }


  }, [data]);


  return (
    <div className='chart-container'>
      <h2 className='chart-title'>{title}</h2>
      <div className='tooltip' style={{
        position: "absolute",
        display: "none",
        background: "#f9f9f9",
        padding: "5px",
        border: "1px solid #ccc"
      }}></div>
      <svg ref={svgRef} width={w} height={h}></svg>
    </div>
  )
}

export default BarChart;
