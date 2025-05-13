"use client";
import React, { useEffect, useState, Fragment } from "react";
import "../../globals.css";
import TwoDimensionPlot from "../../components/graphComponents/TwoDimensionPlot";
import NavigationBar from "../../components/NavigationBar";

export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      <NavigationBar defaultIndex={1} />
      <div className="flex-1">
      <TwoDimensionPlot />
      </div>
    </div>
  );
}
