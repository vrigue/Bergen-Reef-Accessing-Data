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
  type: string;
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
};

const typeMapping: { [key: string]: string } = {
  Temperature: "Tmp",
  Salinity: "Salt",
  ORP: "ORP",
  Alkalinity: "Alkx4",
  Calcium: "Cax4",
  pH: "pH",
};

export default function BoxPlot() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedType, setSelectedType] = useState<string>("Salinity");
  const [numBoxPlots, setNumBoxPlots] = useState<number>(5);
  const [shouldFetch, setShouldFetch] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const availableTypes = [
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
  }, [shouldFetch]);

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    setStartDate(lastWeek);
    setEndDate(today);
    setShouldFetch(true);
  }, []);

  async function fetchData() {
    try {
      startDate.setHours(startDate.getHours() - 5);
      endDate.setHours(endDate.getHours() - 5);
      const response = await fetch(
        `/api/searchDataByDateType?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&types=${typeMapping[selectedType]}`
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

  useEffect(() => {
    if (data.length > 0 && svgRef.current) {
      drawChart();
    }
  }, [data, numBoxPlots]);

  const calculateBoxPlotData = (data: DataPoint[]): BoxPlotData[] => {
    const timeRange = endDate.getTime() - startDate.getTime();
    const intervalSize = timeRange / numBoxPlots;
    
    const boxPlotData: BoxPlotData[] = [];
    
    for (let i = 0; i < numBoxPlots; i++) {
      const intervalStart = new Date(startDate.getTime() + i * intervalSize);
      const intervalEnd = new Date(startDate.getTime() + (i + 1) * intervalSize);
      
      const intervalData = data.filter(d => {
        const date = new Date(d.datetime);
        return date >= intervalStart && date < intervalEnd;
      }).map(d => d.value);

      if (intervalData.length > 0) {
        const sortedData = [...intervalData].sort((a, b) => a - b);
        const q1Index = Math.floor(sortedData.length * 0.25);
        const q3Index = Math.floor(sortedData.length * 0.75);
        
        const min = sortedData[0];
        const q1 = sortedData[q1Index];
        const median = sortedData[Math.floor(sortedData.length * 0.5)];
        const q3 = sortedData[q3Index];
        const max = sortedData[sortedData.length - 1];
        
        // Calculate outliers (values beyond 1.5 * IQR) // this is wrong
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        const outliers = sortedData.filter(d => d < lowerBound || d > upperBound);
        
        boxPlotData.push({
          min,
          q1,
          median,
          q3,
          max,
          outliers,
          timeRange: `${d3.timeFormat("%Y-%m-%d")(intervalStart)} to ${d3.timeFormat("%Y-%m-%d")(intervalEnd)}`
        });
      }
    }
    
    return boxPlotData;
  };

  const drawChart = () => {
    if (!selectedType) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 90, bottom: 70, left: 90 };
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
    
    // Create scales with padding
    const x = d3.scaleLinear()
      .domain([-0.5, numBoxPlots - 0.5])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([
        d3.min(boxPlotData, d => d.min) || 0,
        d3.max(boxPlotData, d => d.max) || 0
      ])
      .range([height, 0])
      .nice();

    // Draw boxes
    const boxWidth = width / numBoxPlots * 0.8;
    
    boxPlotData.forEach((d, i) => {
      const xPos = x(i);
      
      // Draw box
      g.append("rect")
        .attr("x", xPos - boxWidth/2)
        .attr("y", y(d.q3))
        .attr("width", boxWidth)
        .attr("height", y(d.q1) - y(d.q3))
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .on("mouseover", (event) => {
          tooltip
            .style("visibility", "visible")
            .html(`Q1: ${Number(d.q1).toFixed(2)}<br/>Q3: ${Number(d.q3).toFixed(2)}<br/>IQR: ${Number(d.q3 - d.q1).toFixed(2)}`);
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
        .attr("x1", xPos - boxWidth/2)
        .attr("x2", xPos + boxWidth/2)
        .attr("y1", y(d.median))
        .attr("y2", y(d.median))
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("mouseover", (event) => {
          tooltip
            .style("visibility", "visible")
            .html(`Median: ${Number(d.median).toFixed(2)}`);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });

      // Draw whiskers with hover
      const drawWhisker = (y1: number, y2: number, label: string) => {
        g.append("line")
          .attr("x1", xPos)
          .attr("x2", xPos)
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

      drawWhisker(d.max, d.q3, "Maximum");
      drawWhisker(d.min, d.q1, "Minimum");

      // Draw whisker caps
      g.append("line")
        .attr("x1", xPos - boxWidth/4)
        .attr("x2", xPos + boxWidth/4)
        .attr("y1", y(d.max))
        .attr("y2", y(d.max))
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      g.append("line")
        .attr("x1", xPos - boxWidth/4)
        .attr("x2", xPos + boxWidth/4)
        .attr("y1", y(d.min))
        .attr("y2", y(d.min))
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      // Draw outliers with hover
      d.outliers.forEach(outlier => {
        g.append("circle")
          .attr("cx", xPos)
          .attr("cy", y(outlier))
          .attr("r", 3)
          .attr("fill", "red")
          .attr("stroke", "none")
          .style("cursor", "pointer")
          .on("mouseover", (event) => {
            const iqr = Number(d.q3 - d.q1);
            const lowerBound = Number(d.q1 - 1.5 * iqr);
            const upperBound = Number(d.q3 + 1.5 * iqr);
            tooltip
              .style("visibility", "visible")
              .html(
                `<strong>Outlier Value:</strong> ${Number(outlier).toFixed(2)}<br/>` +
                `<strong>Why is this an outlier?</strong><br/>` +
                `This value falls ${outlier > upperBound ? 'above' : 'below'} the expected range.<br/><br/>` +
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
    });

    // Add axes with formatted date ranges
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(numBoxPlots)
        .tickFormat((d, i) => {
          if (i < boxPlotData.length) {
            const dates = boxPlotData[i].timeRange.split(" to ");
            return d3.timeFormat("%m-%d")(new Date(dates[0]));
          }
          return "";
        }))
      .selectAll("text")
      .style("font-size", "18px")
      .attr("text-anchor", "middle");

    g.append("g")
      .call(d3.axisLeft(y).tickFormat(d3.format(".2f")))
      .selectAll("text")
      .style("font-size", "18px");

    // Add labels
    g.append("text")
      .attr("fill", "black")
      .attr("x", width / 2)
      .attr("y", height + 45)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text("Time");

    g.append("text")
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(`${selectedType} (${units[selectedType]})`);
  };

  return (
    <div className="grid grid-cols-3 gap-7 pt-5">
      <div className="col-span-2 bg-white ml-8 pr-8 pt-3 pb-3 rounded-lg h-[600px] flex justify-center items-center">
        <div className="w-[calc(100%-40px)] h-[calc(100%-20px)]">
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
                {selectedType || "Select Type"}
              </span>
              <ChevronDownIcon className="-mr-1 size-6 text-sky-700" />
            </MenuButton>
            <MenuItems className="z-50 right-1/2 transform translate-x-1/2 mt-2 w-56 bg-white shadow-lg ring-1 ring-black/5">
              {availableTypes.map((type) => (
                <MenuItem key={type}>
                  <button
                    onClick={() => setSelectedType(type)}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {type}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>

          <div className="m-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Box Plots
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={numBoxPlots}
              onChange={(e) => setNumBoxPlots(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal focus:border-teal"
            />
          </div>
        </div>

        <div className="flex flex-col bg-light-teal m-3 pb-5 rounded-lg">
          <div className="w-1/2 bg-teal text-white font-semibold text-center p-2 m-4 mb-2 rounded-xl self-center">
            Enter Date Constraints
          </div>
          <div
            className={`flex items-center ${
              isSmallScreen ? "flex-col" : "space-x-4"
            } justify-center rounded-lg pt-2 m-3 mt-1 text-sm text-neutral-700`}
          >
            <DateBoundElement value={startDate} onChange={setStartDate} />

            <div className="bg-teal p-1 pl-2 pr-2 rounded-lg">
              <span className="text-white font-semibold text-center">to</span>
            </div>

            <DateBoundElement value={endDate} onChange={setEndDate} />
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