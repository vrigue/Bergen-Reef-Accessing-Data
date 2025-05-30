"use client";
import { string } from "prop-types"; // not used
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "../globals.css";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const infoContent = {
  pH: 'PH measures the acidity or alkalinity of the water. An ideal, stable pH promotes coral growth, allows them to expand their skeletons, and assists in nutrient availability.',
  Calcium: 'Calcium is a crucial component for coral skeletons and is one of the most abundant ions in seawater. Without enough calcium, stony corals cannot grow or strengthen their foundations, so dosing this supplement is a key part of maintaining a healthy reef tank.',
  Alkalinity: 'Alkalinity prevents drastic swings in pH and provides carbonate for coral growth. Since corals use alkalinity very often, it has to be regularly supplemented in the reef tank and balanced with calcium to provide sufficient calcium carbonate for coral skeletons.',
  ORP: 'ORP provides reef-keepers with a way to monitor water quality and stability, with the most drastic changes being seen when decaying organic matter is present in the tank. This level is maintained through additional filtration such as UV sterilizers or activated carbon.',
  Temperature: 'Temperature is one of the most prominent concerns in coral reefs, causing many massive bleaching events from global temperature rise. A substantial increase in temperature can cause corals to expel zooxanthellae, causing them to turn white and die quickly.',
  Salinity: 'Salt provides the necessary minerals to maintain the environment in a reef tank. Keeping a desirable salinity level and selecting a high-quality reef salt mix provides an opportunity to replicate seawater conditions.',
  Nitrate: 'Nitrate results in a reef tank from the breakdown of organic matter. It is an important nutrient due to its use by zooxanthellae, a microscopic algae housed in coral polyps which has a symbiotic relationship with coral. Too much nitrate can result in algae blooms and cause corals to lose their vibrant colors.',
  Nitrite: 'Nitrite is harmful to many of the organisms in a reef tank and needs to be managed so that its levels stay almost undetectable. This is done by establishing beneficial bacteria in the tank through a dark cycle before any animals are placed in it.',
  Phosphate: 'Phosphate presence is necessary for coral tissue growth, but too much can actually reduce growth and bring algae to the tank which will compete with the corals for nutrients. Regular water changes and proper filtration allow reef keepers to regulate these levels.',
};

interface HomePageGraphProps {
  selectedType: string;
  onTypeSelectAction: (type: string) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  selectedType?: string;
}

const CustomTooltip = ({ active, payload, label, selectedType }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    // Parse the datetime string and add 6 hours
    const date = new Date(label);
    date.setHours(date.getHours() + 6);
    
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow">
        <p className="text-sm">{date.toLocaleString()}</p>
        <p className="text-sm font-semibold">{`${selectedType}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function HomePageGraph({ selectedType, onTypeSelectAction }: HomePageGraphProps) {
  const [chartData, setChartData] = useState([]);
  const [selectedInfo, setSelectedInfo] = React.useState(infoContent[selectedType]);

  const handleChange = (e) => {
    onTypeSelectAction(e.target.value);
    setSelectedInfo(infoContent[e.target.value]);
  };
  
  useEffect(() => {
    async function fetchData() {
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
          .filter((item) => selectedType.includes(item.name))
          .map((item) => {
            const date = new Date(item.datetime);
            date.setHours(date.getHours() - 2);
            
            return {
              ...item,
              datetime: date.toLocaleString(),
            };
          });

        console.log("Filtered data:", filteredData);
        const reversedData = filteredData.reverse();
        setChartData(reversedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [selectedType]);

  useEffect(() => {
    setSelectedInfo(infoContent[selectedType]);
  }, [selectedType]);

  return (
    <>
      <div className="flex flex-col items-center w-full min-h-screen px-4">
        {/* DROPDOWN MENU */}
        <div className="w-full max-w-screen-2xl min-w-[750px] mb-4">
          <Menu as="div" className="relative inline-block text-left w-full">
            <MenuButton className="w-full h-10 text-center rounded-md bg-teal md:text-lg text-white font-semibold ring-1 ring-black/5 transition focus:outline-none flex items-center justify-center">
              <span>{selectedType}</span>
              <ChevronDownIcon className="-mr-1 size-6 text-white ml-2" />
            </MenuButton>
            <MenuItems className="absolute left-1/2 -translate-x-1/2 mt-2 w-full bg-lightest-teal rounded-xl shadow-lg ring-1 ring-black/5 z-50">
              <MenuItem>
                <button
                  onClick={() => handleChange({ target: { value: "pH" } })}
                  className="text-medium-teal block w-full px-4 py-2 text-md font-semibold hover:bg-medium-orange"
                >
                  PH
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => handleChange({ target: { value: "Salinity" } })}
                  className="text-medium-teal block w-full px-4 py-2 text-md font-semibold hover:bg-medium-orange"
                >
                  Salinity
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => handleChange({ target: { value: "Temperature" } })}
                  className="text-medium-teal block w-full px-4 py-2 text-md font-semibold hover:bg-medium-orange"
                >
                  Temperature
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => handleChange({ target: { value: "ORP" } })}
                  className="text-medium-teal block w-full px-4 py-2 text-md font-semibold hover:bg-medium-orange"
                >
                  Oxidation Reduction Potential (ORP)
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => handleChange({ target: { value: "Alkalinity" } })}
                  className="text-medium-teal block w-full px-4 py-2 text-md font-semibold hover:bg-medium-orange"
                >
                  Alkalinity
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => handleChange({ target: { value: "Calcium" } })}
                  className="text-medium-teal block w-full px-4 py-2 text-md font-semibold hover:bg-medium-orange"
                >
                  Calcium
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => handleChange({ target: { value: "Nitrate" } })}
                  className="text-medium-teal block w-full px-4 py-2 text-md font-semibold hover:bg-medium-orange"
                >
                  Nitrate
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => handleChange({ target: { value: "Phosphate" } })}
                  className="text-medium-teal block w-full px-4 py-2 text-md font-semibold hover:bg-medium-orange"
                >
                  Phosphate
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => handleChange({ target: { value: "Nitrite" } })}
                  className="text-medium-teal block w-full px-4 py-2 text-md font-semibold hover:bg-medium-orange"
                >
                  Nitrite
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>

        {/* GRAPH CONTAINER */}
        <div className="w-full max-w-screen-2xl min-w-[750px] h-[65vh] 2xl:h-[73vh] bg-white rounded-lg p-3 overflow-hidden">
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
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
                <Tooltip content={(props) => <CustomTooltip {...props} selectedType={selectedType} />} />
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
        </div>

        {/* TEXT AREA */}
        <div className="mt-4 w-full max-w-screen-2xl min-w-[750px] p-4 bg-white drop-shadow-orange rounded-lg text-base md:text-lg">
          {selectedInfo}
        </div>
      </div>
    </>
  );
}
