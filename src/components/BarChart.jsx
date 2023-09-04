import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = () => {

  const barDataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];

  const w = 500;
  const h = 150;

  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("rect")
      .data(barDataset)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 30)
      .attr("y", (d) => h - d * 3)
      .attr("width", 25)
      .attr("height", (d) => 3 * d)
      .attr("fill", "navy")
      .attr("class", "bar")
      .append("title")
      .text((d) => (d));

    svg.selectAll(".barLabel")
      .data(barDataset)
      .enter()
      .append("text")
      .attr("class", "barLabel")
      .attr("x", (d, i) => i * 30)
      .attr("y", (d) => h - d * 3 - 3)
      .text((d) => (d));
  }, [barDataset]);


  return (
    <svg ref={svgRef} width={w} height={h}></svg>
  )
}

export default BarChart;
