"use client";
import React, { useEffect, useState, Fragment } from "react";
import "../globals.css";
import HistoryPageGrid from "../components/HistoryPageGrid";
import NavigationBar from "../components/NavigationBar";

export default function Page() {
  return (
    <div>
      <NavigationBar defaultIndex={2} />

      {/* Content */}
      <HistoryPageGrid />
    </div>
  );
}
