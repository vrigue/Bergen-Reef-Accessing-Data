"use client";

import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import "../../globals.css";
import DateBoundElement from "../DateBoundElement";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface DataPoint {
  id: number;
  datetime: string;
  name: string;
  unit: string;
  value: number;
}

interface BoxPlotData {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
  timeRange: string;
}

const units = {
  Salinity: "ppt",
  ORP: "mV",
  Temperature: "°C",
  Alkalinity: "dKH",
  Calcium: "ppm",
  pH: "no unit",
};

export default function BoxPlot() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedName, setSelectedName] = useState<string>("Salinity");
  const [shouldFetch, setShouldFetch] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const availableNames = [
    "Salinity",
    "ORP",
    "Temperature",
    "Alkalinity",
    "Calcium",
    "pH",
  ];

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1220);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false);
    }
  }, [shouldFetch, startDate, endDate, selectedName]);

  useEffect(() => {
    if (data.length > 0 && svgRef.current) {
      drawChart();
    }
  }, [data, selectedName, startDate, endDate, shouldFetch]);

  useEffect(() => {
    const today = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);
    setStartDate(twoWeeksAgo);
    setEndDate(today);
    setShouldFetch(true);
  }, []);

  async function fetchData() {
    try {
      startDate.setHours(startDate.getHours() - 5);
      endDate.setHours(endDate.getHours() - 5);
      const response = await fetch(
        `/api/searchDataByDateType?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&names=${selectedName}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DataPoint[] = await response.json();
      setData(result);
    } catch (error: any) {
      console.error("Error searching for data: ", error);
    }
  }

  const calculateBoxPlotData = (data: DataPoint[]): BoxPlotData => {
    const sortedData = [...data].map(d => d.value).sort((a, b) => a - b);
    const q1Index = Math.floor(sortedData.length * 0.25);
    const q3Index = Math.floor(sortedData.length * 0.75);
    
    const min = sortedData[0];
    const q1 = sortedData[q1Index];
    const median = sortedData[Math.floor(sortedData.length * 0.5)];
    const q3 = sortedData[q3Index];
    const max = sortedData[sortedData.length - 1];
    
    // Calculate outliers (values beyond 1.5 * IQR)
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = sortedData.filter(d => d < lowerBound || d > upperBound);
    
    return {
      min,
      q1,
      median,
      q3,
      max,
      outliers,
      timeRange: `${d3.timeFormat("%Y-%m-%d")(startDate)} to ${d3.timeFormat("%Y-%m-%d")(endDate)}`
    };
  };

  const drawChart = () => {
    if (!selectedName) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 90, bottom: 40, left: 90 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    // Add tooltip div
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(255, 255, 255, 0.8)")
      .style("border", "1px solid #ccc")
      .style("padding", "10px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 0 5px rgba(0, 0, 0, 0.3)");

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const boxPlotData = calculateBoxPlotData(data);
    
    // Create scales
    const x = d3.scaleLinear()
      .domain([-0.5, 0.5])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([
        d3.min([boxPlotData.min, ...boxPlotData.outliers]) || 0,
        d3.max([boxPlotData.max, ...boxPlotData.outliers]) || 0
      ])
      .range([height, 0])
      .nice();

    // Draw box
    const boxWidth = width * 0.1; // Reduced width for better centering
    const centerX = width/2 + margin.left/2; // Account for y-axis offset
    
    // Draw box
    g.append("rect")
      .attr("x", centerX - boxWidth/2) // Center the box horizontally with y-axis offset
      .attr("y", y(boxPlotData.q3))
      .attr("width", boxWidth)
      .attr("height", y(boxPlotData.q1) - y(boxPlotData.q3))
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .on("mouseover", (event) => {
        tooltip
          .style("visibility", "visible")
          .html(`Q1: ${Number(boxPlotData.q1).toFixed(2)}<br/>Q3: ${Number(boxPlotData.q3).toFixed(2)}<br/>IQR: ${Number(boxPlotData.q3 - boxPlotData.q1).toFixed(2)}`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // Draw median line
    g.append("line")
      .attr("x1", centerX - boxWidth/2)
      .attr("x2", centerX + boxWidth/2)
      .attr("y1", y(boxPlotData.median))
      .attr("y2", y(boxPlotData.median))
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", (event) => {
        tooltip
          .style("visibility", "visible")
          .html(`Median: ${Number(boxPlotData.median).toFixed(2)}`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // Draw whiskers
    const drawWhisker = (y1: number, y2: number, label: string) => {
      g.append("line")
        .attr("x1", centerX)
        .attr("x2", centerX)
        .attr("y1", y(y1))
        .attr("y2", y(y2))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("mouseover", (event) => {
          tooltip
            .style("visibility", "visible")
            .html(`${label}: ${Number(y1).toFixed(2)}`);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });
    };

    drawWhisker(boxPlotData.max, boxPlotData.q3, "Maximum");
    drawWhisker(boxPlotData.min, boxPlotData.q1, "Minimum");

    // Draw whisker caps
    g.append("line")
      .attr("x1", centerX - boxWidth/2)
      .attr("x2", centerX + boxWidth/2)
      .attr("y1", y(boxPlotData.max))
      .attr("y2", y(boxPlotData.max))
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    g.append("line")
      .attr("x1", centerX - boxWidth/2)
      .attr("x2", centerX + boxWidth/2)
      .attr("y1", y(boxPlotData.min))
      .attr("y2", y(boxPlotData.min))
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    // Draw outliers
    boxPlotData.outliers.forEach(outlier => {
      g.append("circle")
        .attr("cx", centerX)
        .attr("cy", y(outlier))
        .attr("r", 3)
        .attr("fill", "red")
        .attr("stroke", "none")
        .style("cursor", "pointer")
        .on("mouseover", (event) => {
          const iqr = Number(boxPlotData.q3 - boxPlotData.q1);
          const lowerBound = Number(boxPlotData.q1 - 1.5 * iqr);
          const upperBound = Number(boxPlotData.max);
          tooltip
            .style("visibility", "visible")
            .html(
              `<strong>Outlier Value:</strong> ${Number(outlier).toFixed(2)}<br/><br/>` +
              `<strong>Expected Range:</strong><br/>` +
              `Lower bound: ${lowerBound.toFixed(2)}<br/>` +
              `Upper bound: ${upperBound.toFixed(2)}<br/>`
            );
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });
    });

    // Add y-axis
    g.append("g")
      .call(d3.axisLeft(y).tickFormat(d3.format(".2f")))
      .selectAll("text")
      .style("font-size", "18px");

    // Add y-axis label
    g.append("text")
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(`${selectedName} (${units[selectedName]})`);
  };

  const handleNameSelect = (name: string) => {
    setSelectedName(name);
    setShouldFetch(true);
  };

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    setShouldFetch(true);
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
    setShouldFetch(true);
  };

  return (
    <div className="grid grid-cols-3 gap-7 h-full p-5">
      <div className="col-span-2 bg-white ml-8 pr-8 pt-3 pb-3 rounded-lg flex justify-center items-center">
        <div className="w-full h-full">
          <svg ref={svgRef} width="100%" height="100%" className="overflow-visible"></svg>
        </div>
      </div>

      <div className="flex flex-col col-span-1 bg-white drop-shadow-md mr-8 pb-3 flex flex-col space-y-6 rounded-lg">
        <h1 className="text-xl bg-teal drop-shadow-xl text-white text-center font-semibold rounded-lg p-4">
          Box Plot
        </h1>
        <div className="flex flex-col">
          <Menu as="div" className="relative inline-block text-left m-3">
            <MenuButton className="inline-flex w-full justify-center rounded-xl bg-white px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
              <span style={{ color: colorScale(0) }}>
                {selectedName || "Select Name"}
              </span>
              <ChevronDownIcon className="-mr-1 size-6 text-sky-700" />
            </MenuButton>
            <MenuItems className="z-50 right-1/2 transform translate-x-1/2 mt-2 w-56 bg-white shadow-lg ring-1 ring-black/5">
              {availableNames.map((name) => (
                <MenuItem key={name}>
                  <button
                    onClick={() => handleNameSelect(name)}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {name}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        <div className="flex flex-col bg-light-teal m-3 pb-5 rounded-lg">
          <div className="w-1/2 bg-teal text-white font-semibold text-center p-2 m-4 mb-2 rounded-xl self-center">
            Enter Date Constraints
          </div>
          <div
            className={`flex items-center flex-col justify-center rounded-lg pt-2 m-3 mt-1 text-sm text-neutral-700`}
          >
            <DateBoundElement value={startDate} onChange={handleStartDateChange} />

            <div className="bg-teal p-1 pl-2 pr-2 rounded-lg">
              <span className="text-white font-semibold text-center">to</span>
            </div>

            <DateBoundElement value={endDate} onChange={handleEndDateChange} />
          </div>

          <div className="flex justify-center pt-4">
            <button
              className="bg-white outline outline-1 outline-dark-orange drop-shadow-xl text-dark-orange font-semibold py-2 px-4 rounded-xl shadow hover:bg-light-orange"
              onClick={() => setShouldFetch(true)}
            >
              Graph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 