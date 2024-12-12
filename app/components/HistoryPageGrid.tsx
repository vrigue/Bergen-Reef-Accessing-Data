"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MyDatePicker from "../components/MyDatePicker";
import "../globals.css";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { NewspaperIcon } from "@heroicons/react/24/solid";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function HistoryPageGrid() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // AG Grid
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs] = useState([
    { field: "id" },
    { field: "datetime" },
    { field: "name" },
    { field: "type" },
    { field: "value" },
  ]);
  const pagination = true;
  const paginationPageSize = 500;
  const paginationPageSizeSelector = [200, 500, 1000];

  // const [startDate, setStartDate] = useState(new Date()); // prob have to implement in the other thing

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/data");
        const result = await response.json();
        setData(result);

        // Update row data based on fetched data
        const formattedData = result.map((item: any, index: number) => ({
          id: index,
          datetime: item.datetime, // || "Temperature ˚C",
          name: item.name,
          type: item.type,
          value: item.value
        }));
        setRowData(formattedData);
      } catch (error: any) {
        setError(error.message);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        domLayout="autoHeight"
      />
    </div>
  );
}
