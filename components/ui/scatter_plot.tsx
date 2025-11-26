"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    value: [number, number] | null;
    visible: boolean;
  }>({ x: 0, y: 0, value: null, visible: false });

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d[0]) as [number, number])
      .nice()
      .range([0, innerW]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d[1]) as [number, number])
      .nice()
      .range([innerH, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x));

    g.append("g").call(d3.axisLeft(y));

    // Circles with hover events
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d[0]))
      .attr("cy", d => y(d[1]))
      .attr("r", 6)
      .style("fill", "#4F46E5")
      .style("cursor", "pointer")
      .on("mousemove", (event, d) => {
        const [cx, cy] = d3.pointer(event);

        setTooltip({
          x: cx + margin.left + 12,
          y: cy + margin.top + 12,
          value: d,
          visible: true
        });
      })
      .on("mouseleave", () => {
        setTooltip((t) => ({ ...t, visible: false }));
      });
  }, [data, width, height]);

  return (
    <div className="relative w-fit">
      {/* Tooltip as raw floating div — NO TRIGGER → NO FLICKER */}
      {tooltip.visible && tooltip.value && (
        <div
          className={cn(
            "absolute z-50 rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md",
            "animate-in fade-in-0 zoom-in-95"
          )}
          style={{
            left: tooltip.x,
            top: tooltip.y,
            pointerEvents: "none" // ← KEY: avoid flicker
          }}
        >
          <div>Familiarity: <b>{tooltip.value[0]}</b></div>
          <div>Colour Distance: <b>{tooltip.value[1].toFixed(2)}</b></div>
        </div>
      )}

      <svg
        ref={ref}
        width={width}
        height={height}
        className="rounded-xl shadow-md bg-white"
      />
    </div>
  );
}
