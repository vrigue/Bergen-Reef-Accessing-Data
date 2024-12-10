"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import "./globals.css";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { NewspaperIcon, UserIcon } from "@heroicons/react/24/solid";
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";

export default function Page() {
    <div className="flex space-x-4">
        <a
          href="../api/auth/login"
          className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          Login
        </a>

        <a
          href="../api/auth/logout"
          className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          Logout
        </a>
      </div>
}