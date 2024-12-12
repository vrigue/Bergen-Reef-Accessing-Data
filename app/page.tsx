"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import "./globals.css";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";
import ProfileClient from "./components/ProfileClient";

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

//static datasets for the interactive graph
const dataSets = {
  ph: [
    { name: "December 1", value: 100 },
    { name: "December 2", value: 50 },
    { name: "December 3", value: 20 },
  ],
  salinity: [
    { name: "December 1", value: 75 },
    { name: "December 2", value: 100 },
    { name: "December 3", value: 50 },
  ],
  temp: [
    { name: "December 1", value: 80 },
    { name: "December 2", value: 120 },
    { name: "December 3", value: 200 },
  ],
  orp: [
    { name: "December 1", value: 95 },
    { name: "December 2", value: 20 },
    { name: "December 3", value: 95 },
  ],
  alk: [
    { name: "December 1", value: 100 },
    { name: "December 2", value: 200 },
    { name: "December 3", value: 150 },
  ],
  calc: [
    { name: "December 1", value: 80 },
    { name: "December 2", value: 50 },
    { name: "December 3", value: 100 },
  ],
};

//write ups for the text area
const infoBoxes = {
  ph: "PH INFO",
  salinity: "SALINITY INFO",
  temp: "TEMPERATURE INFO",
  orp: "OXIDATION REDUCTION POTENTIAL INFO",
  alk: "ALKALINE INFO",
  calc: "CALCIUM INFO",
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
    float: "center",
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  rightHalf: {
    flex: 1, // Takes up the other 50%
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

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  //stuff for selecting data according to dropdown in graph
  const [selectedData, setSelectedData] = React.useState(dataSets.ph);

  const handleChange = (e) => {
    setSelectedData(dataSets[e.target.value]);
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
          <div className="pt-1.5 pr-8">
            <UserCircleIcon className="size-8 text-orange" />
          </div>
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
      <h1 className="text-3xl font-bold">Coral Reef Homepage!</h1>

      <br></br>
      <br></br>

      <select
        style={{ float: "right", width: "750px", textAlign: "center" }}
        onChange={handleChange}
      >
        <option value="ph">PH</option>
        <option value="salinity">Salinity</option>
        <option value="temp">Temperature</option>
        <option value="orp">Oxidation Reduction Potential (ORP)</option>
        <option value="alk">Alkalinity</option>
        <option value="calc">Calcium</option>
      </select>

      <br></br>

      {/*CONTAINER HOLDING ELEMENTS AND GRAPH IN HALVES OF THE SCREEN*/}
      <div style={styles.container}>
        {/*ELEMENTS*/}
        <div
          style={{
            ...styles.leftHalf,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Rectangle 1 */}
          <div
            style={{
              width: "600px",
              height: "75px",
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
              Value 1
            </div>
          </div>

          {/* Rectangle 2 */}
          <div
            style={{
              width: "600px",
              height: "75px",
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
              Value 2
            </div>
          </div>

          {/* Rectangle 3 */}
          <div
            style={{
              width: "600px",
              height: "75px",
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
              Value 3
            </div>
          </div>

          {/* Rectangle 4 */}
          <div
            style={{
              width: "600px",
              height: "75px",
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
              Value 4
            </div>
          </div>

          {/* Rectangle 5 */}
          <div
            style={{
              width: "600px",
              height: "75px",
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
              Value 5
            </div>
          </div>

          {/* Rectangle 6 */}
          <div
            style={{
              width: "600px",
              height: "75px",
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
              Value 6
            </div>
          </div>
        </div>

        {/*CHART*/}
        <ResponsiveContainer
          style={styles.leftHalf}
          width={"100%"}
          height={600}
        >
          <LineChart data={selectedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#87bdc4"
              strokeWidth="3px"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <textarea> </textarea>
      <br></br>
      <br></br>
      <div className="flex justify-center space-x-4">
        <a
          href="/api/auth/login"
          className="bg-orange text-white px-6 py-2 rounded-full shadow-lg hover:bg-orange-600 transition"
        >
          Login
        </a>

        <a
          href="/api/auth/logout"
          className="bg-orange text-white px-6 py-2 rounded-full shadow-lg hover:bg-orange-600 transition"
        >
          Logout
        </a>
      </div>
      <br></br>
      <br></br>
      <ProfileClient />
    </div>
  );
}
