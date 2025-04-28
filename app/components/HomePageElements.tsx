"use client";
import { raw } from "mysql2";
import { string } from "prop-types";
import React, { useEffect, useState } from "react";

export default function HomePageElements() {
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
        const interval = setInterval(fetchData, 300000); // Fetch every 5 minutes (300,000 ms) (10,000)
        return () => clearInterval(interval);
      }, []);


    return (
        <div className="grid grid-cols-3 grid-rows-3">
            {/*PH*/}
            <div className="relative text-center">
            <img src="/images/coral-panel-1.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white text-sm font-semibold mt-3">PH</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray text-5xl font-semibold mt-5">{elementData[0]}</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-14 pt-8 text-3xl">pH</div>
            </div>

            {/*SALINITY*/}
            <div className="relative text-center">
            <img src="/images/basic-panel.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white text-sm font-semibold mt-3">SALINITY</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray text-5xl font-semibold mt-5">{elementData[1]}</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-14 pt-8 text-3xl">ppt</div>
            </div>

            {/*TEMPERATURE*/}
            <div className="relative text-center">
            <img src="/images/coral-panel-2.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white text-sm font-semibold mt-3">TEMPERATURE</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray text-5xl font-semibold mt-5">{elementData[2]}</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-14 pt-8 text-3xl">ºF</div>
            </div>

            {/*ORP*/}
            <div className="relative text-center">
            <img src="/images/basic-panel.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white text-sm font-semibold mt-3">ORP</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray text-5xl font-semibold mt-5">{elementData[3]}</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-14 pt-8 text-3xl">mV</div>
            </div>

            {/*ALKALINITY*/}
            <div className="relative text-center">
            <img src="/images/coral-panel-3.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white text-sm font-semibold mt-3">ALKALINITY</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray text-5xl font-semibold mt-5">{elementData[4]}</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-14 pt-8 text-3xl">dkH</div>
            </div>

            {/*CALCIUM*/}
            <div className="relative text-center">
            <img src="/images/basic-panel.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white text-sm font-semibold mt-3">CALCIUM</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray text-5xl font-semibold mt-5">{elementData[5]}</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-14 pt-8 text-3xl">ppm</div>
            </div>

            {/*NITRATE*/}
            <div className="relative text-center">
            <img src="/images/coral-panel-1.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white text-sm font-semibold mt-3">NITRATE</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray text-5xl font-semibold mt-5">{elementData[6]}</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-14 pt-8 text-3xl">ppm</div>
            </div>

            {/*NITRITE*/}
            <div className="relative text-center">
            <img src="/images/basic-panel.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white text-sm font-semibold mt-3">NITRITE</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray text-5xl font-semibold mt-5">{elementData[7]}</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-14 pt-8 text-3xl">ppm</div>
            </div>

            {/*PHOSPHATE*/}
            <div className="relative text-center">
            <img src="/images/coral-panel-2.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white text-sm font-semibold mt-3">PHOSPHATE</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray text-5xl font-semibold mt-5">{elementData[8]}</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-14 pt-8 text-3xl">ppm</div>
            </div>
        </div>
    );
}