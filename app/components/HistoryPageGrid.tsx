"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import "../globals.css";
import { AgGridReact } from "ag-grid-react";

import {
  CellClassParams,
  CellStyleModule,
  ClientSideRowModelModule,
  PaginationModule,
  CustomFilterModule,
  DateFilterModule,
  NumberFilterModule,
  TextFilterModule,
  EditableCallbackParams,
  NumberEditorModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { DTPicker } from "./DTPicker";
import { format, toZonedTime } from "date-fns-tz";

ModuleRegistry.registerModules([
  NumberEditorModule,
  ClientSideRowModelModule,
  PaginationModule,
  CustomFilterModule,
  DateFilterModule,
  NumberFilterModule,
  TextFilterModule,
  CellStyleModule,
  ValidationModule,
]);

export default function HistoryPageGrid() {
  const [data, setData] = useState<any[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);
  const gridApiRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode
  const [editedRows, setEditedRows] = useState({}); // Store edited row data

  function isCellEditable(params: EditableCallbackParams | CellClassParams) {
    return true; // temporarily
    // return params.data.year === 0;
  }

  const handleCellValueChanged = (params) => {
    const rowId = params.data.id;
    const newValue = params.newValue;

    // Update the editedRows state
    setEditedRows((prevEditedRows) => ({
      ...prevEditedRows,
      [rowId]: { ...params.data, value: newValue }, // Store the entire row data
    }));
  };

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
    {
      field: "value",
      filter: "agNumberColumnFilter",
      editable: (params) => isEditing && isCellEditable(params), // Conditional editing
      cellEditor: "agNumberCellEditor", // Use a number cell editor
      onCellValueChanged: handleCellValueChanged, // Handle cell value changes
    },
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
        id: item.id,
        datetime: formatInTimeZone(
          item.datetime,
          "America/New_York",
          "yyyy-MM-dd HH:mm:ss"
        ),
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
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button
          onClick={clearFilters}
          style={{
            borderRadius: "20px",
            padding: "10px 20px",
            marginRight: "20px",
          }}
        >
          Clear All Filters
        </button>
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          style={{
            borderRadius: "20px",
            padding: "10px 20px",
          }}
        >
          {isEditing ? "Is Editing" : "Enter Edit Mode"}
        </button>
      </div>
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

function formatInTimeZone(
  datetime: any,
  timeZone: string,
  formatString: string
) {
  const zonedDate = toZonedTime(datetime, timeZone);
  return format(zonedDate, formatString, { timeZone });
}
