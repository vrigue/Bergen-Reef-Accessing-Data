"use client";
import React, { useEffect, useState, Fragment } from "react";
import "../../globals.css";
import DataLineGraph from "../../components/graphComponents/DataLineGraph";
import NavigationBar from "../../components/NavigationBar";

export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      <NavigationBar defaultIndex={1} />
      <div className="flex-1">
      <DataLineGraph />
      </div>
    </div>
  );
}
