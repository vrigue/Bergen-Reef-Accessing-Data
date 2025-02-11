"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import "../globals.css";
import { AgGridReact } from "ag-grid-react";

import {
  ClientSideRowModelModule,
  PaginationModule,
  CustomFilterModule,
  DateFilterModule,
  NumberFilterModule,
  TextFilterModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { DTPicker } from "./DTPicker";
import { format, toZonedTime } from "date-fns-tz";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  CustomFilterModule,
  DateFilterModule,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
]);

export default function HistoryPageGrid() {
  const [data, setData] = useState<any[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);
  const gridApiRef = useRef<any>(null);

  const [colDefs] = useState([
    { field: "id", filter: "agNumberColumnFilter" },
    {
      field: "datetime",
      filter: "agDateColumnFilter",
      minWidth: 225,
      filterParams: {
        defaultOption: "inRange",
        inRangeInclusive: true,
        comparator: timestampFilter,
      },
    },
    { field: "name", filter: "agTextColumnFilter" },
    { field: "type", filter: "agTextColumnFilter" },
    { field: "value", filter: "agNumberColumnFilter" },
  ]);

  const clearFilters = () => {
    if (gridApiRef.current) {
      gridApiRef.current.setFilterModel(null);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/data");
      const result = await response.json();
      setData(result);

      const formattedData = result.map((item: any, index: number) => ({
        id: index,
        datetime: formatInTimeZone(item.datetime, "America/New_York", "yyyy-MM-dd HH:mm:ss"),
        name: item.name,
        type: item.type,
        value: item.value,
      }));
      setRowData(formattedData);
    }
    fetchData();
  }, []);

  return (
    <div>
      <button onClick={clearFilters} style={{ marginBottom: "10px" }}>
        Clear All Filters
      </button>
      <div
        className="ag-theme-quartz center"
        style={{ height: 500, width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            resizable: true,
            sortable: true,
            filter: true,
            filterParams: {
              buttons: ["apply", "clear", "reset"],
            },
          }}
          domLayout="autoHeight"
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          onGridReady={(params) => {
            gridApiRef.current = params.api;
          }}
          components={{
            agDateInput: DTPicker,
          }}
        />
      </div>
    </div>
  );
}

/**
 * Credit: https://javascript.plainenglish.io/how-to-create-a-datetime-filter-in-ag-grid-react-e2e1ba2fc80
 * Timestamp filter function to be passed to comparator
 * in column definition
 * @param { * } filterLocalDate - Date to filter by
 * @param { * } cellValue - Date from table cell
 * @returns 0 | 1 | -1
 */
function timestampFilter(filterLocalDate, cellValue) {
  if (!cellValue) return -1;

  filterLocalDate = new Date(filterLocalDate);
  const filterBy = filterLocalDate.getTime();

  try {
    const filterMe = new Date(cellValue).getTime();

    if (filterBy === filterMe) return 0;
    return filterMe < filterBy ? -1 : 1;
  } catch (error) {
    console.error("Invalid datetime format:", cellValue);
    return -1; // default to -1 for invalid dates
  }
}

function formatInTimeZone(datetime: any, timeZone: string, formatString: string) {
  const zonedDate = toZonedTime(datetime, timeZone);
  return format(zonedDate, formatString, { timeZone });
}