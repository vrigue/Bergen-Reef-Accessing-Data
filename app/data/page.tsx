"use client";
import React, { useEffect, useState, Fragment } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";
import NavigationBar from "../components/NavigationBar";

export default function Page() {
  const { user } = useUser();
  
  return (
    <div>
      <NavigationBar defaultIndex={1} username={(user) ? user.name : "Guest"}/>
      <br></br>
      <div
        style={{
          width: "50%",
          position: "fixed",
          top: "12.8%",
          left: "25%",
          height: "79%",
          overflowY: "auto",
        }}
      >
        <div
          className="flex flex-col bg-white rounded-lg"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "16px",
            padding: "24px",
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="bg-teal rounded-lg p-4 w-full">
            <h2 className="flex justify-center text-xl text-white font-semibold">
              Graphs
            </h2>
          </div>
          <div className="flex flex-col gap-4 p-6 w-full items-center">
            <a href="/data/linegraph" className="w-full">
              <button
                className="bg-orange outline outline-1 outline-dark-orange text-white font-medium px-4 py-2 rounded-xl hover:bg-dark-orange w-full"
                style={{
                  padding: "8px 16px",
                  fontSize: "16px",
                  color: "white",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Simple Line Graph
              </button>
            </a>
            <a href="/data/twodimgraph" className="w-full">
              <button
                className="bg-orange outline outline-1 outline-dark-orange text-white font-medium px-4 py-2 rounded-xl hover:bg-dark-orange w-full"
                style={{
                  padding: "8px 16px",
                  fontSize: "16px",
                  color: "white",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Two Dimensional Scatter Plot
              </button>
            </a>
            <a href="/data/boxplot" className="w-full">
              <button
                className="bg-orange outline outline-1 outline-dark-orange text-white font-medium px-4 py-2 rounded-xl hover:bg-dark-orange w-full"
                style={{
                  padding: "8px 16px",
                  fontSize: "16px",
                  color: "white",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Box Plot
              </button>
            </a>
            <a href="/data/heatmap" className="w-full">
              <button
                className="bg-orange outline outline-1 outline-dark-orange text-white font-medium px-4 py-2 rounded-xl hover:bg-dark-orange w-full"
                style={{
                  padding: "8px 16px",
                  fontSize: "16px",
                  color: "white",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Heat Map
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
