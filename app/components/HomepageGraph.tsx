"use client";
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function HomepageGraph() {
  const [chartData, setChartData] = useState([]);
  const [selectedType, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (selectedType.length === 0) return; // Prevent empty API calls

      try {
        const response = await fetch(
          `/api/getMostRecentData?types=${selectedType.join(",")}`
        );
        const result = await response.json();

        console.log("Fetched data:", result);

        if (!Array.isArray(result)) {
          console.error("Unexpected API response:", result);
          return;
        }

        // Filter and format data
        const filteredData = result
          .filter((item) => selectedType.includes(item.type)) // Fix comparison
          .map((item) => ({
            ...item,
            datetime: new Date(item.datetime).toLocaleString(), // Fix datetime format
          }));

        console.log("Filtered data:", filteredData);

        setChartData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [selectedType]); // Runs when selectedType changes

  return (
    <LineChart width={600} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="datetime" tickFormatter={(tick) => tick.substring(0, 16)} />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  );
}
