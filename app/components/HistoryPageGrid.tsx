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
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
          if (!cellValue) return -1;
          const cellDate = new Date(cellValue);
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          return cellDate < filterLocalDateAtMidnight ? -1 : 1;
        },
      },
    },
    { field: "name", filter: "agTextColumnFilter" },
    { field: "type", filter: "agTextColumnFilter" },
    { field: "value", filter: "agNumberColumnFilter" },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      sortable: true,
      filter: true,
    };
  }, []);

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
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          pagination={true}
          paginationPageSize={10}
          onGridReady={(params) => {
            gridApiRef.current = params.api;
          }}
        />
      </div>
    </div>
  );
}