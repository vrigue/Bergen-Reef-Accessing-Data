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
  Temperature: "°F",
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
  const [windowHeight, setWindowHeight] = useState(0);

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
      if (data.length > 0 && svgRef.current) {
        drawChart();
      }
    };

    // Initial resize
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Add ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      if (data.length > 0 && svgRef.current) {
        drawChart();
      }
    });

    if (svgRef.current) {
      resizeObserver.observe(svgRef.current.parentElement!);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [data]);

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false);
    }
  }, [shouldFetch, startDate, endDate, selectedNames]);

  useEffect(() => {
    if (data.length > 0 && svgRef.current) {
      drawChart();
    }
  }, [data, selectedNames, startDate, endDate, shouldFetch]);

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    setStartDate(lastWeek);
    setEndDate(today);
    setSelectedNames(["Temperature", "ORP"]);
    setShouldFetch(true);
  }, []);

  // Add window height calculation
  useEffect(() => {
    const updateHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const availableHeight = windowHeight - 120;

  async function fetchData() {
    try {
      // Only adjust for local time offset here
      const adjustedStartDate = new Date(startDate);
      const adjustedEndDate = new Date(endDate);
      adjustedStartDate.setHours(adjustedStartDate.getHours() - 5);
      adjustedEndDate.setHours(adjustedEndDate.getHours() - 5);
      const response = await fetch(
        `/api/searchDataByDateType?startDate=${adjustedStartDate.toISOString()}&endDate=${adjustedEndDate.toISOString()}&names=${selectedNames.join(",")}`
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
        .filter(
          ([_, values]) =>
            values[selectedNames[0]] !== undefined &&
            values[selectedNames[1]] !== undefined
        )
        .map(([datetime, values]) => ({
          datetime,
          x: values[selectedNames[0]],
          y: values[selectedNames[1]],
          name1: selectedNames[0],
          name2: selectedNames[1],
        }));

      setData(pairedData);
    } catch (error: any) {
      console.error("Error searching for data: ", error);
    }
  }

  const drawChart = () => {
    if (!selectedNames.length || selectedNames[0] === selectedNames[1]) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Get the current dimensions of the container
    const containerWidth = parseInt(
      d3.select(svgRef.current.parentElement).style("width"),
      10
    );
    const containerHeight = parseInt(
      d3.select(svgRef.current.parentElement).style("height"),
      10
    );

    // Set the SVG dimensions to match the container independently
    svg
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
      .attr("preserveAspectRatio", "none"); // Remove aspect ratio constraint

    const margin = { top: 20, right: 20, bottom: 60, left: 80 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x) as [number, number])
      .range([0, width]);
    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.y) as [number, number])
      .range([height, 0]);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format(".2f")))
      .selectAll("text")
      .style("font-size", "14px");

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y).tickFormat(d3.format(".2f")))
      .selectAll("text")
      .style("font-size", "14px");

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
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", 4)
      .attr("fill", "steelblue")
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible").html(
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
      .attr("y", height + 35)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text(`${selectedNames[0]} (${units[selectedNames[0]]})`);

    // Y axis label
    g.append("text")
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text(`${selectedNames[1]} (${units[selectedNames[1]]})`);
  };

  const handleNameSelect = (index: number, name: string) => {
    const newSelectedNames = [...selectedNames];
    newSelectedNames[index] = name;
    if (newSelectedNames[0] !== newSelectedNames[1]) {
      setSelectedNames(newSelectedNames);
      setShouldFetch(true);
    }
  };

  const addPlot = () => {
    if (selectedNames.length < 5) {
      setSelectedNames([...selectedNames, ""]);
      setShouldFetch(true);
    }
  };

  useEffect(() => {
    setZoom(100); // Set default zoom to 100%
    setShouldFetch(true);
  }, []);

  const handleStartDateChange = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    setStartDate(newDate);
    setShouldFetch(true);
  };

  const handleEndDateChange = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    setEndDate(newDate);
    setShouldFetch(true);
  };

  return (
    <div className="grid grid-cols-3 gap-7 h-full p-5">
      <div
        className="col-span-2 bg-white ml-8 pr-8 pt-3 pb-3 rounded-lg flex justify-center items-center"
        style={{ height: `${availableHeight}px` }}
      >
        <div className="w-full h-full relative overflow-hidden">
          <svg
            ref={svgRef}
            className="w-full h-full"
            style={{ position: "absolute", top: 0, left: 0 }}
          ></svg>
        </div>
      </div>

      <div
        className="flex flex-col col-span-1 bg-white drop-shadow-md mr-8 pb-3 flex flex-col space-y-6 rounded-lg"
        style={{ height: `${availableHeight}px` }}
      >
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
              <MenuButton
                className={
                  index === 0
                    ? "outline-medium-blue bg-light-blue inline-flex w-full justify-center outline outline-1 rounded-xl font-semibold px-3 py-2"
                    : "outline-medium-red-orange bg-light-red-orange inline-flex w-full justify-center outline outline-1 rounded-xl font-semibold px-3 py-2"
                }
              >
                <span style={{ color: colorScale(index) }}>
                  {name || "Select Name"}
                </span>
                <ChevronDownIcon
                  className="-mr-1 size-6"
                  style={{ color: colorScale(index) }}
                />
              </MenuButton>
              <MenuItems
                className={
                  index === 0
                    ? "absolute left-1/2 -translate-x-1/2 bg-light-blue w-full z-50 right-1/2 transform mt-2 w-56 rounded-xl shadow-lg ring-1 ring-black/5"
                    : "absolute left-1/2 -translate-x-1/2 bg-light-red-orange w-full z-50 right-1/2 transform mt-2 w-56 rounded-xl shadow-lg ring-1 ring-black/5"
                }
              >
                {availableNames
                  .filter((n) => !selectedNames.includes(n))
                  .map((n) => (
                    <MenuItem key={n}>
                      <button
                        onClick={() => handleNameSelect(index, n)}
                        className={
                          index === 0
                            ? "text-blue block w-full px-4 py-2 text-md font-semibold hover:bg-medium-orange"
                            : "text-red-orange block w-full px-4 py-2 text-md font-semibold hover:bg-medium-orange"
                        }
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
          <div className="w-1/2 bg-teal text-white font-semibold text-center p-2 m-4 mb-2 rounded-xl self-left">
            Date Constraints
          </div>
          <div
            className={`flex items-center flex-col justify-center rounded-lg pt-2 m-3 mt-1 text-lg text-neutral-700`}
          >
            <DateBoundElement
              value={startDate}
              onChange={handleStartDateChange}
            />

            <div className="bg-teal p-1 pl-2 pr-2 mt-3 mb-3 rounded-lg">
              <span className="text-white font-semibold text-center">to</span>
            </div>

            <DateBoundElement value={endDate} onChange={handleEndDateChange} />
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-center mt-auto"
          style={{ visibility: "hidden" }}
        >
          <ZoomSlider
            value={zoom}
            onChange={(value) => {
              setZoom(value);
              setShouldFetch(true);
            }}
          />
          <StepSlider
            value={step}
            onChange={(value) => {
              setStep(value);
              setShouldFetch(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function setData(newData: DataPoint[]) {
  setData(newData);
}
