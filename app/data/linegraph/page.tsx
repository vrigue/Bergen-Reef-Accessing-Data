"use client";
import React, { useEffect, useState, Fragment } from "react";
import "../../globals.css";
import DataLineGraph from "../../components/graphComponents/DataLineGraph";
import NavigationBar from "../../components/NavigationBar";

export default function Page() {

  return (
    <div>
      <NavigationBar defaultIndex={1} />
      <DataLineGraph />
    </div>
  );
}
