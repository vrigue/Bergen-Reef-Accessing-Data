"use client";
import React, { useEffect, useState, Fragment } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";
import HistoryPageGrid from "../components/HistoryPageGrid";
import NavigationBar from "../components/NavigationBar";

export default function Page() {
  const { user } = useUser();

  return (
    <div>
      <NavigationBar defaultIndex={2} username={(user) ? user.name : "Guest"}/>

      {/* Content */}
      <HistoryPageGrid />
    </div>
  );
}
