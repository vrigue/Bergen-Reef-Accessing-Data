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
                    const value = rawData[i].value;
                    elementData.push(value);
                }

                setElementData(elementData);
            } 
            catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    
        fetchData();
        console.log(elementData[0])
      }, []);


    return (
        <div className="grid grid-flow-col grid-rows-3">
            {/*PH*/}
            <div className="relative text-center">
            <img src="/images/color-card-1.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white font-semibold mt-5" style={{ fontSize: "16px"}}>PH</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-10" style={{ fontSize: "45px"}}>{elementData[0]}</div>
            </div>

            {/*TEMPERATURE*/}
            <div className="relative text-center">
            <img src="/images/basic-card.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white font-semibold mt-5" style={{ fontSize: "16px"}}>TEMPERATURE</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-10" style={{ fontSize: "45px"}}>{elementData[1]}</div>
            </div>

            {/*ALKALINITY*/}
            <div className="relative text-center">
            <img src="/images/color-card-3.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white font-semibold mt-5" style={{ fontSize: "16px"}}>ALKALINITY</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-10" style={{ fontSize: "45px"}}>{elementData[2]}</div>
            </div>

            {/*SALINITY*/}
            <div className="relative text-center">
            <img src="/images/basic-card.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white font-semibold mt-5" style={{ fontSize: "16px"}}>SALINITY</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-10" style={{ fontSize: "45px"}}>{elementData[3]}</div>
            </div>

            {/*ORP*/}
            <div className="relative text-center">
            <img src="/images/color-card-2.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white font-semibold mt-5" style={{ fontSize: "16px"}}>ORP</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-10" style={{ fontSize: "45px"}}>{elementData[4]}</div>
            </div>

            {/*CALCIUM*/}
            <div className="relative text-center">
            <img src="/images/basic-card.png" style={{width: "100%", height: "auto"}}></img>
            <div className="w-full absolute top-0 left-0 text-center text-white font-semibold mt-5" style={{ fontSize: "16px"}}>CALCIUM</div>
            <div className="w-full absolute top-10 left-0 text-center text-dark-gray font-semibold mt-10" style={{ fontSize: "45px"}}>{elementData[5]}</div>
            </div>
        </div>
    );
}