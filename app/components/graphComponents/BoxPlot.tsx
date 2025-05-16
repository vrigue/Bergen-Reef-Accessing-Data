"use client";

import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import "../../globals.css";
import DateBoundElement from "../DateBoundElement";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedName, setSelectedName] = useState<string>("Salinity");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [rangeMode, setRangeMode] = useState<
    "day" | "week" | "twoWeeks" | "custom"
  >("twoWeeks");
  const svgRef = useRef<SVGSVGElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Add refs to track previous state
  const prevParamsRef = useRef({
    startDate: startDate?.toISOString() || "",
    endDate: endDate?.toISOString() || "",
    selectedName,
  });

  const hasParamsChanged = () => {
    const currentParams = {
      startDate: startDate?.toISOString() || "",
      endDate: endDate?.toISOString() || "",
      selectedName,
    };

    const hasChanged =
      JSON.stringify(currentParams) !== JSON.stringify(prevParamsRef.current);

    if (hasChanged) {
      prevParamsRef.current = currentParams;
    }

    return hasChanged;
  };

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
    if (shouldFetch && hasParamsChanged()) {
      fetchData();
      setShouldFetch(false);
    } else if (shouldFetch) {
      // If parameters haven't changed, just reset the fetch flag
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
    setNow(today);
    setShouldFetch(true);
  }, []);

  async function fetchData() {
    try {
      startDate?.setHours(startDate.getHours() - 5);
      endDate?.setHours(endDate.getHours() - 5);
      const response = await fetch(
        `/api/searchDataByDateType?startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}&names=${selectedName}`
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
    const sortedData = [...data].map((d) => d.value).sort((a, b) => a - b);
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
    const outliers = sortedData.filter((d) => d < lowerBound || d > upperBound);

    return {
      min,
      q1,
      median,
      q3,
      max,
      outliers,
      timeRange: `${d3.timeFormat("%Y-%m-%d")(
        startDate || new Date()
      )} to ${d3.timeFormat("%Y-%m-%d")(endDate || new Date())}`,
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

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const boxPlotData = calculateBoxPlotData(data);

    // Create scales
    const x = d3.scaleLinear().domain([-0.5, 0.5]).range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min([boxPlotData.min, ...boxPlotData.outliers]) || 0,
        d3.max([boxPlotData.max, ...boxPlotData.outliers]) || 0,
      ])
      .range([height, 0])
      .nice();

    // Draw box
    const boxWidth = width * 0.1; // Reduced width for better centering
    const centerX = width / 2 + margin.left / 2; // Account for y-axis offset

    // Draw box
    g.append("rect")
      .attr("x", centerX - boxWidth / 2) // Center the box horizontally with y-axis offset
      .attr("y", y(boxPlotData.q3))
      .attr("width", boxWidth)
      .attr("height", y(boxPlotData.q1) - y(boxPlotData.q3))
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .on("mouseover", (event) => {
        tooltip
          .style("visibility", "visible")
          .html(
            `Q1: ${Number(boxPlotData.q1).toFixed(2)}<br/>Q3: ${Number(
              boxPlotData.q3
            ).toFixed(2)}<br/>IQR: ${Number(
              boxPlotData.q3 - boxPlotData.q1
            ).toFixed(2)}`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // Draw median line
    g.append("line")
      .attr("x1", centerX - boxWidth / 2)
      .attr("x2", centerX + boxWidth / 2)
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
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
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
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });
    };

    drawWhisker(boxPlotData.max, boxPlotData.q3, "Maximum");
    drawWhisker(boxPlotData.min, boxPlotData.q1, "Minimum");

    // Draw whisker caps
    g.append("line")
      .attr("x1", centerX - boxWidth / 2)
      .attr("x2", centerX + boxWidth / 2)
      .attr("y1", y(boxPlotData.max))
      .attr("y2", y(boxPlotData.max))
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    g.append("line")
      .attr("x1", centerX - boxWidth / 2)
      .attr("x2", centerX + boxWidth / 2)
      .attr("y1", y(boxPlotData.min))
      .attr("y2", y(boxPlotData.min))
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    // Draw outliers
    boxPlotData.outliers.forEach((outlier) => {
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
              `<strong>Outlier Value:</strong> ${Number(outlier).toFixed(
                2
              )}<br/><br/>` +
                `<strong>Expected Range:</strong><br/>` +
                `Lower bound: ${lowerBound.toFixed(2)}<br/>` +
                `Upper bound: ${upperBound.toFixed(2)}<br/>`
            );
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
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

    // Add x-axis label with date range
    const formatDateTime = d3.timeFormat("%m/%d/%Y %H:%M:%S");
    const dateLabel = `${formatDateTime(
      startDate || new Date()
    )} - ${formatDateTime(endDate || new Date())}`;

    g.append("text")
      .attr("fill", "black")
      .attr("x", width / 2 + margin.left / 2) // Adjust x position to match box plot centering
      .attr("y", height + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text(dateLabel);
  };

  const handleNameSelect = (name: string) => {
    if (name === selectedName) {
      return; // Don't update if name hasn't changed
    }
    setSelectedName(name);
    setShouldFetch(true);
  };

  const handleStartDateChange = (date: Date) => {
    if (date.toISOString() === startDate?.toISOString()) {
      return; // Don't update if date hasn't changed
    }
    setStartDate(date);
    setRangeMode("custom"); // Set to custom when manually changing dates
    setShouldFetch(true);
  };

  const handleEndDateChange = (date: Date) => {
    if (date.toISOString() === endDate?.toISOString()) {
      return; // Don't update if date hasn't changed
    }
    setEndDate(date);
    setRangeMode("custom"); // Set to custom when manually changing dates
    setShouldFetch(true);
  };

  const adjustDateRange = (direction: "forward" | "backward") => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const newStartDate = new Date(startDate || new Date());
    const newEndDate = new Date(endDate || new Date());

    let daysToAdjust;
    switch (rangeMode) {
      case "day":
        daysToAdjust = 1;
        break;
      case "week":
        daysToAdjust = 7;
        break;
      case "twoWeeks":
        daysToAdjust = 14;
        break;
      default:
        daysToAdjust = 1;
    }

    if (direction === "forward") {
      // Check if moving forward would exceed today
      if (newEndDate >= today) {
        return; // Don't allow moving past today
      }
      newStartDate.setDate(newStartDate.getDate() + daysToAdjust);
      newEndDate.setDate(newEndDate.getDate() + daysToAdjust);
    } else {
      newStartDate.setDate(newStartDate.getDate() - daysToAdjust);
      newEndDate.setDate(newEndDate.getDate() - daysToAdjust);
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setShouldFetch(true);
  };

  const setRangeModeWithDates = (mode: "day" | "week" | "twoWeeks") => {
    // Always update the date range and fetch, even if mode hasn't changed
    setRangeMode(mode);
    let newEndDate = new Date(endDate || new Date());
    let newStartDate = new Date(endDate || new Date());

    switch (mode) {
      case "day": {
        // Set to the same day, start at 00:00:00, end at 23:59:59
        newStartDate.setHours(0, 0, 0, 0);
        newEndDate.setHours(23, 59, 59, 999);
        break;
      }
      case "week": {
        newStartDate.setDate(newEndDate.getDate() - 6);
        newStartDate.setHours(0, 0, 0, 0);
        newEndDate.setHours(23, 59, 59, 999);
        break;
      }
      case "twoWeeks": {
        newStartDate.setDate(newEndDate.getDate() - 13);
        newStartDate.setHours(0, 0, 0, 0);
        newEndDate.setHours(23, 59, 59, 999);
        break;
      }
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setShouldFetch(true);
  };

  return (
    <div className="grid grid-cols-3 gap-7 h-full p-5">
      <div className="col-span-2 bg-white ml-8 pr-8 pt-3 pb-3 rounded-lg flex justify-center items-center">
        <div className="w-full h-full">
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            className="overflow-visible"
          ></svg>
        </div>
      </div>

      <div className="flex flex-col col-span-1 bg-white drop-shadow-md mr-8 pb-3 flex flex-col space-y-6 rounded-lg">
        <h1 className="text-xl bg-teal drop-shadow-xl text-white text-center font-semibold rounded-lg p-4">
          Box Plot
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
          <div className="w-1/2 bg-teal text-white font-semibold text-center p-2 m-4 mb-2 rounded-xl self-left">
            Enter Date Constraints
          </div>
          <div className="flex items-center justify-center space-x-2 px-3">
            <button
              onClick={() => adjustDateRange("backward")}
              className="bg-white p-2 rounded-lg hover:bg-medium-teal disabled:opacity-50"
            >
              <ChevronLeftIcon className="h-5 w-5 text-teal hover:text-white" />
            </button>
            <div
              className={`flex items-center flex-col justify-center rounded-lg pt-2 m-3 mt-1 text-lg text-neutral-700`}
            >
              <DateBoundElement
                value={startDate || new Date()}
                onChange={handleStartDateChange}
              />

              <div className="bg-teal p-1 pl-2 pr-2 mt-3 mb-3 rounded-lg">
                <span className="text-white font-semibold text-center">to</span>
              </div>

              <DateBoundElement
                value={endDate || new Date()}
                onChange={handleEndDateChange}
              />
            </div>
            <button
              onClick={() => adjustDateRange("forward")}
              className="bg-white p-2 rounded-lg hover:bg-medium-teal disabled:opacity-50"
              disabled={now && endDate && endDate >= now}
            >
              <ChevronRightIcon className="h-5 w-5 text-teal hover:text-white" />
            </button>
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => setRangeModeWithDates("day")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                rangeMode === "day"
                  ? "bg-teal text-white"
                  : "bg-white text-teal hover:bg-medium-teal hover:text-white"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setRangeModeWithDates("week")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                rangeMode === "week"
                  ? "bg-teal text-white"
                  : "bg-white text-teal hover:bg-medium-teal hover:text-white"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setRangeModeWithDates("twoWeeks")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                rangeMode === "twoWeeks"
                  ? "bg-teal text-white"
                  : "bg-white text-teal hover:bg-medium-teal hover:text-white"
              }`}
            >
              Two Weeks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
