"use client";
import React from "react";
import "../globals.css";
import HistoryPageGrid from "../components/HistoryPageGrid";
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
                <Tab as={React.Fragment}>
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
              <Tab as="div">
                <Menu>
                  <MenuButton>
                    {() => (
                      <button
                        className={clsx(
                          "tab-item px-6 py-2 rounded-full transition",
                          "bg-light-orange text-dark-teal font-semibold hover:bg-medium-orange"
                        )}
                      >
                        Data
                      </button>
                    )}
                  </MenuButton>
                  <MenuItems anchor="bottom">
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100"
                        href="/settings"
                      >
                        Settings
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100"
                        href="/support"
                      >
                        Support
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100"
                        href="/license"
                      >
                        License
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </Tab>
              <a href="/history">
                <Tab as={React.Fragment}>
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
      <HistoryPageGrid />
    </div>
  );
}
