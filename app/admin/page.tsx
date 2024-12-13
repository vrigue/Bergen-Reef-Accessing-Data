"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { NewspaperIcon, UserCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";

export default function Page() {

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
            <a href="/admin">
              <div className="pt-1.5 pr-8">
                <UserCircleIcon className="size-8 text-orange" />
              </div>
            </a>
            <TabGroup defaultIndex={0}>
              <TabList className="flex space-x-4">
                <a href="/">
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={clsx(
                          "tab-item px-6 py-2 rounded-full transition",
                          selected
                            ? "bg-light-orange text-dark-teal font-semibold hover:bg-medium-orange"
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
            </TabGroup>
          </div>
        </div>

      <div>
        
      </div>

      <div className="flex space-x-4">
          <a
            href="../api/auth/login"
            className="bg-orange text-white px-6 py-2 rounded-full shadow-lg hover:bg-orange transition"
          >
            Login
          </a>

          <a
            href="../api/auth/logout"
            className="bg-orange text-white px-6 py-2 rounded-full shadow-lg hover:bg-orange transition"
          >
            Logout
          </a>
        </div>
      </div>
  );
    
}