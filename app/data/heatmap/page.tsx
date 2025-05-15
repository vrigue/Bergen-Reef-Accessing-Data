"use client";
import React, { useEffect, useState, Fragment } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../../globals.css";
import HeatMap from "../../components/graphComponents/HeatMap";
import NavigationBar from "../../components/NavigationBar";

export default function Page() {
  const { user } = useUser();

  return (
    <div className="flex flex-col h-screen">
      <NavigationBar defaultIndex={1} username={(user) ? user.name : "Guest"}/>
      <div className="flex-1">
      <HeatMap />
      </div>
    </div>
  );
}
