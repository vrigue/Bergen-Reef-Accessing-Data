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

export default function DataLineGraph() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState<string[]>([""]); // Initialize with one empty string
  const [zoom, setZoom] = useState(50);
  const [step, setStep] = useState(50);
  const [shouldFetch, setShouldFetch] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const availableTypes = [
    "Salinity",
    "ORP",
    "Temperature",
    "Alkalinity",
    "Calcium",
  ];

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false);
    }
  }, [shouldFetch]);

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

    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.datetime)) as [Date, Date])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.value) as [number, number])
      .nice()
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
    g.append("g").call(d3.axisLeft(y));

    const line = d3
      .line<DataPoint>()
      .x((d) => x(new Date(d.datetime)))
      .y((d) => y(d.value));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    selectedTypes.forEach((type, index) => {
      const typeData = data.filter((d) => d.type === type);
      g.append("path")
        .datum(typeData)
        .attr("fill", "none")
        .attr("stroke", color(index.toString()))
        .attr("stroke-width", 1.5)
        .attr("d", line);
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

  return (
    <div className="grid grid-cols-3 gap-7 pt-5">
      <div className="col-span-2 bg-white ml-8 pr-8 pt-3 pb-3">
        <svg ref={svgRef} width="800" height="400"></svg>
      </div>
      <div className="col-span-1 bg-medium-gray mr-8 pt-3 pb-3 flex flex-col space-y-3 overflow-hidden">
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
          {selectedTypes.length < 1 && ( // Limit to 5 plots
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
        <div className="flex space-x-4 justify-center pt-4">
          <DateBoundElement value={startDate} onChange={setStartDate} />
          <span className="self-center font-bold">to</span>
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