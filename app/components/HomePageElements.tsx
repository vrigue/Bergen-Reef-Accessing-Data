"use client";
import { raw } from "mysql2";
import { string } from "prop-types";
import React, { useEffect, useState } from "react";

interface HomePageElementsProps {
    selectedType: string;
    onTypeSelectAction: (type: string) => void;
}

export default function HomePageElements({ selectedType, onTypeSelectAction }: HomePageElementsProps) {
    const [elementData, setElementData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/getMostRecentElements");
                const rawData = await response.json();
                var elementData = [];

                console.log("Fetched data:", rawData);

                if (!Array.isArray(rawData)) {
                    console.error("Unexpected API response:", rawData);
                    return;
                }

                for (let i = 0; i < rawData.length; i++) {
                    var value = 0;

                    if (i == 3 || i == 5) {
                        value = Math.round(rawData[i].value);
                    }
                    else if (rawData[i]) {
                        value = rawData[i].value;
                    }

                    elementData.push(value);
                }

                setElementData(elementData);
            } 
            catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    
        fetchData();
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, []);

    const handlePanelClick = (type: string) => {
        onTypeSelectAction(type);
    };

    const panelClasses = "relative w-full text-center cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.02] hover:brightness-110 rounded-lg";

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
            {/* PH */}
            <div 
                className={panelClasses}
                style={{ fontSize: '1.8vw' }}
                onClick={() => handlePanelClick("pH")}
            >
                <img src="/images/coral-panel-1.png" className="w-full h-full object-cover rounded-lg" />
                <div className="w-full absolute top-[5%] left-0 text-center text-white text-[0.7em] font-semibold">PH</div>
                <div className="w-full absolute top-[30%] left-0 text-center text-dark-gray text-[1.7em] font-semibold">{elementData[0]}</div>
                <div className="w-full absolute top-[60%] left-0 text-center text-dark-gray font-semibold text-[1.1em]">pH</div>
            </div>

            {/* SALINITY */}
            <div 
                className={panelClasses}
                style={{ fontSize: '1.8vw' }}
                onClick={() => handlePanelClick("Salinity")}
            >
                <img src="/images/basic-panel.png" className="w-full h-full object-cover rounded-lg" />
                <div className="w-full absolute top-[5%] left-0 text-center text-white text-[0.7em] font-semibold">SALINITY</div>
                <div className="w-full absolute top-[30%] left-0 text-center text-dark-gray text-[1.7em] font-semibold">{elementData[1]}</div>
                <div className="w-full absolute top-[60%] left-0 text-center text-dark-gray font-semibold text-[1.1em]">ppt</div>
            </div>

            {/* TEMPERATURE */}
            <div 
                className={panelClasses}
                style={{ fontSize: '1.8vw' }}
                onClick={() => handlePanelClick("Temperature")}
            >
                <img src="/images/coral-panel-2.png" className="w-full h-full object-cover rounded-lg" />
                <div className="w-full absolute top-[5%] left-0 text-center text-white text-[0.7em] font-semibold">TEMPERATURE</div>
                <div className="w-full absolute top-[30%] left-0 text-center text-dark-gray text-[1.7em] font-semibold">{elementData[2]}</div>
                <div className="w-full absolute top-[60%] left-0 text-center text-dark-gray font-semibold text-[1.1em]">ºF</div>
            </div>

            {/* ORP */}
            <div 
                className={panelClasses}
                style={{ fontSize: '1.8vw' }}
                onClick={() => handlePanelClick("ORP")}
            >
                <img src="/images/basic-panel.png" className="w-full h-full object-cover rounded-lg" />
                <div className="w-full absolute top-[5%] left-0 text-center text-white text-[0.7em] font-semibold">ORP</div>
                <div className="w-full absolute top-[30%] left-0 text-center text-dark-gray text-[1.7em] font-semibold">{elementData[3]}</div>
                <div className="w-full absolute top-[60%] left-0 text-center text-dark-gray font-semibold text-[1.1em]">mV</div>
            </div>

            {/* ALKALINITY */}
            <div 
                className={panelClasses}
                style={{ fontSize: '1.8vw' }}
                onClick={() => handlePanelClick("Alkalinity")}
            >
                <img src="/images/coral-panel-3.png" className="w-full h-full object-cover rounded-lg" />
                <div className="w-full absolute top-[5%] left-0 text-center text-white text-[0.7em] font-semibold">ALKALINITY</div>
                <div className="w-full absolute top-[30%] left-0 text-center text-dark-gray text-[1.7em] font-semibold">{elementData[4]}</div>
                <div className="w-full absolute top-[60%] left-0 text-center text-dark-gray font-semibold text-[1.1em]">dkH</div>
            </div>

            {/* CALCIUM */}
            <div 
                className={panelClasses}
                style={{ fontSize: '1.8vw' }}
                onClick={() => handlePanelClick("Calcium")}
            >
                <img src="/images/basic-panel.png" className="w-full h-full object-cover rounded-lg" />
                <div className="w-full absolute top-[5%] left-0 text-center text-white text-[0.7em] font-semibold">CALCIUM</div>
                <div className="w-full absolute top-[30%] left-0 text-center text-dark-gray text-[1.7em] font-semibold">{elementData[5]}</div>
                <div className="w-full absolute top-[60%] left-0 text-center text-dark-gray font-semibold text-[1.1em]">ppm</div>
            </div>

            {/* NITRATE */}
            <div 
                className={panelClasses}
                style={{ fontSize: '1.8vw' }}
                onClick={() => handlePanelClick("Nitrate")}
            >
                <img src="/images/coral-panel-1.png" className="w-full h-full object-cover rounded-lg" />
                <div className="w-full absolute top-[5%] left-0 text-center text-white text-[0.7em] font-semibold">NITRATE</div>
                <div className="w-full absolute top-[30%] left-0 text-center text-dark-gray text-[1.7em] font-semibold">{elementData[6]}</div>
                <div className="w-full absolute top-[60%] left-0 text-center text-dark-gray font-semibold text-[1.1em]">ppm</div>
            </div>

            {/* NITRITE */}
            <div 
                className={panelClasses}
                style={{ fontSize: '1.8vw' }}
                onClick={() => handlePanelClick("Nitrite")}
            >
                <img src="/images/basic-panel.png" className="w-full h-full object-cover rounded-lg" />
                <div className="w-full absolute top-[5%] left-0 text-center text-white text-[0.7em] font-semibold">NITRITE</div>
                <div className="w-full absolute top-[30%] left-0 text-center text-dark-gray text-[1.7em] font-semibold">{elementData[7]}</div>
                <div className="w-full absolute top-[60%] left-0 text-center text-dark-gray font-semibold text-[1.1em]">ppm</div>
            </div>

            {/* PHOSPHATE */}
            <div 
                className={panelClasses}
                style={{ fontSize: '1.8vw' }}
                onClick={() => handlePanelClick("Phosphate")}
            >
                <img src="/images/coral-panel-2.png" className="w-full h-full object-cover rounded-lg" />
                <div className="w-full absolute top-[5%] left-0 text-center text-white text-[0.7em] font-semibold">PHOSPHATE</div>
                <div className="w-full absolute top-[30%] left-0 text-center text-dark-gray text-[1.7em] font-semibold">{elementData[8]}</div>
                <div className="w-full absolute top-[60%] left-0 text-center text-dark-gray font-semibold text-[1.1em]">ppm</div>
            </div>
        </div>
    );
}