"use client";
import React, { useEffect, useState, Fragment } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../../globals.css";
import BoxPlot from "../../components/graphComponents/BoxPlot";
import NavigationBar from "../../components/NavigationBar";

export default function Page() {
  const { user } = useUser();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <NavigationBar defaultIndex={1} username={(user) ? user.name : "Guest"}/>
      <div className="flex-1 overflow-hidden">
      <BoxPlot />
      </div>
    </div>
  );
}
