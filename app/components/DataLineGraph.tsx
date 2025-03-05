"use client";

import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import "../globals.css";
import DateBoundElement from "./DateBoundElement";
import ZoomSlider from "../components/ZoomSlider";
import StepSlider from "../components/StepSlider";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface DataPoint {
  id: number;
  datetime: string;
  name: string;
  type: string;
  value: number;
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
  pH: "pH"
};

export default function DataLineGraph() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [zoom, setZoom] = useState(50);
  const [step, setStep] = useState(50);
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
    setSelectedTypes(["Salinity"]);
    setShouldFetch(true);
  }, []);

  async function fetchData() {
    try {
      startDate.setHours(startDate.getHours() - 5);
      endDate.setHours(endDate.getHours() - 5);
      const response = await fetch(
        `/api/searchDataByDateType?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&types=${selectedTypes.join(
          ","
        )}`
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
  }, [data, zoom, step]);

  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 120, left: 90 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain([startDate, endDate])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => +d.value) as [number, number])
      .nice()
      .range([height, 0]);

    // Adjust y-axis range based on zoom level
    const yDomain = d3.extent(data, (d) => +d.value) as [number, number];
    const yRange = yDomain[1] - yDomain[0];
    const zoomFactor = zoom / 100;
    const adjustedYDomain = [
      yDomain[0] + (yRange * (1 - zoomFactor)) / 2,
      yDomain[1] - (yRange * (1 - zoomFactor)) / 2,
    ];
    y.domain(adjustedYDomain).nice();

    const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate tick values with a staggered approach
    const tickValues = [];
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      if (i % 2 === 0) { // Stagger: only add every other day
        tickValues.push(date);
      }
    }

    // Adjust x-axis ticks based on the number of days in the range
    const xAxis = d3.axisBottom(x)
      .ticks(Math.min(dayCount, 10))
      .tickFormat(d3.timeFormat("%Y-%m-%d %H:%M"));

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add x-axis label
    g.append("text")
      .attr("fill", "black")
      .attr("x", width / 2)
      .attr("y", height + 110) // Position it below the axis
      .attr("text-anchor", "middle")
      .text("Time");

    const tickCount = Math.min(5, Math.ceil(yRange)); // Dynamically set ticks based on range

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".2f")))
      .append("text")
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text(units[selectedTypes[0]]);

    // Add y-axis label for the selected type
    g.append("text")
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("text-anchor", "middle")
      .text(selectedTypes[0]);

    const line = d3
      .line<DataPoint>()
      .defined((d) => !isNaN(d.value) && d.value !== null)
      .x((d) => x(new Date(d.datetime)))
      .y((d) => y(d.value));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add tooltip div
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(255, 255, 255, 0.8)")
      .style("border", "1px solid #ccc")
      .style("padding", "10px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 0 5px rgba(0, 0, 0, 0.3)");

    // Add circles for each data point and tooltip interaction
    selectedTypes.forEach((type, index) => {
      const mappedType = typeMapping[type] || type;
      const typeData = data.filter((d) => d.name === mappedType);
      console.log("typeData:");
      console.log(typeData);
      g.append("path")
        .datum(typeData)
        .attr("fill", "none")
        .attr("stroke", color(index.toString()))
        .attr("stroke-width", 1.5)
        .attr("d", line);

      g.selectAll("circle")
        .data(typeData)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(new Date(d.datetime)))
        .attr("cy", (d) => y(d.value))
        .attr("r", 4)
        .attr("fill", color(index.toString()))
        .on("mouseover", (event, d) => {
          tooltip.style("visibility", "visible")
            .html(`ID: ${d.id}<br>Date: ${d3.timeFormat("%Y-%m-%d %H:%M")(new Date(d.datetime))}<br>Name: ${d.name}<br>Type: ${d.type}<br>Value: ${d.value}`);
        })
        .on("mousemove", (event) => {
          tooltip.style("top", `${event.pageY - 10}px`).style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });

      const gapLine = d3.line<DataPoint>()
        .defined((d, i, data) => {
          if (i === 0) return false;
          const prevDate = new Date(data[i - 1].datetime);
          const currDate = new Date(d.datetime);
          return (currDate.getTime() - prevDate.getTime()) > (1000 * 60 * 60 * 2); // 2-hour threshold
        })
        .x((d) => x(new Date(d.datetime)))
        .y((d) => y(d.value));

      g.append("path")
        .datum(typeData)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 1.5)
        .attr("d", gapLine);
    });
  };

  const handleTypeSelect = (index: number, type: string) => {
    const newSelectedTypes = [...selectedTypes];
    newSelectedTypes[index] = type;
    setSelectedTypes(newSelectedTypes);
  };

  const addPlot = () => {
    if (selectedTypes.length < 5) {
      setSelectedTypes([...selectedTypes, ""]);
    }
  };

  useEffect(() => {
    setZoom(100); // Set default zoom to 100%
  }, []);

  return (
    <div className="grid grid-cols-3 gap-7 pt-5">
      <div className="col-span-2 bg-white ml-8 pr-8 pt-3 pb-3">
        <svg ref={svgRef} width="100%" height="100%"></svg>
      </div>

      <div className="col-span-1 bg-medium-gray mr-8 pt-3 pb-3 flex flex-col space-y-3 overflow-hidden">
        <h1 className="flex items-center justify-center text-xl text-gray-800 font-bold pt-5">
          Line Plot
        </h1>
        <div className="flex flex-col space-y-2">
          {selectedTypes.map((type, index) => (
            <Menu
              as="div"
              key={index}
              className="relative inline-block text-left"
            >
              <MenuButton className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                {type || "Select Type"}
                <ChevronDownIcon className="-mr-1 size-5 text-gray-400" />
              </MenuButton>
              <MenuItems className="absolute z-50 right-1/2 transform translate-x-1/2 mt-2 w-56 bg-white shadow-lg ring-1 ring-black/5">
                {availableTypes
                  .filter((t) => !selectedTypes.includes(t))
                  .map((t) => (
                    <MenuItem key={t}>
                      <button
                        onClick={() => handleTypeSelect(index, t)}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t}
                      </button>
                    </MenuItem>
                  ))}
              </MenuItems>
            </Menu>
          ))}
          {selectedTypes.length < 1 && ( // keep to 1 plot for now
            <button
              onClick={addPlot}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Another Plot
            </button>
          )}
        </div>
        <h1 className="flex items-center justify-center text-xl text-gray-800 font-bold pt-5">
          Enter Date Constraints
        </h1>
        <div
          className={`flex items-center ${
            isSmallScreen ? "flex-col" : "space-x-4"
          } justify-center pt-4`}
        >
          <DateBoundElement value={startDate} onChange={setStartDate} />
          <span
            className={`${
              isSmallScreen ? "self-center pt-2" : "self-center"
            } font-bold`}
          >
            to
          </span>
          <DateBoundElement value={endDate} onChange={setEndDate} />
        </div>
        <div className="flex justify-center pt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShouldFetch(true)}
          >
            Graph
          </button>
        </div>
        <div className="flex flex-col items-center justify-center mt-auto">
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
