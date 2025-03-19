"use client";
import { string } from "prop-types"; // not used
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "../globals.css";

const infoContent = {
  pH: 'PH measures the acidity or alkalinity of the water. An ideal, stable pH promotes coral growth, allows them to expand their skeletons, and assists in nutrient availability.',
  Cax4: 'Calcium is a crucial component for coral skeletons and is one of the most abundant ions in seawater. Without enough calcium, stony corals cannot grow or strengthen their foundations, so dosing this supplement is a key part of maintaining a healthy reef tank.',
  Alkx4: 'This is the alkalinity info!',
  ORP: 'ORP provides reef-keepers with a way to monitor water quality and stability, with the most drastic changes being seen when decaying organic matter is present in the tank. This level is maintained through additional filtration such as UV sterilizers or activated carbon.',
  Tmp: 'Temperature is one of the most prominent concerns in coral reefs, causing many massive bleaching events from global temperature rise. A substantial increase in temperature can cause corals to expel zooxanthellae from their tissue, causing them to turn white and die quickly.',
  Salt: 'Salt provides the necessary minerals to maintain the environment in a reef tank. Keeping a desirable salinity level and selecting a high-quality reef salt mix provides an opportunity to replicate seawater conditions.',
};


export default function HomePageGraph() {
  const [chartData, setChartData] = useState([]);
  const [selectedType, setSelectedTypes] = useState<string | undefined>("Salt");
  const [selectedInfo, setSelectedInfo] = React.useState(infoContent.Salt);

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
    const interval = setInterval(fetchData, 10000); // Fetch every 5 minutes (300,000 ms) (10,000)
    console.log("fetched the data pooks");
    return () => clearInterval(interval);
  }, [selectedType]); // Runs when selectedType changes

  return (

    <div className="flex flex-col">
      <select //dropdown selecting element for graph
            style={{
              float: "right",
              width: "840px",
              height: "30px",
              textAlign: "center",
              marginTop: -47
            }} // could also use "left" here for og
            onChange={handleChange}
            value={selectedType}
            className="mb-6 z-10 w-3/4 origin-top-right rounded-md bg-teal text-white font-semibold ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
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
          <XAxis dataKey="datetime" tickFormatter={(tick) => tick.substring(0, 4)}/>
          <YAxis domain={['dataMin - 1', 'dataMax + 1']}/>
          <Tooltip/>
          <Line type="monotone" dataKey="value" stroke="#feb934" dot={false} />
        </LineChart>
      </div>
      
      
      <div  //Text Area for the element information
        className="mt-6 p-10 bg-white drop-shadow-orange rounded-lg"
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
