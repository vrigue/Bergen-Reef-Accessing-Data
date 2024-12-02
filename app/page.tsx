"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import "./globals.css";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { NewspaperIcon, UserIcon } from "@heroicons/react/24/solid";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { useAuth0 } from "@auth0/auth0-react";

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

const chartData = [
  {
    name: "26 Nov.",
    pH: 8.1,
    salt: 3.5,
    amt: 2400,
  },
  {
    name: "12:00 pm",
    pH: 8.2,
    salt: 3.7,
    amt: 2210,
  },
  {
    name: "27 Nov.",
    pH: 8.3,
    salt: 3.5,
    amt: 2290,
  },
  {
    name: "12:00 pm",
    pH: 7.9,
    salt: 3.2,
    amt: 2000,
  },
  {
    name: "28 Nov.",
    pH: 8.1,
    salt: 3.5,
    amt: 2181,
  },
  {
    name: "12:00 pm",
    pH: 7.8,
    salt: 3.6,
    amt: 2500,
  },
  {
    name: "29 Nov.",
    pH: 8.05,
    salt: 3.3,
    amt: 2100,
  },
];

export default function Page() {
  let { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
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

  const data1 = "Temperature: " + data[0]?.data;
  const data2 = "Temperature: " + data[1]?.data;

  return (
    <div>
      <div className="flex items-center justify-between bg-blue-100 p-4 shadow-lg rounded-lg">
        <div className="text-3xl">
          {" "}
          <NewspaperIcon className="size-6 text-blue-500" />
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
                      ? "bg-blue-500 text-white font-semibold"
                      : "bg-blue-200 text-blue-700 hover:bg-blue-300"
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
                      ? "bg-blue-500 text-white font-semibold"
                      : "bg-blue-200 text-blue-700 hover:bg-blue-300"
                  )}
                >
                  Data
                </button>
              )}
            </Tab>
            </a>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={clsx(
                    "tab-item px-6 py-2 rounded-full transition",
                    selected
                      ? "bg-blue-500 text-white font-semibold"
                      : "bg-blue-200 text-blue-700 hover:bg-blue-300"
                  )}
                >
                  History
                </button>
              )}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Welcome to the Home page!</TabPanel>
            <TabPanel>View and analyze Data here.</TabPanel>
            <TabPanel>Check the History of your data.</TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
      <h1 className="text-3xl font-bold underline">Coral Reef Homepage!</h1>
      <a className="text-blue-600" href="/data" id="test-link">
        {" "}
        See Data In Depth:{" "}
      </a>
      <ResponsiveContainer width={"100%"} height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pH"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="salt" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      <h1 className="text-2xl font-bold">{data1}</h1>
      <h1 className="text-2xl font-bold">{data2}</h1>

      <a href="/api/auth/login">Login</a>
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
}
