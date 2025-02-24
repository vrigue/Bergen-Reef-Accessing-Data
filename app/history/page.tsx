"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import "../globals.css";
import { isUserAdmin } from '../../actions/isUserAdmin';

import DateBoundElement from "../components/DateBoundElement";

import HistoryPageGrid from "../components/HistoryPageGrid";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanels,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import {
  UserCircleIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

import "ag-grid-community/styles/ag-theme-quartz.css";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // AG Grid
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs] = useState([
    { field: "id" },
    { field: "datetime" },
    { field: "name" },
    { field: "type" },
    { field: "value" },
  ]);

  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/data");
        const result = await response.json();
        setData(result);

        const formattedData = result.map((item: any, index: number) => ({
          id: index,
          datetime: item.datetime,
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

  const handleGraphClick = () => {
    //for the future
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-teal p-4 shadow-lg rounded-lg">
        <a href="/">
          <div className="text-3xl">
            <img src="/images/coral-logo.png" alt="Logo" />
          </div>
        </a>
        <div className="flex items-right justify-between">
          <a href="/profile">
            <div className="pt-1.5 pr-8">
              <UserCircleIcon className="size-8 text-orange" />
            </div>
          </a>
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
            <TabPanels></TabPanels>
          </TabGroup>
        </div>
      </div>

      {/* Content */}
      <h1 className="text-3xl font-bold underline">CoralLab380 History</h1>
      <div className="flex gap-8 mt-6">
        {/* Left Panel */}
        <div
          className="flex flex-col bg-gray-200 p-6 rounded-lg shadow-md"
          style={{
            width: "30%",
            position: "fixed",
            top: "20%",
            height: "60vh",
            overflowY: "auto",
          }}
        >
          <div className="flex flex-col h-full justify-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Enter Date Constraints
            </h2>
            <div className="flex flex-col gap-4">
              {/* DateTime Inputs */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  Start Date:
                </span>
                <DateBoundElement value={startDate} onChange={setStartDate} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  End Date:
                </span>
                <DateBoundElement value={startDate} onChange={setStartDate} />
              </div>
            </div>
            {/* Type Selection Menu */}
            <Menu as="div" className="relative inline-block text-left mt-4">
              <MenuButton className="inline-flex w-full items-center justify-between px-3 py-2 bg-white rounded-md text-gray-800 shadow ring-1 ring-gray-300">
                Select Type
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              </MenuButton>
              <MenuItems className="absolute mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
                {["Tmp", "SKIMMERW", "ORP", "SUMPRETURNA", "UVA"].map(
                  (item) => (
                    <MenuItem key={item}>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700"
                          } block px-4 py-2 text-sm`}
                        >
                          {item}
                        </button>
                      )}
                    </MenuItem>
                  )
                )}
              </MenuItems>
            </Menu>
            {/* Buttons */}
            <div className="flex justify-center mt-6 space-x-4">
              <button className="bg-orange text-white px-4 py-2 rounded-lg shadow hover:bg-dark-orange">
                Apply
              </button>
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-400">
                Reset
              </button>
            </div>
            {/* Button Section */}
            <div
              className="relative inline-block text-left mt-4"
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <a href="/data">
                  <button
                    onClick={handleGraphClick}
                    className="flex justify-center bg-orange text-white px-4 py-2 rounded-lg shadow hover:bg-dark-orange"
                    style={{
                      padding: "8px 16px",
                      fontSize: "16px",
                      backgroundColor: "#f39c12",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChartBarIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
                    Graph
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 rounded-lg p-4" style={{ marginLeft: "33%" }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Data Table</h2>
            <div className="flex space-x-3">
              <a href="/history">
                <ArrowPathIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
              </a>
            </div>
          </div>
          <div className="ag-theme-quartz" style={{ height: "400px" }}>
            <HistoryPageGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
