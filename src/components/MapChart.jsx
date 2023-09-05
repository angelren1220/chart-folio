import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import fetchData from '../hooks/fetchData';

const MapChart = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);

  const dataLink = "https://api.worldbank.org/V2/incomeLevel/LIC/country?format=json";

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

        data[1].forEach(item => {
          parsedData.push({
            name: item.name,
            incomeLevel: item.incomeLevel,
            lng: item.longitude,
            lat: item.latitude
          });
        });

        console.log(parsedData);
        setData(parsedData);
      })
      .catch(error => console.error("Error fetching data:", error));

  }, []);

  return (
    <div className='chart-container'>
      <h2 className='chart-title'>Map Chart</h2>
      <svg ></svg>
    </div>
  )
}

export default MapChart;
