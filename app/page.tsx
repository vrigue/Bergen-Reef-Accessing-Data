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

import HomePageGraph from "./components/HomePageGraph";
import HomePageElements from "./components/HomePageElements";
import NavigationBar from "./components/NavigationBar";
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
  ph: "This is the pH info!",
  calc: "This is the calcium info!",
  alk: "This is the alkalinity info!",
  orp: "This is the ORP info!",
  temp: "This is the temperature info!",
  salinity: "This is the salinity info!",
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
  const { user } = useUser();
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
      <NavigationBar defaultIndex={0} username={(user) ? user.name : "Guest"}/>

      <br></br>

      {/*CONTAINER HOLDING ELEMENTS AND GRAPH IN HALVES OF THE SCREEN*/}
      <div style={styles.container}>
        {/*ELEMENTS*/}
        <div style={{ position: "relative", zIndex: 1 } }>
          <HomePageElements />
        </div>

        {/*CHART*/}
        <div className="w-3/5 rounded-lg p-3 ml-1" style={{ position: "relative", zIndex: 1 }}>
          <ResponsiveContainer width={"100%"} height={"auto"}>
            <HomePageGraph />
          </ResponsiveContainer>

          {/*TEXT AREA BELOW GRAPH*/}
        </div>
      </div>
    </div>
  );
}
