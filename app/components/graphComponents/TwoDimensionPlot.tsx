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
  pH: "pH",
};

export default function DataLineGraph() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Temperature", "ORP"]);
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
    setSelectedTypes(["Temperature", "ORP"]);
    setShouldFetch(true);
  }, []);

  async function fetchData() {
    try {
      startDate.setHours(startDate.getHours() - 5);
      endDate.setHours(endDate.getHours() - 5);
      const response = await fetch(
        `/api/searchDataByDateType?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&types=${selectedTypes.join(",")}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DataPoint[] = await response.json();
      const filteredData = result.filter((d, i, arr) =>
        arr.some((other) =>
          other.datetime === d.datetime &&
          other.name === typeMapping[selectedTypes[0]] &&
          d.name === typeMapping[selectedTypes[1]]
        )
      );
      setData(filteredData);
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
    if (selectedTypes.length < 2 || selectedTypes[0] === selectedTypes[1]) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 60, bottom: 120, left: 90 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain(d3.extent(data, (d) => d.value)).range([0, width]);
    const y = d3.scaleLinear().domain(d3.extent(data, (d) => d.value)).range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    // Plot points
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.value))
      .attr("cy", (d) => y(d.value))
      .attr("r", 4)
      .attr("fill", "steelblue");

    g.append("text")
      .attr("fill", "black")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10) // Position it below the axis
      .attr("text-anchor", "middle")
      .text(`${selectedTypes[0]} (${units[selectedTypes[0]]})`);

    g.append("text")
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("text-anchor", "middle")
      .text(`${selectedTypes[1]} (${units[selectedTypes[1]]})`);
  };

  const handleTypeSelect = (index: number, type: string) => {
    const newSelectedTypes = [...selectedTypes];
    newSelectedTypes[index] = type;
    if (newSelectedTypes[0] !== newSelectedTypes[1]) {
      setSelectedTypes(newSelectedTypes);
    }
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
      <div className="col-span-2 bg-white ml-8 pr-8 pt-3 pb-3 rounded-lg">
        <svg ref={svgRef} width="100%" height="100%"></svg>
      </div>

      <div className="col-span-1 bg-medium-gray mr-8 pt-3 pb-3 flex flex-col space-y-3 overflow-hidden rounded-lg">
        <h1 className="flex items-center justify-center text-xl text-gray-800 font-bold pt-5">
          Two Dimensional Plot
        </h1>
        <div className="flex flex-col space-y-2">
          {selectedTypes.map((type, index) => (
            <Menu
              as="div"
              key={index}
              className="relative inline-block text-left"
            >
              <MenuButton className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                <span style={{ color: colorScale(index) }}>
                  {type || "Select Type"}
                </span>
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
          {selectedTypes.length < 2 && ( // keep to 2 plots for now
            <button
              onClick={addPlot}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Another Plot
            </button>
          )}
          {selectedTypes.length > 1 && (
            <button
              onClick={() => setSelectedTypes(selectedTypes.slice(0, -1))}
              className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Remove Last Plot
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
