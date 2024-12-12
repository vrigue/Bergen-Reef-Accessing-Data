"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import "../globals.css";

import MyDatePicker from "../components/MyDatePicker";

import HistoryPageGrid from "../components/HistoryPageGrid";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import { UserCircleIcon, ChevronDownIcon} from "@heroicons/react/24/solid";

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

      <div className="flex gap-8 pt-5">
        {/* Left Menu */}
        <div className="flex flex-col bg-medium-gray w-1/3 p-6 rounded-lg shadow-md">
          <h1 className="flex items-center justify-center text-xl text-gray-800 font-bold pt-5">
            Enter Date Constraints
          </h1>
          <div className="flex space-x-4 justify-center pt-4">
            <MyDatePicker />
          </div>
        </div>

        {/* Right Table */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <Menu as="div" className="relative inline-block text-left pt-3">
            <div>
              <MenuButton className="inline-flex w-full justify-left gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Tmp
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 size-5 text-gray-400"
                />
              </MenuButton>
            </div>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    Tmp
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    SKIMMERW
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    ORP
                  </a>
                </MenuItem>
                <MenuItem>
                  <button
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    SUMPRETURNA
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    UVA
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    HeaterA
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    LEDLampA
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    SUMPRETURNW
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
          <HistoryPageGrid />
        </div>
      </div>
    </div>
  );
}
