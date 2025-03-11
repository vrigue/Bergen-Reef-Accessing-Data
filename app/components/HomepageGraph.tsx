"use client";
import { string } from "prop-types";
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function HomepageGraph() {
  const [chartData, setChartData] = useState([]);
  const [selectedType, setSelectedTypes] = useState<string | undefined>("pH");

  const handleChange = (e) => {
    setSelectedTypes(e.target.value);
  };
  
  useEffect(() => {
    async function fetchData() {
      if (selectedType.length === 0) return; // Prevent empty API calls

      try {
        const response = await fetch(
          `/api/getMostRecentData?type=${selectedType}`
        );
        const result = await response.json();

        console.log("Fetched data:", result);

        if (!Array.isArray(result)) {
          console.error("Unexpected API response:", result);
          return;
        }

        // Filter and format data
        const filteredData = result
          .filter((item) => selectedType.includes(item.name)) // Fix comparison
          .map((item) => ({
            ...item,
            datetime: new Date(item.datetime).toLocaleString(), // Fix datetime format
          }));

        console.log("Filtered data:", filteredData);
        const reversedData = filteredData.reverse();
        setChartData(reversedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [selectedType]); // Runs when selectedType changes

  return (
    <div>
      <select
          style={{
            float: "right",
            width: "750px",
            height: "30px",
            textAlign: "center",
            marginRight: 80,
            marginTop: -10,
          }} // could also use "left" here for og
          onChange={handleChange}
          value={selectedType}
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white  ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <option value="pH">PH</option>
          <option value="Salt">Salinity</option>
          <option value="Tmp">Temperature</option>
          <option value="ORP">Oxidation Reduction Potential (ORP)</option>
          <option value="Alkx4">Alkalinity</option>
          <option value="Cax4">Calcium</option>
      </select>
      <br></br>
      <br></br>
      <LineChart width={800} height={450} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="datetime" tickFormatter={(tick) => tick.substring(0, 16)}/>
        <YAxis domain={['dataMin - 1', 'dataMax + 1']}/>
        <Tooltip/>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
