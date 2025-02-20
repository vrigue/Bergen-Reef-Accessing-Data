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
  TextEditorModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { DTPicker } from "./DTPicker";
import { format, toZonedTime } from "date-fns-tz";

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedRows, setEditedRows] = useState<Record<number, any>>({});

  function isCellEditable(params: EditableCallbackParams | CellClassParams) {
    return isEditing;
  }

  const handleCellValueChanged = (params) => {
    const rowId = params.data.id;
    setEditedRows((prev) => ({
      ...prev,
      [rowId]: { ...params.data, [params.column.getColId()]: params.newValue },
    }));
  };

  const saveChanges = async () => {
    if (Object.keys(editedRows).length === 0) return;
    try {
      const response = await fetch("/api/updateData", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: Object.values(editedRows) }),
      });
      if (!response.ok) throw new Error("Failed to update database");
      alert("Changes saved successfully!");
      setEditedRows({});
      // fetchData(); // updating this is a potential fix for possible issues with the data not updating after saving changes when passing json data between pages
      // ^ however for now re-rending a lot of data is not necessary imo
    } catch (error) {
      console.error("Error saving changes: ", error);
      alert("Error saving changes.");
    }
  };

  async function fetchData() {
    const response = await fetch("/api/data");
    const result = await response.json();
    setData(result);
    setRowData(
      result.map((item) => ({
        ...item,
        datetime: formatInTimeZone(
          item.datetime,
          "America/New_York",
          "yyyy-MM-dd HH:mm:ss"
        ),
      }))
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "10px",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => gridApiRef.current?.setFilterModel(null)}
          style={{
            borderRadius: "20px",
            padding: "10px 10px",
            backgroundColor: "#7c7c7c",
            color: "white",
          }}
        >
          Clear All Filters
        </button>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            style={{
              borderRadius: "20px",
              padding: "10px 10px",
              backgroundColor: "#E60000",
              color: "white",
            }}
          >
            {isEditing ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
          <button // honestly this button might be gotten rid of - to complex to code for the MVP
            onClick={saveChanges}
            style={{
              borderRadius: "20px",
              padding: "8px 10px",
              backgroundColor: "#4CAF50",
              color: "white",
            }}
            disabled={Object.keys(editedRows).length === 0}
          >
            Save Changes
          </button>
        </div>
      </div>
      <div
        className="ag-theme-quartz center"
        style={{ height: 500, width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={useMemo(
            () => [
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
                editable: isCellEditable,
                onCellValueChanged: handleCellValueChanged,
              },
            ],
            [isEditing]
          )}
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
