"use client";
import { string } from "prop-types"; // not used
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "../globals.css";

const infoContent = {
  pH: 'This is the pH info!',
  Cax4: 'This is the calcium info!',
  Alkx4: 'This is the alkalinity info!',
  ORP: 'This is the ORP info!',
  Tmp: 'This is the temperature info!',
  Salt: 'This is the salinity info!',
};


export default function HomePageGraph() {
  const [chartData, setChartData] = useState([]);
  const [selectedType, setSelectedTypes] = useState<string | undefined>("pH");
  const [selectedInfo, setSelectedInfo] = React.useState(infoContent.pH);

  //setSelectedTypes("pH");

  const handleChange = (e) => {
    setSelectedTypes(e.target.value);
    setSelectedInfo(infoContent[e.target.value])
  };
  
  //getting chart data for the graph from the api
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
      <select //dropdown selecting element for graph
            style={{
              float: "right",
              width: "840px",
              height: "30px",
              textAlign: "center",
              marginRight: 45,
              marginTop: -50
            }} // could also use "left" here for og
            onChange={handleChange}
            value={selectedType}
            className="absolute right-0 z-10 mt-2 w-3/4 origin-top-right rounded-md bg-teal text-white font-semibold ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <option value="pH">PH</option>
            <option value="Salt">Salinity</option>
            <option value="Tmp">Temperature</option>
            <option value="ORP">Oxidation Reduction Potential (ORP)</option>
            <option value="Alkx4">Alkalinity</option>
            <option value="Cax4">Calcium</option>
      </select>
      
      <div className="bg-white rounded-lg p-5">
        <LineChart width={800} height={450} data={chartData}> 
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="datetime" tickFormatter={(tick) => tick.substring(0, 16)}/>
          <YAxis domain={['dataMin - 1', 'dataMax + 1']}/>
          <Tooltip/>
          <Line type="monotone" dataKey="value" stroke="#feb934" />
        </LineChart>
      </div>
      
      <br></br>
      <br></br>
      <div
        className="mt-4 p-9 bg-white drop-shadow-orange rounded-lg"
        style={{
          fontSize: "16px",
          fontWeight: "normal",
          color: "#333",
          }}
      >
        {selectedInfo}
      </div>
    </div>
  );
}
