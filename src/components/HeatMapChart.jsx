import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import fetchData from '../hooks/fetchData';

const HeatMapChart = () => {
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

        const parsedData = [];

        data.monthlyVariance.forEach(item => {
          parsedData.push(item);
        });

        setData(parsedData);
      })
      .catch(error => console.error("Error fetching data:", error));

  }, []);

  const svgRef = useRef(null);


  return (
    <div className='chart-container'>
      <h2 className='chart-title'>Monthly Global Land-Surface Temperature</h2>
      <div id="description">
        1753 - 2015: base temperature 8.66℃
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