"use client";
import React, { useEffect, useState, Fragment } from "react";
import "../../globals.css";
import BoxPlot from "../../components/graphComponents/BoxPlot";
import NavigationBar from "../../components/NavigationBar";

export default function Page() {

  return (
    <div>
      <NavigationBar defaultIndex={1} />
      <BoxPlot />
    </div>
  );
}
