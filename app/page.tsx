"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import "./globals.css";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";
import { headers } from "next/headers";

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

import ProfileClient from "./components/ProfileClient";
import HomePageGraph from "./components/HomePageGraph";
import HomePageElements from "./components/HomePageElements";
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
    gap: "10px",
    padding: "0 20px",
  },
  leftHalf: {
    flex: 1,
    justifyContent: "center",
    padding: "10px",
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
  const [selectedInfo, setSelectedInfo] = React.useState(infoContent.ph);

  const handleChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedInfo(infoContent[e.target.value]);
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-white p-4 drop-shadow-orange rounded-lg">
        <a href="/">
          <div className="text-3xl">
            {" "}
            <img src="/images/coral-reef-logo.png" style={{width: "5%", height: "auto"}}></img>
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
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-orange outline outline-2 outline-dark-orange text-dark-gray font-semibold hover:bg-medium-orange"
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
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-2 outline-medium-gray text-gray font-semibold hover:bg-orange"
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
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-2 outline-medium-gray text-gray font-semibold hover:bg-orange"
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

      {/*CONTAINER HOLDING ELEMENTS AND GRAPH IN HALVES OF THE SCREEN*/}
      <div style={styles.container}>
        {/*ELEMENTS*/}
        <HomePageElements/>

        {/*CHART*/}
        <div className="w-2/3 rounded-lg p-6 mt-8 ml-4">
          <ResponsiveContainer width={"100%"} height={"auto"}>
            <HomePageGraph/>
          </ResponsiveContainer>

          {/*TEXT AREA BELOW GRAPH*/}
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
      </div>
      <ProfileClient/>
    </div>
  );
}
