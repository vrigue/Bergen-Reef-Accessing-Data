"use client";
import React, { useEffect, useState, Fragment } from "react";
import "../../globals.css";
import HeatMap from "../../components/graphComponents/HeatMap";
import NavigationBar from "../../components/NavigationBar";

export default function Page() {

  return (
    <div>
      <NavigationBar defaultIndex={1} />
      <HeatMap />
    </div>
  );
}
