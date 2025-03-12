"use client";
import React from "react";
import "../globals.css";
import HistoryPageGrid from "../components/HistoryPageGrid";
import NavigationBar from "../components/NavigationBar";
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function Page() {
  const links = [
    { href: '/data', label: 'Line Graph' },
    { href: '/', label: 'Home' },
  ]
  
  return (
    <div>
      <NavigationBar defaultIndex={2} />

      {/* Content */}
      <HistoryPageGrid />
    </div>
  );
}
