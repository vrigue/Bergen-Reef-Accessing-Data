"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import "../globals.css";

import MyDatePicker from "../components/MyDatePicker";

import HistoryPageGrid from "../components/HistoryPageGrid";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // AG Grid
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs] = useState([
    { field: "id" },
    { field: "type" },
    { field: "data" },
  ]);

  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/data");
        const result = await response.json();
        setData(result);

        // Update row data based on fetched data
        const formattedData = result.map((item: any, index: number) => ({
          id: index,
          datetime: item.datetime, // || "Temperature ˚C",
          name: item.name,
          type: item.type,
          value: item.value,
        }));
        setRowData(formattedData);
      } catch (error: any) {
        setError(error.message);
      }
    }

    fetchData();
  }, []);

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
          <TabGroup defaultIndex={2}>
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
            <TabPanels>
              {/*<TabPanel>Welcome to the Home page!</TabPanel>
                <TabPanel>View and analyze Data here.</TabPanel>
                <TabPanel>Check the History of your data.</TabPanel>*/}
            </TabPanels>
          </TabGroup>
        </div>
      </div>

      <h1 className="text-3xl font-bold underline">History</h1>
      <HistoryPageGrid />

      <h1 className="flex items-center justify-center text-xl font-bold">
        Select a Date
      </h1>
      <div className="flex items-center justify-center">
        <MyDatePicker />
      </div>
    </div>
  );
}
