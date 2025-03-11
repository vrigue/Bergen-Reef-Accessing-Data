"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import "./globals.css";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";
import ProfileClient from "./components/ProfileClient";
//import HomepageGraph from "./components/HomePageGraph";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import HomepageGraph from "./components/HomepageGraph";

/*
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_user',
  password: 'your_password',
  database: 'your_database'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

*/
//static datasets for the interactive graph

//write ups for the text area
const infoContent = {
  ph: 'This is the pH info!',
  calc: 'This is the calcium info!',
  alk: 'This is the alkalinity info!',
  orp: 'This is the ORP info!',
  temp: 'This is the temperature info!',
  salinity: 'This is the salinity info!',
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row" as "row", // Explicitly cast the type
    gap: "20px",
    padding: "0 20px",
  },
  leftHalf: {
    flex: 1,
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  rightHalf: {
    flex: 2, // Takes up the other 50%
    display: "flex",
    justifyContent: "center", // Centers the graph horizontally
    alignItems: "center", // Centers the graph vertically
  },
  select: {
    marginTop: "20px",
    padding: "10px",
    fontSize: "16px",
  },
};


const dataSets = {
  ph: [
    {value: 8.02 },
    {value: 8.03 },
    {value: 8.02 },
    {value: 8.01 },
    {value: 8.01 },
    {value: 8.00 },
    {value: 7.99 },
    {value: 8.01 },
    {value: 8.00 },
    {value: 8.00 },
  ],
  salinity: [
    {value: 35.00 },
    {value: 34.90 },
    {value: 35.20 },
    {value: 34.90 },
    {value: 35.20 },
    {value: 36.40 },
    {value: 36.30 },
    {value: 36.40 },
    {value: 36.40 },
    {value: 36.40 },
  ],
  temp: [
    {value: 74.80 },
    {value: 75.10 },
    {value: 74.60 },
    {value: 74.80 },
    {value: 75.40 },
    {value: 75.30 },
    {value: 75.40 },
    {value: 75.30 },
    {value: 75.40 },
    {value: 74.80 },
  ],
  orp: [
    {value: 332.00 },
    {value: 331.00 },
    {value: 330.00 },
    {value: 329.00 },
    {value: 327.00 },
    {value: 325.00 },
    {value: 323.00 },
    {value: 320.00 },
  ],
  alk: [
    {value: 10.28 },
    {value: 10.28 },
    {value: 10.28 },
    {value: 10.28 },
    {value: 10.28 },
    {value: 10.28 },
    {value: 10.28 },
    {value: 10.28 },
    {value: 10.28 },
    {value: 10.28 },
  ],
  calc: [
    {value: 313.00 },
    {value: 313.00 },
    {value: 313.00 },
    {value: 313.00 },
    {value: 313.00 },
    {value: 313.00 },
    {value: 313.00 },
    {value: 313.00 },
    {value: 313.00 },
    {value: 313.00 },
  ],
};

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState(["pH"]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/data");
        const result = await response.json();
        setData(result);
      } catch (error: any) {
        setError(error.message);
      }
    }

    fetchData();
  }, []);

  const temp = data[0]?.data;
  const pH = data[1]?.data;

  //stuff for selecting data according to dropdown in graph
  const [selectedData, setSelectedData] = React.useState(dataSets.ph);
  const [selectedInfo, setSelectedInfo] = React.useState(infoContent.ph);

  const handleChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedData(dataSets[e.target.value]);
    setSelectedInfo(infoContent[e.target.value]);
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-teal p-4 shadow-lg rounded-lg">
        <a href="/">
          <div className="text-3xl">
            {" "}
            <img src="/images/coral-logo.png"></img>
          </div>
        </a>
        <div className="flex items-right justify-between">
          <a href="/profile">
            <div className="pt-1.5 pr-8">
              <UserCircleIcon className="size-8 text-orange" />
            </div>
          </a>
          <TabGroup defaultIndex={0}>
            <TabList className="flex space-x-4">
              <a href="/">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        "tab-item px-6 py-2 rounded-full transition",
                        selected
                          ? "bg-orange text-white font-bold"
                          : "bg-light-orange text-dark-teal font-semibold hover:bg-medium-orange"
                      )}
                    >
                      Home
                    </button>
                  )}
                </Tab>
              </a>
              <a href="/data">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        "tab-item px-6 py-2 rounded-full transition",
                        selected
                          ? "bg-orange text-white font-bold"
                          : "bg-light-orange text-dark-teal font-semibold hover:bg-medium-orange"
                      )}
                    >
                      Data
                    </button>
                  )}
                </Tab>
              </a>
              <a href="/history">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        "tab-item px-6 py-2 rounded-full transition",
                        selected
                          ? "bg-orange text-white font-bold"
                          : "bg-light-orange text-dark-teal font-semibold hover:bg-medium-orange"
                      )}
                    >
                      History
                    </button>
                  )}
                </Tab>
              </a>
            </TabList>
          </TabGroup>
        </div>
      </div>

      <br></br>
      <h1 className="text-3xl font-bold">CoralLab380</h1>

      <br></br>
      <br></br>

      <br></br>

      {/*CONTAINER HOLDING ELEMENTS AND GRAPH IN HALVES OF THE SCREEN*/}
      <div style={styles.container}>
        {/*ELEMENTS*/}
        <div
          className="bg-white rounded-lg shadow-lg p-8"
          style={{
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Rectangle 1 */}
          <div
            style={{
              width: "500px",
              height: "70px",
              borderRadius: "15px", 
              backgroundColor: "#ffe59b",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#6fb1ba",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "3px solid #73b8c1",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              PH
            </div>
            <div style={{ fontSize: "16px", fontWeight: "normal" }}>
              8.00
            </div>
          </div>

          <br></br>

          {/* Rectangle 2 */}
          <div
            style={{
              width: "500px",
              height: "70px",
              borderRadius: "15px",
              backgroundColor: "#ffe59b",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#6fb1ba",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "3px solid #73b8c1",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              SALINITY
            </div>
            <div style={{ fontSize: "16px", fontWeight: "normal" }}>
            36.40
            </div>
          </div>

          <br></br>

          {/* Rectangle 3 */}
          <div
            style={{
              width: "500px",
              height: "70px",
              borderRadius: "15px",
              backgroundColor: "#ffe59b",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#6fb1ba",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "3px solid #73b8c1",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              TEMPERATURE
            </div>
            <div
              style={{
                backgroundColor: "light-orange",
                fontSize: "16px",
                fontWeight: "normal",
              }}
            >
              74.80
            </div>
          </div>

          <br></br>

          {/* Rectangle 4 */}
          <div
            style={{
              width: "500px",
              height: "70px",
              borderRadius: "15px",
              backgroundColor: "#ffe59b",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#6fb1ba",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "3px solid #73b8c1",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
                marginTop: "5px",
              }}
            >
              OXIDATION REDUCTION POTENTIAL
            </div>
            <div style={{ fontSize: "16px", fontWeight: "normal" }}>
              320.00
            </div>
          </div>

          <br></br>

          {/* Rectangle 5 */}
          <div
            style={{
              width: "500px",
              height: "70px",
              borderRadius: "15px",
              backgroundColor: "#ffe59b",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#6fb1ba",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "3px solid #73b8c1",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              ALKALINE
            </div>
            <div style={{ fontSize: "16px", fontWeight: "normal" }}>
            10.28
            </div>
          </div>

          <br></br>

          {/* Rectangle 6 */}
          <div
            style={{
              width: "500px",
              height: "70px",
              borderRadius: "15px",
              backgroundColor: "#ffe59b",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#6fb1ba",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "3px solid #73b8c1",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              CALCIUM
            </div>
            <div style={{ fontSize: "16px", fontWeight: "normal" }}>
              313.00
            </div>
          </div>
        </div>

        {/*CHART*/}
        <div className="w-2/3 bg-white rounded-lg shadow-lg p-6 ml-4">
          <ResponsiveContainer width={"100%"} height={500}>
            <HomepageGraph/>
            {/*<LineChart data={selectedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']}/>
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#87bdc4"
                strokeWidth="3px"
                activeDot={{ r: 8 }}
              />
            </LineChart> */}
          </ResponsiveContainer>

          {/*TEXT AREA BELOW GRAPH*/}
          <div
            className="mt-4 p-4 bg-gray-100 rounded-lg shadow"
            style={{
              fontSize: "16px",
              fontWeight: "normal",
              color: "#333",
              }}
          >
            {selectedInfo}
          </div>

        </div>
      </div>

      {/*<textarea
        name="testing area"
        id="test"
        defaultValue="Enter value here"
      ></textarea> */}

      <br></br>
      <br></br>
      <ProfileClient />
    </div>
  );
}
