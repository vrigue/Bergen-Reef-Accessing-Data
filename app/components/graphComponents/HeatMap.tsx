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

interface HeatMapData {
  week: number;
  day: number;
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
  const [selectedType, setSelectedType] = useState<string>("Salinity");
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
    const sevenWeeksAgo = new Date();
    sevenWeeksAgo.setDate(today.getDate() - 49); // 7 weeks = 49 days
    setStartDate(sevenWeeksAgo);
    setEndDate(today);
    setShouldFetch(true);
  }, []);

  async function fetchData() {
    try {
      startDate.setHours(startDate.getHours() - 5);
      endDate.setHours(endDate.getHours() - 5);
      const response = await fetch(
        `/api/searchDataByDateType?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&types=${selectedType}`
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
  }, [data, selectedType]);

  const processDataForHeatMap = (): HeatMapData[] => {
    const heatMapData: HeatMapData[] = [];
    const mappedType = typeMapping[selectedType];
    const typeData = data.filter((d) => d.name === mappedType);

    // Calculate the start of the first week
    const firstWeekStart = new Date(startDate);
    firstWeekStart.setHours(0, 0, 0, 0);

    // Group data by week and day
    typeData.forEach((d) => {
      const date = new Date(d.datetime);
      const week = Math.floor((date.getTime() - firstWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const day = date.getDay();
      heatMapData.push({
        week,
        day,
        value: d.value,
      });
    });

    return heatMapData;
  };

  const drawChart = () => {
    if (!selectedType) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 100, bottom: 30, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const heatMapData = processDataForHeatMap();
    
    // Calculate the value range for color scaling
    const valueRange = d3.extent(heatMapData, d => d.value) as [number, number];
    const colorScale = d3.scaleSequential()
      .domain(valueRange)
      .interpolator(d3.interpolateRdYlBu);

    // Create the heat map grid
    const cellWidth = width / 7;
    const cellHeight = height / 7;

    // Add cells
    g.selectAll("rect")
      .data(heatMapData)
      .enter()
      .append("rect")
      .attr("x", d => d.week * cellWidth)
      .attr("y", d => d.day * cellHeight)
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("fill", d => colorScale(d.value))
      .attr("stroke", "white")
      .attr("stroke-width", 1);

    // Add week labels with actual dates
    const weekLabels = d3.range(7).map(week => {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + week * 7);
      return d3.timeFormat("%b %d")(weekStart);
    });

    g.selectAll(".week-label")
      .data(weekLabels)
      .enter()
      .append("text")
      .attr("class", "week-label")
      .attr("x", (d, i) => i * cellWidth + cellWidth / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .text(d => d);

    // Add day labels
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    g.selectAll(".day-label")
      .data(days)
      .enter()
      .append("text")
      .attr("class", "day-label")
      .attr("x", -5)
      .attr("y", d => days.indexOf(d) * cellHeight + cellHeight / 2)
      .attr("text-anchor", "end")
      .text(d => d);

    // Add color legend
    const legendWidth = 20;
    const legendHeight = 200;
    const legendX = width + 20;
    const legendY = 0;

    const legendScale = d3.scaleLinear()
      .domain(valueRange)
      .range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5);

    g.append("g")
      .attr("transform", `translate(${legendX},${legendY})`)
      .call(legendAxis);

    // Add color gradient
    const gradient = g.append("defs")
      .append("linearGradient")
      .attr("id", "color-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.selectAll("stop")
      .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100 * i / n.length}%`, color: colorScale(t) })))
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    g.append("rect")
      .attr("x", legendX - legendWidth)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#color-gradient)");

    // Add legend title
    g.append("text")
      .attr("x", legendX + 30)
      .attr("y", legendY - 10)
      .attr("text-anchor", "middle")
      .text(`${selectedType} (${units[selectedType]})`);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    // Calculate end date as 7 weeks from start date
    const newEndDate = new Date(date);
    newEndDate.setDate(date.getDate() + 49); // 7 weeks = 49 days
    setEndDate(newEndDate);
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
    // Calculate start date as 7 weeks before end date
    const newStartDate = new Date(date);
    newStartDate.setDate(date.getDate() - 49); // 7 weeks = 49 days
    setStartDate(newStartDate);
  };

  return (
    <div className="grid grid-cols-3 gap-7 pt-5">
      <div className="col-span-2 bg-white ml-8 pr-8 pt-3 pb-3 rounded-lg">
        <svg ref={svgRef} width="100%" height="100%"></svg>
      </div>

      <div className="flex flex-col col-span-1 bg-white drop-shadow-md mr-8 pb-3 flex flex-col space-y-6 rounded-lg">
        <h1 className="text-xl bg-teal drop-shadow-xl text-white text-center font-semibold rounded-lg p-4">
          Heat Map
        </h1>
        <div className="flex flex-col">
          <Menu as="div" className="relative inline-block text-left m-3">
            <MenuButton className="inline-flex w-full justify-center rounded-xl bg-white px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
              <span style={{ color: d3.schemeCategory10[0] }}>
                {selectedType || "Select Type"}
              </span>
              <ChevronDownIcon className="-mr-1 size-6 text-sky-700" />
            </MenuButton>
            <MenuItems className="z-50 right-1/2 transform translate-x-1/2 mt-2 w-56 bg-white shadow-lg ring-1 ring-black/5">
              {availableTypes.map((type) => (
                <MenuItem key={type}>
                  <button
                    onClick={() => handleTypeSelect(type)}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {type}
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
            className={`flex items-center ${
              isSmallScreen ? "flex-col" : "space-x-4"
            } justify-center rounded-lg pt-2 m-3 mt-1 text-sm text-neutral-700`}
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

function setData(newData: DataPoint[]) {
  setData(newData);
}