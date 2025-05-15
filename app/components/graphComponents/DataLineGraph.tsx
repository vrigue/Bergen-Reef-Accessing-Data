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
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [zoom, setZoom] = useState(50);
  const [step, setStep] = useState(50);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [lastFetchParams, setLastFetchParams] = useState<string>("");
  const svgRef = useRef<SVGSVGElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [useInterpolation, setUseInterpolation] = useState(true);

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
  }, [shouldFetch, startDate, endDate, selectedNames]);

  useEffect(() => {
    if (data.length > 0 && svgRef.current) {
      drawChart();
    }
  }, [data, selectedNames, startDate, endDate, useInterpolation]);

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    setStartDate(lastWeek);
    setEndDate(today);
    setSelectedNames(["Salinity"]);
    setShouldFetch(true);
  }, []);

  async function fetchData() {
    try {
      // Create a copy of the dates for timezone adjustment
      const adjustedStartDate = new Date(startDate);
      const adjustedEndDate = new Date(endDate);
      adjustedStartDate.setHours(adjustedStartDate.getHours() - 5);
      adjustedEndDate.setHours(adjustedEndDate.getHours() - 5);

      const queryString = `startDate=${adjustedStartDate.toISOString()}&endDate=${adjustedEndDate.toISOString()}&names=${selectedNames.join(",")}`;
      
      // Check if we're fetching the same data again
      if (queryString === lastFetchParams) {
        return; // Skip fetch if parameters haven't changed
      }
      
      const response = await fetch(`/api/searchDataByDateType?${queryString}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DataPoint[] = await response.json();
      
      // Update last fetch parameters
      setLastFetchParams(queryString);
      
      // Clear existing data and set new data
      setData([...result]);
    } catch (error: any) {
      console.error("Error searching for data: ", error);
    }
  }

  const drawChart = () => {
    if (selectedNames.length < 1) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Calculate margins based on whether we have one or two series
    const rightMargin = selectedNames.length > 1 ? 90 : 60;
    const margin = { top: 20, right: rightMargin, bottom: 60, left: 90 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    // Center the graph group within the SVG
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().domain([startDate, endDate]).range([0, width]);

    // Calculate y-axis for the first selected name
    const yDomain = d3.extent(
      data.filter((d) => d.name === selectedNames[0]),
      (d) => +d.value
    ) as [number, number];
    const y = d3.scaleLinear().domain(yDomain).nice().range([height, 0]);

    // Calculate yRight-axis for the second selected name if it exists
    const yRight = selectedNames[1]
      ? d3
          .scaleLinear()
          .domain(
            d3.extent(
              data.filter((d) => d.name === selectedNames[1]),
              (d) => +d.value
            ) as [number, number]
          )
          .nice()
          .range([height, 0])
      : null;

    const dayCount = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate tick values with a staggered approach
    const tickValues = [];
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      if (i % 2 === 0) {
        // Stagger: only add every other day
        tickValues.push(date);
      }
    }

    // Adjust x-axis ticks based on the number of days in the range
    const xAxis = d3
      .axisBottom(x)
      .ticks(5)  // Limit to 5 ticks
      .tickFormat(d3.timeFormat("%m-%d"));  // Show only month-day

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "18px")
      .attr("text-anchor", "middle");  // Center align the text

    // Add x-axis label
    g.append("text")
      .attr("fill", "black")
      .attr("x", width / 2)
      .attr("y", height + 45)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text("Time");

    const tickCount = Math.min(5, Math.ceil(yDomain[1] - yDomain[0])); // Dynamically set ticks based on range

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".2f")))
      .selectAll("text")
      .style("font-size", "18px");

    // Update font size and weight for labels
    g.append("text")
      .attr("fill", d3.schemeCategory10[0])
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(`${selectedNames[0]} (${units[selectedNames[0]]})`);

    // Add right y-axis
    if (yRight) {
      const yRightAxis = g
        .append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(yRight).ticks(5).tickFormat(d3.format(".2f")))
        .selectAll("text")
        .style("font-size", "18px");

      const yRightLabel = g
        .append("text")
        .attr("fill", d3.schemeCategory10[1])
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", width + margin.right + 10)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .text(`${selectedNames[1]} (${units[selectedNames[1]]})`);
    }

    // Create line generators
    const createLine = (useRightAxis = false) => {
      const yScale = useRightAxis ? yRight : y;
      if (useInterpolation) {
        return d3
          .line<DataPoint>()
          .defined((d) => !isNaN(d.value) && d.value !== null)
          .x((d) => x(new Date(d.datetime)))
          .y((d) => yScale!(d.value))
          .curve(d3.curveBasis); // Use basis interpolation for smooth curves
      } else {
        return d3
          .line<DataPoint>()
          .defined((d) => !isNaN(d.value) && d.value !== null)
          .x((d) => x(new Date(d.datetime)))
          .y((d) => yScale!(d.value));
      }
    };

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

    // Add lines and points for each data series
    selectedNames.forEach((name, index) => {
      const nameData = data.filter((d) => d.name === name);
      const lineFunction = createLine(index === 1);
      
      g.append("path")
        .datum(nameData)
        .attr("fill", "none")
        .attr("stroke", d3.schemeCategory10[index])
        .attr("stroke-width", 1.5)
        .attr("d", lineFunction)
        .attr("transform", `translate(${margin.left / 4},0)`);

      // Only add points if not using interpolation
      if (!useInterpolation) {
        const pointsGroup = g.append("g").attr("transform", `translate(${margin.left / 4},0)`);
        pointsGroup.selectAll(`circle.series-${index}`)
          .data(nameData)
          .enter()
          .append("circle")
          .attr("class", `series-${index}`)
          .attr("cx", (d) => x(new Date(d.datetime)))
          .attr("cy", (d) =>
            index === 0 ? y(d.value) : yRight ? yRight(d.value) : y(d.value)
          )
          .attr("r", 4)
          .attr("fill", d3.schemeCategory10[index])
          .on("mouseover", (event, d) => {
            tooltip
              .style("visibility", "visible")
              .html(
                `ID: ${d.id}<br>Date: ${d3.timeFormat("%Y-%m-%d %H:%M")(
                  new Date(d.datetime)
                )}<br>Name: ${d.name}<br>Unit: ${d.unit}<br>Value: ${d.value}`
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
      }
    });
  };

  const handleNameSelect = (index: number, name: string) => {
    const newSelectedNames = [...selectedNames];
    newSelectedNames[index] = name;
    setSelectedNames(newSelectedNames);
    setShouldFetch(true);
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
    <div className="grid grid-cols-4 gap-7 h-full p-5">
      <div className="col-span-3 bg-white ml-8 pr-8 pt-3 pb-3 rounded-lg flex justify-center items-center">
        <div className="w-full h-full">
          <svg ref={svgRef} width="100%" height="100%" className="overflow-visible"></svg>
        </div>
      </div>

      <div className="flex flex-col col-span-1 bg-white drop-shadow-md mr-8 pb-3 flex flex-col space-y-6 rounded-lg">
        <h1 className="text-xl bg-teal drop-shadow-xl text-white text-center font-semibold rounded-lg p-4">
          Line Plot
        </h1>
        <div className="flex flex-col">
          {selectedNames.map((name, index) => (
            <Menu
              as="div"
              key={index}
              className="relative inline-block text-left m-3"
            >
              <MenuButton className="inline-flex w-full justify-center outline outline-1 outline-medium-blue rounded-xl bg-light-blue px-3 py-2 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                <span className="text-blue font-semibold">
                  {name || "Select Name"}
                </span>
                <ChevronDownIcon className="-mr-1 size-6 text-blue" />
              </MenuButton>
              <MenuItems className="w-full z-50 right-1/2 transform mt-2 w-56 bg-light-blue rounded-xl shadow-lg ring-1 ring-black/5">
                {availableNames
                  .filter((n) => !selectedNames.includes(n))
                  .map((n) => (
                    <MenuItem key={n}>
                      <button
                        onClick={() => handleNameSelect(index, n)}
                        className="block w-full px-4 py-2 text-md text-blue font-semibold hover:bg-orange"
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
            Enter Date Constraints
          </div>
          <div
            className={`flex items-center ${
              true ? "flex-col" : "space-x-4" // Can change this to make it horizontal using isSmallScreen
            } justify-center rounded-lg pt-2 m-3 mt-1 text-lg text-neutral-700`}
          >
            <DateBoundElement value={startDate} onChange={setStartDate}/>

            <div className="bg-teal p-1 pl-2 pr-2 mt-3 mb-3 rounded-lg">
              <span className="text-white font-semibold text-center">to</span>
            </div>

            <DateBoundElement value={endDate} onChange={setEndDate} />
          </div>

          <div className="flex justify-center pt-4">
            <button
              className="bg-white outline outline-1 outline-dark-orange drop-shadow-xl text-dark-orange font-semibold py-2 px-4 rounded-xl shadow hover:bg-light-orange relative group w-full mx-3"
              onClick={() => setShouldFetch(true)}
            >
              Graph
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-white text-gray-600 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full text-center shadow-md">
                Graph button available for manual refresh when auto-update doesn't trigger.
              </div>
            </button>
          </div>

          <div className="flex items-center justify-center mt-4 mx-3">
            <label className="flex items-center bg-teal rounded-lg m-1 p-3 space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!useInterpolation}
                onChange={(e) => setUseInterpolation(!e.target.checked)}
                className="form-checkbox h-5 w-5 text-teal rounded border-gray-300 focus:ring-teal"
              />
              <span className="text-white font-medium">Display Discrete Points</span>
            </label>
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
