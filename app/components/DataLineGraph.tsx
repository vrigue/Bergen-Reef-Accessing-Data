"use client";
"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import "../globals.css";

// deprecated import "react-datepicker/dist/react-datepicker.css";
import DateBoundElement from "./DateBoundElement";
import ZoomSlider from "../components/ZoomSlider";
import StepSlider from "../components/StepSlider";

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

import { ChevronDownIcon } from "@heroicons/react/20/solid";

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

export default function DataLineGraph() {
  const chartData = [
    {
      name: "26 Nov.",
      PH: 8.1,
      Salinity: 3.5,
      amt: 2400,
    },
    {
      name: "12:00 pm",
      PH: 8.2,
      Salinity: 3.7,
      amt: 2210,
    },
    {
      name: "27 Nov.",
      PH: 8.3,
      Salinity: 3.5,
      amt: 2290,
    },
    {
      name: "12:00 pm",
      PH: 7.9,
      Salinity: 3.2,
      amt: 2000,
    },
    {
      name: "28 Nov.",
      PH: 8.1,
      Salinity: 3.5,
      amt: 2181,
    },
    {
      name: "12:00 pm",
      PH: 7.8,
      Salinity: 3.6,
      amt: 2500,
    },
    {
      name: "29 Nov.",
      PH: 8.05,
      Salinity: 3.3,
      amt: 2100,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-7 pt-5">
      <div className="col-span-2 bg-white ml-8 pr-8 pt-3 pb-3">
        <ResponsiveContainer width={"100%"} height={600}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="PH"
              stroke="#009da8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="Salinity" stroke="#ffa600" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="col-span-1 bg-medium-gray mr-8 pt-3 pb-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-1 ml-3">
            <div className="box-border h-10 w-40 p-4 border-2 bg-medium-teal"></div>
            <Menu as="div" className="relative inline-block text-left pt-3">
              <div>
                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  PH
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
                      Salinity
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                    >
                      Temperature
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
                      Akalinity
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      type="submit"
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                    >
                      Calcium
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>

          <div className="col-span-1 ml-3">
            <div className="box-border h-10 w-40 p-4 border-2 bg-dark-orange"></div>
            <Menu as="div" className="relative inline-block text-left pt-3">
              <div>
                <MenuButton className="inline-flex w-full justify-left gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  Salinity
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
                      PH
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                    >
                      Temperature
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
                      Akalinity
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      type="submit"
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                    >
                      Calcium
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
        </div>

        <h1 className="flex items-center justify-center text-xl text-gray-800 font-bold pt-5">
          Enter Date Constraints
        </h1>
        <div className="flex space-x-4 justify-center pt-4">
          <DateBoundElement value={new Date()} onChange={(date: Date) => console.log(date)} />
          <span className="self-center font-bold">to</span>
          <DateBoundElement value={new Date()} onChange={(date: Date) => console.log(date)} />
        </div>

        <div>
          <ZoomSlider />
        </div>
        <div>
          <StepSlider />
        </div>
      </div>
    </div>
  );
}
