"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import "../globals.css";

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
import DataLineGraph from "../components/graphComponents/DataLineGraph";
import NavigationBar from "../components/NavigationBar";

export default function Page() {

  return (
    <div>
      <NavigationBar defaultIndex={1} />
      <DataLineGraph />
    </div>
  );
}
