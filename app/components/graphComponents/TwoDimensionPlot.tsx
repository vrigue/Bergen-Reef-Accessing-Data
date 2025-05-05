"use client";

import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import "../../globals.css";
import DateBoundElement from "../DateBoundElement";
import ZoomSlider from "../ZoomSlider";
import StepSlider from "../StepSlider";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface DataPoint {
  datetime: string;
  x: number;
  y: number;
  name1: string;
  name2: string;
}

interface RawDataPoint {
  id: number;
  datetime: string;
  name: string;
  unit: string;
  value: number;
}

const units = {
  Salinity: "ppt",
  ORP: "mV",
  Temperature: "°C",
  Alkalinity: "dKH",
  Calcium: "ppm",
};

export default function DataLineGraph() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([
    "Temperature",
    "ORP",
  ]);
  const [zoom, setZoom] = useState(50);
  const [step, setStep] = useState(50);
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
  }, [shouldFetch]);

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    setStartDate(lastWeek);
    setEndDate(today);
    setSelectedNames(["Temperature", "ORP"]);
    setShouldFetch(true);
  }, []);

  async function fetchData() {
    try {
      startDate.setHours(startDate.getHours() - 5);
      endDate.setHours(endDate.getHours() - 5);
      const response = await fetch(
        `/api/searchDataByDateType?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&names=${selectedNames.join(
          ","
        )}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: RawDataPoint[] = await response.json();
      
      // Group data points by datetime
      const groupedByTime = result.reduce((acc, point) => {
        if (!acc[point.datetime]) {
          acc[point.datetime] = {};
        }
        acc[point.datetime][point.name] = point.value;
        return acc;
      }, {} as Record<string, Record<string, number>>);

      // Create paired data points
      const pairedData = Object.entries(groupedByTime)
        .filter(([_, values]) => 
          values[selectedNames[0]] !== undefined && 
          values[selectedNames[1]] !== undefined
        )
        .map(([datetime, values]) => ({
          datetime,
          x: values[selectedNames[0]],
          y: values[selectedNames[1]],
          name1: selectedNames[0],
          name2: selectedNames[1]
        }));

      setData(pairedData);
    } catch (error: any) {
      console.error("Error searching for data: ", error);
    }
  }

  useEffect(() => {
    if (data.length > 0 && svgRef.current) {
      drawChart();
    }
  }, [data, zoom, step]);

  const drawChart = () => {
    if (selectedNames.length < 2 || selectedNames[0] === selectedNames[1]) return; // Not plottable with this sparse data

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Calculate margins based on whether we have one or two series
    const margin = { top: 30, right: 90, bottom: 120, left: 90 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.x) as [number, number])
      .range([0, width]);
    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.y) as [number, number])
      .range([height, 0]);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format(".2f")))
      .selectAll("text")
      .style("font-size", "18px");

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y).tickFormat(d3.format(".2f")))
      .selectAll("text")
      .style("font-size", "18px");

    // Add tooltip div
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(255, 255, 255, 0.8)")
      .style("border", "1px solid #ccc")
      .style("padding", "10px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 0 5px rgba(0, 0, 0, 0.3)");

    // Plot points with tooltip interaction
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", 4)
      .attr("fill", "steelblue")
      .on("mouseover", (event, d) => {
        tooltip
          .style("visibility", "visible")
          .html(
            `Time: ${d3.timeFormat("%Y-%m-%d %H:%M")(new Date(d.datetime))}<br>
             ${d.name1}: ${d.x} ${units[d.name1]}<br>
             ${d.name2}: ${d.y} ${units[d.name2]}`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // X axis label
    g.append("text")
      .attr("fill", "black")
      .attr("x", width / 2)
      .attr("y", height + 45)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(`${selectedNames[0]} (${units[selectedNames[0]]})`);

    // Y axis label
    g.append("text")
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(`${selectedNames[1]} (${units[selectedNames[1]]})`);
  };

  const handleNameSelect = (index: number, name: string) => {
    const newSelectedNames = [...selectedNames];
    newSelectedNames[index] = name;
    if (newSelectedNames[0] !== newSelectedNames[1]) {
      setSelectedNames(newSelectedNames);
    }
  };

  const addPlot = () => {
    if (selectedNames.length < 5) {
      setSelectedNames([...selectedNames, ""]);
    }
  };

  useEffect(() => {
    setZoom(100); // Set default zoom to 100%
  }, []);

  return (
    <div className="grid grid-cols-4 gap-7 pt-5">
      <div className="col-span-3 bg-white ml-8 pr-8 pt-3 pb-3 rounded-lg flex justify-center items-center">
        <div className="w-[calc(100%-20px)] h-full">
          <svg ref={svgRef} width="100%" height="100%" className="overflow-visible"></svg>
        </div>
      </div>

      <div className="flex flex-col col-span-1 bg-white drop-shadow-md mr-8 pb-3 flex flex-col space-y-6 rounded-lg">
        <h1 className="text-xl bg-teal drop-shadow-xl text-white text-center font-semibold rounded-lg p-4">
          Two Dimensional Plot
        </h1>
        <div className="flex flex-col">
          {selectedNames.map((name, index) => (
            <Menu
              as="div"
              key={index}
              className="relative inline-block text-left m-3"
            >
              <MenuButton className="inline-flex w-full justify-center rounded-xl bg-white px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                <span style={{ color: colorScale(index) }}>
                  {name || "Select Name"}
                </span>
                <ChevronDownIcon className="-mr-1 size-6 text-sky-700" />
              </MenuButton>
              <MenuItems className="z-50 right-1/2 transform translate-x-1/2 mt-2 w-56 bg-white shadow-lg ring-1 ring-black/5">
                {availableNames
                  .filter((n) => !selectedNames.includes(n))
                  .map((n) => (
                    <MenuItem key={n}>
                      <button
                        onClick={() => handleNameSelect(index, n)}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {n}
                      </button>
                    </MenuItem>
                  ))}
              </MenuItems>
            </Menu>
          ))}
          {selectedNames.length < 2 && ( // keep to 2 plots for now
            <button
              onClick={addPlot}
              className="bg-orange outline outline-1 outline-dark-orange drop-shadow-xl text-white font-medium px-4 py-2 m-3 rounded-xl hover:bg-dark-orange"
            >
              Add Another Plot
            </button>
          )}
          {selectedNames.length > 1 && (
            <button
              onClick={() => setSelectedNames(selectedNames.slice(0, -1))}
              className="bg-medium-teal outline outline-1 outline-dark-teal drop-shadow-xl text-white font-medium px-4 py-2 m-3 rounded-xl hover:bg-dark-teal"
            >
              Remove Last Plot
            </button>
          )}
        </div>

        <div className="flex flex-col bg-light-teal m-3 pb-5 rounded-lg">
          <div className="w-1/2 bg-teal text-white font-semibold text-center p-2 m-4 mb-2 rounded-xl self-center">
            Enter Date Constraints
          </div>
          <div
            className={`flex items-center flex-col justify-center rounded-lg pt-2 m-3 mt-1 text-sm text-neutral-700`}
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

        <div
          className="flex flex-col items-center justify-center mt-auto"
          style={{ visibility: "hidden" }}
        >
          <ZoomSlider value={zoom} onChange={setZoom} />
          <StepSlider value={step} onChange={setStep} />
        </div>
      </div>
    </div>
  );
}

function setData(newData: DataPoint[]) {
  setData(newData);
}
