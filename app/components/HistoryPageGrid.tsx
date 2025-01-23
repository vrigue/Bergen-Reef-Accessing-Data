"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import "../globals.css";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  DateFilterModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
]);

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import DTPicker from "./DTPicker";

export default function HistoryPageGrid() {
  const [data, setData] = useState<any[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);
  const gridApiRef = useRef<any>(null);

  const [colDefs] = useState([
    { field: "id", filter: "agNumberColumnFilter" },
    {
      field: "datetime",
      filter: "agDateColumnFilter",
      filterParams: {
        defaultOption: "inRange",
        comparator: function (filterLocalDate, cellValue) {
          // Parse both dates using the ISO 8601 format
          filterLocalDate = new Date(filterLocalDate);
          cellValue = new Date(cellValue); 
        
          // Directly compare the dates
          return filterLocalDate.getTime() - cellValue.getTime(); 
        },
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
        datetime: item.datetime,
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
        Clear Filters
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
              buttons: ['apply', 'clear', 'reset'],
            },
          }}
          domLayout="autoHeight"
          pagination={true}
          paginationPageSize={10}
          onGridReady={(params) => {
            gridApiRef.current = params.api;
          }}
          components={{
            agDateInput: DTPicker
          }}
        />
      </div>
    </div>
  );
}
