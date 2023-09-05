import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import fetchData from '../hooks/fetchData';

const BarChart = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [values, setValues] = useState([]);
  const [dates, setDates] = useState([]);

  const dataLink = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

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

        const title = data.source_name + ": " + data.name;
        const description = data.description + " last updated at: " + data.updated_at;
        const parsedDates = [];
        const parsedValues = [];

        const parseDate = d3.timeParse("%Y-%m-%d");

        data.data.forEach(item => {
          parsedDates.push(parseDate(item[0]));
          parsedValues.push(item[1]);
        });

        setTitle(title);
        setDescription(description);
        setDates(parsedDates);
        setValues(parsedValues);
      })
      .catch(error => console.error("Error fetching data:", error));

  }, []);

  // create bar chart
  useEffect(() => {
    if (values.length > 0) {

      const svg = d3.select(svgRef.current)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // create scales
      const xScale = d3.scaleTime()
        .domain([d3.min(dates), d3.max(dates)])
        .range([0, width]);

      console.log(d3.max(values));

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(values)])
        .range([height, 0]);

      // create axis
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Clear previous SVG content
      svg.selectAll('*').remove();

      // create bars
      svg.selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(dates[i]))
        .attr("y", (d) => yScale(d))
        .attr("width", (d, i) => { // dynamically set the width based on the data's date intervals
          if (i < dates.length - 1) {
            return xScale(dates[i + 1]) - xScale(dates[i]) - 1;
          } else {
            return 2;
          }
        })
        .attr("height", (d) => height - yScale(d))
        .attr("fill", "navy")
        .attr("class", "bar")
        .on("mouseover", (event, d) => {
          d3.select(event.currentTarget)
            .attr("fill", "lightblue");
        })
        .on("mouseout", (event, d) => {
          d3.select(".tooltip")
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("display", "inline-block")
            .html("Value: " + d);

          d3.select(event.currentTarget)
            .attr("fill", "lightblue");

        })
        .on("mouseout", (event, d) => {
          d3.select(".tooltip")
            .style("display", "none");
          
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
    }

  }, [values]);


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
      <p className='chart-description'>{description}</p>
    </div>
  )
}

export default BarChart;
