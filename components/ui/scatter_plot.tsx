"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

type Props = {
  data: [number, number][];
  width?: number;
  height?: number;
};

export default function ScatterPlot({
  data,
  width = 500,
  height = 300
}: Props) {

  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear existing

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    // Scales
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d[0]) as [number, number])
      .nice()
      .range([0, innerW]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d[1]) as [number, number])
      .nice()
      .range([innerH, 0]);

    // Main group
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    // Points
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d[0]))
      .attr("cy", d => y(d[1]))
      .attr("r", 5)
      .style("fill", "#4F46E5")
      .style("opacity", 0)
      .transition()
      .duration(600)
      .style("opacity", 1);

  }, [data, width, height]);

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      className="rounded-xl shadow-md bg-white"
    />
  );
}
