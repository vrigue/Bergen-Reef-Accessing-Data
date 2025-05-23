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

interface HeatMapData {
  week: number;
  day: number;
  value: number;
  minValue: number;
  maxValue: number;
}

const units = {
  Salinity: "ppt",
  ORP: "mV",
  Temperature: "°F",
  Alkalinity: "dKH",
  Calcium: "ppm",
  pH: "no unit",
};

// Helper to format date as YYYY-MM-DDTHH:mm:ss in local time
function formatLocalDateTime(date: Date) {
  // Create a new date object to avoid modifying the original
  const adjustedDate = new Date(date);
  // Add 5 hours for local time offset
  adjustedDate.setHours(adjustedDate.getHours() + 5);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${adjustedDate.getFullYear()}-${pad(adjustedDate.getMonth() + 1)}-${pad(
    adjustedDate.getDate()
  )}T${pad(adjustedDate.getHours())}:${pad(adjustedDate.getMinutes())}:${pad(
    adjustedDate.getSeconds()
  )}`;
}

export default function DataLineGraph() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedName, setSelectedName] = useState<string>("Salinity");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [numWeeks, setNumWeeks] = useState(7);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  const [zoom, setZoom] = useState(1);
  const [step, setStep] = useState(1);

  const availableNames = [
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
    const today = new Date();
    const weeksAgo = new Date();
    weeksAgo.setDate(today.getDate() - 7 * 7);
    setStartDate(weeksAgo);
    setEndDate(today);
    setNumWeeks(7);
    setShouldFetch(true);
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
      const response = await fetch(
        `/api/searchDataByDateType?startDate=${formatLocalDateTime(
          startDate
        )}&endDate=${formatLocalDateTime(endDate)}&names=${selectedName}`
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

  const processDataForHeatMap = (): HeatMapData[] => {
    const heatMapData: HeatMapData[] = [];
    const nameData = data.filter((d) => d.name === selectedName);
    // Calculate the start of the first week
    const firstWeekStart = new Date(startDate);
    firstWeekStart.setHours(0, 0, 0, 0);
    
    // Create a map to store values for each week/day combination
    const valueMap = new Map<string, number[]>();
    
    // Group data by week and day
    nameData.forEach((d) => {
      const date = new Date(d.datetime);
      const week = Math.floor(
        (date.getTime() - firstWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
      if (week >= 0 && week < numWeeks) {
        const day = date.getDay();
        const key = `${week}-${day}`;
        if (!valueMap.has(key)) {
          valueMap.set(key, [d.value]);
        } else {
          valueMap.get(key)!.push(d.value);
        }
      }
    });

    // Convert map to array format, calculating median for each cell
    valueMap.forEach((values, key) => {
      const [week, day] = key.split("-").map(Number);
      // Ensure all values are numbers
      const numericValues = values.map((v) => Number(v));
      const sortedValues = [...numericValues].sort((a, b) => a - b);
      const median =
        sortedValues.length % 2 === 0
          ? (sortedValues[Math.floor(sortedValues.length / 2) - 1] +
              sortedValues[Math.floor(sortedValues.length / 2)]) /
            2
          : sortedValues[Math.floor(sortedValues.length / 2)];

      heatMapData.push({
        week,
        day,
        value: Number(median),
        minValue: Number(Math.min(...numericValues)),
        maxValue: Number(Math.max(...numericValues)),
      });
    });

    return heatMapData;
  };

  const drawChart = () => {
    if (!selectedName) return;

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

    // Remove any existing tooltips
    d3.selectAll(".tooltip").remove();

    const margin = { top: 30, right: 150, bottom: 60, left: 70 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add tooltip div
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("pointer-events", "none")
      .style("font-size", "14px")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)");

    const heatMapData = processDataForHeatMap();

    // Calculate quartiles and IQR for outlier detection
    const values = heatMapData
      .map((d) => Number(d.value))
      .sort((a, b) => a - b);
    const q1 = d3.quantile(values, 0.25) || 0;
    const q3 = d3.quantile(values, 0.75) || 0;
    const iqr = q3 - q1;
    const upperBound = q3 + 1.5 * iqr;
    const lowerBound = q1 - 1.5 * iqr;

    // Calculate the value range for color scaling, excluding outliers
    const valueRange: [number, number] = [
      Math.max(lowerBound, d3.min(values) || 0),
      Math.min(upperBound, d3.max(values) || 0),
    ];

    // Create color scale that emphasizes variation
    const colorScale = d3
      .scaleSequential()
      .domain([valueRange[0], valueRange[1]])
      .interpolator(d3.interpolateRdYlBu)
      .clamp(true);

    // Create the heat map grid
    const cellWidth = width / numWeeks;
    const cellHeight = height / 7;

    // Create all possible week-day combinations
    const allCells = [];
    for (let week = 0; week < numWeeks; week++) {
      for (let day = 0; day < 7; day++) {
        allCells.push({ week, day });
      }
    }

    // Calculate week start dates
    const weekStartDates = d3.range(numWeeks).map((week) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + week * 7);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    // For the y-axis, generate labels by cycling from the first week's start day
    const firstDayOfWeek = weekStartDates[0].getDay();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const yAxisDays = d3.range(7).map((i) => days[(firstDayOfWeek + i) % 7]);

    // Add background cells for all positions
    g.selectAll(".background-cell")
      .data(allCells)
      .enter()
      .append("rect")
      .attr("class", "background-cell")
      .attr("x", (d) => d.week * cellWidth)
      .attr("y", (d) => d.day * cellHeight)
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("fill", "#f0f0f0")
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .on("mouseover", function (event, d) {
        // Calculate the actual date for this cell
        const cellDate = new Date(weekStartDates[d.week]);
        cellDate.setDate(cellDate.getDate() + d.day);
        cellDate.setHours(0, 0, 0, 0);
        const formattedDate = d3.timeFormat("%Y-%m-%d")(cellDate);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `${formattedDate}<br/>No data available`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Add cells with data
    g.selectAll(".data-cell")
      .data(heatMapData.filter((d) => d.week < numWeeks))
      .enter()
      .append("rect")
      .attr("class", "data-cell")
      .attr("x", (d) => d.week * cellWidth)
      .attr("y", (d) => d.day * cellHeight)
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("fill", (d) => {
        return d.value > upperBound
          ? "#67000d"
          : d.value < lowerBound
          ? "#053061"
          : colorScale(d.value);
      })
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .on("mouseover", function (event, d) {
        // Calculate the actual date for this cell
        const cellDate = new Date(weekStartDates[d.week]);
        cellDate.setDate(cellDate.getDate() + d.day);
        cellDate.setHours(0, 0, 0, 0);
        const formattedDate = d3.timeFormat("%Y-%m-%d")(cellDate);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `${formattedDate}<br/>
          Median: ${d.value.toFixed(2)} ${units[selectedName]}<br/>
          Min: ${d.minValue.toFixed(2)} ${units[selectedName]}<br/>
          Max: ${d.maxValue.toFixed(2)} ${units[selectedName]}${
              d.value > upperBound
                ? "<br/>(High Outlier)"
                : d.value < lowerBound
                ? "<br/>(Low Outlier)"
                : ""
            }`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Add a note about missing data
    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + 30)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#666")
      .text("Gray cells = No data");

    // Add week labels with actual dates (top cell of each column)
    const weekLabels = d3.range(numWeeks).map((week) => {
      const topCellDate = new Date(startDate);
      topCellDate.setDate(startDate.getDate() + week * 7);
      topCellDate.setHours(0, 0, 0, 0);
      return d3.timeFormat("%m-%d")(topCellDate);
    });

    // Filter week labels if needed
    const filteredWeekLabels = isSmallScreen && numWeeks > 7 
      ? weekLabels.filter((_, i) => i % 2 === 0)
      : weekLabels;

    g.selectAll(".week-label")
      .data(filteredWeekLabels)
      .enter()
      .append("text")
      .attr("class", "week-label")
      .attr("x", (d, i) => {
        const weekIndex = isSmallScreen && numWeeks > 7 ? i * 2 : i;
        return weekIndex * cellWidth + cellWidth / 2;
      })
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text((d) => d);

    // Add day labels (y-axis), starting from the first week's start day
    g.selectAll(".day-label")
      .data(yAxisDays)
      .enter()
      .append("text")
      .attr("class", "day-label")
      .attr("x", -5)
      .attr("y", (d, i) => i * cellHeight + cellHeight / 2)
      .attr("text-anchor", "end")
      .style("font-size", "18px")
      .text((d) => d);

    // Add color legend
    const legendWidth = 20;
    const legendHeight = height * 0.8;
    const legendX = width + 60;
    const legendY = height * 0.15;

    const legendScale = d3
      .scaleLinear()
      .domain(valueRange)
      .range([legendHeight, 0]);

    // Create evenly spaced ticks
    const numTicks = 5;
    const ticks = d3.range(numTicks).map((i) => {
      const t = i / (numTicks - 1);
      return valueRange[0] + t * (valueRange[1] - valueRange[0]);
    });

    const legendAxis = d3
      .axisRight(legendScale)
      .tickValues([...ticks, upperBound])
      .tickFormat((d) => {
        const value = parseFloat(d);
        return value === upperBound ? `>${value.toFixed(2)}` : value.toFixed(2);
      });

    // Add legend title
    g.append("text")
      .attr("x", legendX)
      .attr("y", legendY - 65)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(selectedName === "Temperature" ? "Temp" : selectedName);

    // Add units below
    g.append("text")
      .attr("x", legendX)
      .attr("y", legendY - 35)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(`Median`);

    g.append("text")
      .attr("x", legendX)
      .attr("y", legendY - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(`(${units[selectedName]})`);

    // Create gradient stops
    const gradientStops = [
      ...ticks.map((t, i) => ({
        offset: `${(100 * i) / (numTicks - 1)}%`,
        color: colorScale(t),
      })),
      { offset: "100%", color: "#67000d" },
    ];

    const gradient = g
      .append("defs")
      .append("linearGradient")
      .attr("id", "color-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    gradient
      .selectAll("stop")
      .data(gradientStops)
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    // Move the legend rectangle and axis down slightly
    const legendYOffset = 20;

    g.append("rect")
      .attr("x", legendX - legendWidth)
      .attr("y", legendY + legendYOffset)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#color-gradient)");

    // Adjust the legend axis position to match the rectangle
    g.append("g")
      .attr("transform", `translate(${legendX},${legendY + legendYOffset})`)
      .call(legendAxis)
      .selectAll("text")
      .style("font-size", "18px");
  };

  const handleNameSelect = (name: string) => {
    setSelectedName(name);
    setShouldFetch(true);
  };

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    // Set end date to keep the range
    const newEndDate = new Date(date);
    newEndDate.setDate(date.getDate() + numWeeks * 7);
    setEndDate(newEndDate);
    setShouldFetch(true);
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
    // Set start date to keep the range
    const newStartDate = new Date(date);
    newStartDate.setDate(date.getDate() - numWeeks * 7);
    setStartDate(newStartDate);
    setShouldFetch(true);
  };

  const handleWeeksChange = (weeks: number) => {
    const today = new Date();
    let newNumWeeks = weeks;
    let newEndDate = new Date(endDate);
    if (newEndDate > today) {
      newEndDate = today;
    }
    let newStartDate = new Date(newEndDate);
    newStartDate.setDate(newEndDate.getDate() - newNumWeeks * 7);
    setNumWeeks(newNumWeeks);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
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
          Heat Map
        </h1>
        <div className="flex flex-col">
          <Menu as="div" className="relative inline-block text-left m-3">
            <MenuButton className="inline-flex w-full justify-center outline outline-1 outline-medium-blue rounded-xl bg-light-blue px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
              <span className="text-blue font-semibold">
                {selectedName || "Select Name"}
              </span>
              <ChevronDownIcon className="-mr-1 size-6 text-blue" />
            </MenuButton>
            <MenuItems className="w-full z-50 right-1/2 transform mt-2 w-56 bg-light-blue rounded-xl shadow-lg ring-1 ring-black/5">
              {availableNames.map((name) => (
                <MenuItem key={name}>
                  <button
                    onClick={() => handleNameSelect(name)}
                    className="block w-full px-4 py-2 text-md text-blue font-semibold hover:bg-medium-orange"
                  >
                    {name}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        <div className="flex flex-col bg-light-teal m-3 pb-5 rounded-lg">
          <div className="bg-teal text-white font-semibold text-center p-2 m-4 mb-2 rounded-xl self-center mx-auto w-fit group relative">
            Date Constraints
            <div className="absolute left-1/2 top-full z-10 mt-2 w-[290px] -translate-x-1/3 bg-white p-3 rounded-lg self-left shadow-sm text-center text-sm text-medium-teal opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Note: The date range will always be the weeks represented.
            </div>
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

          <div className="flex flex-col items-center justify-center ml-3 mr-3">
            <StepSlider value={numWeeks} onChange={handleWeeksChange} />
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
