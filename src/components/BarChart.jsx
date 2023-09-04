import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import fetchData from '../hooks/fetchData';

const BarChart = () => {

  const [values, setValues] = useState([]);
  const [dates, setDates] = useState([]);

  const dataLink = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  const w = 800;
  const h = 400;

  const svgRef = useRef(null);

  useEffect(() => {
    fetchData(dataLink)
      .then(data => {

        const parsedDates = [];
        const parsedValues = [];

        const parseDate = d3.timeParse("%Y-%m-%d");

        data.data.forEach(item => {
          parsedDates.push(parseDate(item[0]));
          parsedValues.push(item[1]);
        });

        setDates(parsedDates);
        setValues(parsedValues);
      })
      .catch(error => console.error("Error fetching data:", error));

  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear previous SVG content
    svg.selectAll('*').remove();

    svg.selectAll("rect")
      .data(values)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 3)
      .attr("y", (d) => h - 0.02 * d)
      .attr("width", 2)
      .attr("height", (d) => 0.02 * d)
      .attr("fill", "navy")
      .attr("class", "bar")
  }, [values]);


  return (
    <svg ref={svgRef} width={w} height={h}></svg>
  )
}

export default BarChart;
