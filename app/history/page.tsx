"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MyDatePicker from "../components/MyDatePicker";
import HistoryPageGrid from "../components/HistoryPageGrid";
import "../globals.css";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { NewspaperIcon } from "@heroicons/react/24/solid";
import { AgGridReact } from "ag-grid-react";
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
      <div className="flex items-center justify-between bg-blue-100 p-4 shadow-lg rounded-lg">
        <a href="/">
          <div className="text-3xl">
            {" "}
            <NewspaperIcon className="size-6 text-blue-500" />
          </div>
        </a>
        <TabGroup defaultIndex={1}>
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
      <h1 className="text-3xl font-bold underline">Data</h1>
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
