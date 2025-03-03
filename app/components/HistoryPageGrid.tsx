"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import "../globals.css";
import { AgGridReact } from "ag-grid-react";
import { isUserAdmin } from '../../actions/isUserAdmin';
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";

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
import { ArrowPathIcon, ChartBarIcon } from "@heroicons/react/24/solid";

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

  const { user, error, isLoading } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
  
    useEffect(() => {
      async function checkAdmin() {
        if (user) {
          const adminStatus = await isUserAdmin();
          setIsAdmin(adminStatus);
        }
      }
      checkAdmin();
      console.log(isAdmin);
    }, [user]);

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
      fetchData();
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

  const handleGraphClick = () => {
    window.location.href = "/data";
  };

  return (
    <div className="flex gap-8 mt-6">
      {/* Left Panel */}
      <div
        className="flex flex-col bg-gray-200 p-6 rounded-lg shadow-md"
        style={{
          width: "30%",
          position: "fixed",
          top: "20%",
          height: "60vh",
          overflowY: "auto",
        }}
      >
        <div className="flex flex-col h-full justify-start">
          <h2 className="flex justify-center text-xl font-bold text-gray-800 mb-4">
            Actions
          </h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => gridApiRef.current?.setFilterModel(null)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-400"
            >
              Clear Filters
            </button>

            {isAdmin && (
            <div className="w-full flex flex-col gap-2">
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
              >
                {isEditing ? "Exit Edit Mode" : "Enter Edit Mode"}
              </button>
              <button
                onClick={saveChanges}
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
                disabled={Object.keys(editedRows).length === 0}
              >
                Save Changes
              </button> 
            </div>
            )}


            <button
              onClick={fetchData}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
              style={{
                padding: "8px 16px",
                fontSize: "16px",
                color: "white",
                border: "none",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowPathIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer mr-2" />
              Refresh
            </button>
            <button
              onClick={handleGraphClick}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700"
              style={{
              padding: "8px 16px",
              fontSize: "16px",
              backgroundColor: "#FFA500",
              color: "white",
              border: "none",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EA580C")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFA500")}
            >
              <ChartBarIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer mr-2" />
              Graphs
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 rounded-lg p-4" style={{ marginLeft: "33%" }}>
        <div className="ag-theme-quartz" style={{ height: "400px" }}>
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
