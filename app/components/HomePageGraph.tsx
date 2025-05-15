"use client";
import { string } from "prop-types"; // not used
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "../globals.css";

const infoContent = {
  pH: 'PH measures the acidity or alkalinity of the water. An ideal, stable pH promotes coral growth, allows them to expand their skeletons, and assists in nutrient availability.',
  Calcium: 'Calcium is a crucial component for coral skeletons and is one of the most abundant ions in seawater. Without enough calcium, stony corals cannot grow or strengthen their foundations, so dosing this supplement is a key part of maintaining a healthy reef tank.',
  Alkalinity: 'Alkalinity prevents drastic swings in pH and provides carbonate for coral growth. Since corals use alkalinity very often, it has to be regularly supplemented in the reef tank and balanced with calcium to provide sufficient calcium carbonate for coral skeletons.',
  ORP: 'ORP provides reef-keepers with a way to monitor water quality and stability, with the most drastic changes being seen when decaying organic matter is present in the tank. This level is maintained through additional filtration such as UV sterilizers or activated carbon.',
  Temperature: 'Temperature is one of the most prominent concerns in coral reefs, causing many massive bleaching events from global temperature rise. A substantial increase in temperature can cause corals to expel zooxanthellae from their tissue, causing them to turn white and die quickly.',
  Salinity: 'Salt provides the necessary minerals to maintain the environment in a reef tank. Keeping a desirable salinity level and selecting a high-quality reef salt mix provides an opportunity to replicate seawater conditions.',
  Nitrate: 'Nitrate results in a reef tank from the breakdown of organic matter. It is an important nutrient due to its use by zooxanthellae, a microscopic algae housed in coral polyps which has a symbiotic relationship with coral. Too much nitrate can result in algae blooms and cause corals to lose their vibrant colors.',
  Nitrite: 'Nitrite is harmful to many of the organisms in a reef tank and needs to be managed so that its levels stay almost undetectable. This is done by establishing beneficial bacteria in the tank through a dark cycle before any animals are placed in it.',
  Phosphate: 'Phosphate presence is necessary for coral tissue growth, but too much can actually reduce growth and bring algae to the tank which will compete with the corals for nutrients. Regular water changes and proper filtration allow reef keepers to regulate these levels.',
};


export default function HomePageGraph() {
  const [chartData, setChartData] = useState([]);
  const [selectedType, setSelectedTypes] = useState<string | undefined>("Salinity");
  const [selectedInfo, setSelectedInfo] = React.useState(infoContent.Salinity);

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
    const interval = setInterval(fetchData, 300000); // Fetch every 5 minutes (300,000 ms) (10,000)
    console.log("fetched the data pooks");
    return () => clearInterval(interval);
  }, [selectedType]); // Runs when selectedType changes

  return (
    <>
      <div className="flex flex-col items-center w-full px-4">
        {/* Dropdown */}
        <div className="w-full max-w-screen-2xl min-w-[750px] mb-4">
          <select
            onChange={handleChange}
            value={selectedType}
            className="w-full h-10 text-center rounded-md bg-teal md:text-lg text-white font-semibold ring-1 ring-black/5 transition focus:outline-none"
          >
            <option value="pH">PH</option>
            <option value="Salinity">Salinity</option>
            <option value="Temperature">Temperature</option>
            <option value="ORP">Oxidation Reduction Potential (ORP)</option>
            <option value="Alkalinity">Alkalinity</option>
            <option value="Calcium">Calcium</option>
            <option value="Nitrate">Nitrate</option>
            <option value="Phosphate">Phosphate</option>
            <option value="Nitrite">Nitrite</option>
          </select>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg p-4 w-full max-w-screen-2xl min-w-[750px]">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="datetime"
                tickFormatter={(tick) => tick.split("/")[0] + "/" + tick.split("/")[1]}
                stroke="#000000"
              />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                tickFormatter={(tick) => tick.toString().split(".")[0]}
                stroke="#000000"
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#feb934"
                dot={false}
                strokeWidth={2.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Text Area */}
        <div className="mt-6 w-full max-w-screen-2xl min-w-[750px] p-4 bg-white drop-shadow-orange rounded-lg text-base md:text-lg text-gray-800">
          {selectedInfo}
        </div>
      </div>
    </>
  );
}
