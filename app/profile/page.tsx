"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import "../globals.css";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";
import ProfileClient from "../components/ProfileClient";


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
          <a href="/profile">
            <div className="pt-1.5 pr-8">
              <UserCircleIcon className="size-8 text-orange" />
            </div>
          </a>
          <TabGroup defaultIndex={-1}>
            <TabList className="flex space-x-4">
              <a href="/">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        "tab-item px-6 py-2 rounded-full transition",
                        false // temp, couldn't troubleshoot why defaultIndex wasn't working if -1
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
          </TabGroup>
        </div>
      </div>

      <br></br>
      <br></br>

      {/* top orange box*/}
      <div className="bg-light-orange p-6 rounded-lg shadow-lg flex justify-between items-center w-1/2 mx-auto">
        <div>
          <h2 className="font-bold text-lg">Admin</h2>
          <h1 className="text-2xl font-semibold">name</h1>
          <p className="text-sm">email</p>
        </div>
        <div className="flex flex-col space-y-4">
          <a
            href="/api/auth/login"
            className="bg-black text-white px-6 py-2 rounded-full shadow-lg hover:bg-orange-600 transition text-center"
          >
             Login
          </a>
          <a
            href="/api/auth/logout"
            className="bg-black text-white px-6 py-2 rounded-full shadow-lg hover:bg-orange-600 transition"
          >
            Logout
          </a>
        </div>
      </div>
      
    <br></br>  
    <div className="flex justify-center">
      <div className="rounded-md justify-content-center w-2/3 bg-gray-100 p-4" style={{height:400}}>

          <div className="bg-white rounded-lg shadow-lg p-6" style={{height:370}}>
            <h3 className="font-bold text-lg mb-4">Manage Users</h3>
            <div className="flex items-center mb-4">
              <span className="h-4 w-4 bg-black rounded-full inline-block mr-4"></span>
              <p className="flex-1">Henry Ramirez</p>
              <select className="border rounded px-2 py-1">
                <option value="Admin">Admin</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="flex items-center mb-4">
              <span className="h-4 w-4 bg-black rounded-full inline-block mr-4"></span>
              <p className="flex-1">Ben Isecke</p>
              <select className="border rounded px-2 py-1">
                <option value="Admin">Admin</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="flex items-center mb-4">
              <span className="h-4 w-4 bg-black rounded-full inline-block mr-4"></span>
              <p className="flex-1">Vrimagha Guejesni</p>
              <select className="border rounded px-2 py-1">
                <option value="Admin">Admin</option>
                <option value="General">General</option>
              </select>
            </div>
            
            <br></br>
            <br></br>

            <div className="flex justify-center space-x-4">
              <a
                href="/api/auth/login"
                className="bg-black text-white px-6 py-2 rounded-md shadow-lg hover:bg-orange-600 transition text-center"
              >
                Navigate to CSV Files
              </a>
              <a
                href="/api/auth/login"
                className="bg-black text-white px-6 py-2 rounded-md shadow-lg hover:bg-orange-600 transition text-center"
              >
                Sync Fusion Files
              </a>
            </div>

          </div>
        
      </div>
    </div>

      {/*<br></br>
      <div className="flex justify-center space-x-4">
        <a
          href="/api/auth/login"
          className="bg-orange text-white px-6 py-2 rounded-full shadow-lg hover:bg-orange-600 transition"
        >
          Login
        </a>

        <a
          href="/api/auth/logout"
          className="bg-orange text-white px-6 py-2 rounded-full shadow-lg hover:bg-orange-600 transition"
        >
          Logout
        </a>
      </div> */}
      <br></br>
      <br></br>
      <ProfileClient />
    </div>
  );
}
