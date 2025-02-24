"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import "../globals.css";
import "react-datepicker/dist/react-datepicker.css";

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

import { UserCircleIcon } from "@heroicons/react/24/solid";
import DataLineGraph from "app/components/DataLineGraph";

export default function Page() {
  const [startDate, setStartDate] = useState(new Date());

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
          <TabGroup defaultIndex={1}>
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
      <DataLineGraph />
    </div>
  );
}
