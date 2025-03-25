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
  RowSelectionModule,
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
  RowSelectionModule,
  TextFilterModule,
  CellStyleModule,
  ValidationModule,
]);

import Dialog from "./HistoryPageDialog";

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
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "",
    onConfirm: null
  });

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

  const onSelectionChanged = () => {
    const selectedRows = gridApiRef.current?.getSelectedRows();
    setSelectedRows(selectedRows || []);
  };

  const handleDeleteRow = async (params) => {
    setDialog({
      isOpen: true,
      title: "Confirm Delete",
      message: "Are you sure you want to delete this entry?",
      type: "warning",
      onConfirm: () => deleteRow(params)
    });
  }

  const deleteRow = async (params) => {
    const rowId = params.data.id;
    const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    try {
      const response = await fetch(`/api/deleteData`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rowId, date: date}),
      });
  
      if (!response.ok) throw new Error("Failed to delete row");
  
      setRowData((prev) => prev.filter((row) => row.id !== rowId));

      setDialog({
        isOpen: true,
        title: "Success",
        message: "The selected entry has been deleted.",
        type: "success",
        onConfirm: null
      });
    } 
    catch (error) {
      console.error("Error deleting row: ", error);
      setDialog({
        isOpen: true,
        title: "Error",
        message: "There was an error in deleting the selected entry.",
        type: "error",
        onConfirm: null
      });
    }
  };

  const handleDeleteSelectedRows = () => {
    setDialog({
      isOpen: true,
      title: "Confirm Delete",
      message: "Are you sure you want to delete these entries?",
      type: "warning",
      onConfirm: () => deleteSelectedRows(), // Function to call on confirm
    });
  };

  const deleteSelectedRows = async () => {
    const selectedRows = gridApiRef.current?.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) return;
  
    const idsToDelete = selectedRows.map((row) => row.id);
    const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  
    try {
      const response = await fetch(`/api/deleteData`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete, date: date }),
      });
  
      if (!response.ok) throw new Error("Failed to delete rows");
  
      setRowData((prev) => prev.filter((row) => !idsToDelete.includes(row.id)));

      setDialog({
        isOpen: true,
        title: "Success",
        message: "The selected entries have been deleted.",
        type: "success",
        onConfirm: null
      });
      
    } catch (error) {
      console.error("Error deleting rows: ", error);
      setDialog({
        isOpen: true,
        title: "Error",
        message: "There was an error in deleting the selected entries.",
        type: "error",
        onConfirm: null
      });
    }
  };  

const handleCreateRow = async () => {
  const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  const newRow = {
    id: 1, // Temporary ID, will be replaced by DB
    datetime: date,
    name: "",
    type: "",
    value: 0,
    isNewRow: true, // Add isNewRow attribute
  };

  setRowData((prev) => {
    return [newRow, ...prev.map((row) => ({ ...row }))];
  });
};

  
const handleSaveNewRow = async (params) => {
  const newRowData = { ...params.data };

  if (!newRowData || !newRowData.isNewRow) {
    return;
  }

  // Remove isNewRow attribute
  newRowData.isNewRow = false;

  try {
    const response = await fetch("/api/createData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRowData),
    });

    if (!response.ok) {
      throw new Error("Failed to save row");
    }

    const result = await response.json();

    setRowData((prev) =>
      prev.map((row) => (row.id === 1 ? { ...row, id: result.id } : row))
    );

    setDialog({
      isOpen: true,
      title: "Success",
      message: "The new entry has been created.",
      type: "success",
      onConfirm: null
    });
    fetchData();
  } 
  catch (error) {
    console.error("Error saving row: ", error);
    setDialog({
      isOpen: true,
      title: "Error",
      message: "There was an error in creating the new entry.",
      type: "error",
      onConfirm: null
    });
  }
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

      setDialog({
      isOpen: true,
      title: "Success",
      message: "All changes have been saved.",
      type: "success",
      onConfirm: null
    });
      setEditedRows({});
      fetchData();
    } 
    catch (error) {
      console.error("Error saving changes: ", error);
      setDialog({
      isOpen: true,
      title: "Error",
      message: "There was an error in saving the changes.",
      type: "error",
      onConfirm: null
    });
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
          "UTC",
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
        className="flex flex-col bg-white drop-shadow-gray drop-shadow-lg rounded-lg shadow-md"
        style={{
          width: "31%",
          position: "fixed",
          top: "12.8%",
          height: "79%",
          overflowY: "auto",
          margin: "23px",
        }}
      >
        <div className="flex flex-col h-full justify-start">
          <div className="bg-teal drop-shadow-gray drop-shadow-lg rounded-lg p-4">
            <h2 className="flex justify-center text-xl text-white font-semibold">Actions</h2>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <button
              onClick={() => gridApiRef.current?.setFilterModel(null)}
              className="bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-medium px-4 py-2 rounded-xl hover:bg-medium-gray"
            >
              Clear Filters
            </button>

            <button
              onClick={fetchData}
              className="bg-medium-teal outline outline-1 outline-dark-teal drop-shadow-xl text-white font-medium px-4 py-2 rounded-xl shadow hover:bg-dark-teal"
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
              <ArrowPathIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer mr-2" />
              Refresh
            </button>
            <button
              onClick={handleGraphClick}
              className="bg-orange text-white outline outline-1 outline-dark-orange drop-shadow-xl font-medium px-4 py-2 rounded-xl shadow hover:bg-dark-orange"
              style={{
              padding: "8px 16px",
              fontSize: "16px",
              color: "white",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              }}
              // onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EA580C")}
              // onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFA500")}
            >
              <ChartBarIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer mr-2" />
              Graphs
            </button>
            {isAdmin && (
            <div className="w-full flex flex-col gap-2">
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className="bg-neutral-600 text-white font-medium px-4 py-2 rounded-xl shadow hover:bg-neutral-700"
              >
                {isEditing ? "Exit Edit Mode" : "Enter Edit Mode"}
              </button>

              {isEditing && (
                <div className="w-full flex flex-col gap-3 bg-light-teal p-4 rounded-lg mt-2">
                  <div className="w-1/3 bg-teal text-white font-semibold text-center p-1 rounded-xl">Edit Controls</div>
                  <button
                  onClick={handleCreateRow}
                  className="bg-white outline outline-1 outline-dark-orange drop-shadow-xl text-orange font-semibold px-4 py-2 rounded-xl shadow hover:bg-light-orange"
                  >Create
                  </button> 

                  <button
                  onClick={handleDeleteSelectedRows}
                  className="bg-white outline outline-1 outline-red-500 drop-shadow-xl text-red-500 font-semibold px-4 py-2 rounded-xl shadow hover:bg-red-200"
                  disabled={selectedRows.length === 0}
                  >Delete Selected
                  </button> 

                  <button
                  onClick={saveChanges}
                  className="bg-white outline outline-1 outline-green-500 drop-shadow-xl text-green-500 font-semibold px-4 py-2 rounded-xl shadow hover:bg-green-200"
                  disabled={Object.keys(editedRows).length === 0}
                  >Save Changes
                  </button> 
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
      

      {/* Right Panel */}
      <div className="flex-1 rounded-lg p-4" style={{ marginLeft: "35%"}}>
        <div className="ag-theme-quartz" style={{ height: "400px" }}>
          <AgGridReact
            rowData={rowData}
            rowSelection={"multiple" as any}
            onSelectionChanged={onSelectionChanged}
            columnDefs={useMemo(
              () => {
                const gridColumns = [
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
                  {
                    field: "name",
                    filter: "agTextColumnFilter",
                    editable: (params) => params.data?.isNewRow && isEditing,
                  },
                  {
                    field: "type",
                    filter: "agTextColumnFilter",
                    editable: (params) => params.data?.isNewRow && isEditing,
                  },
                  {
                    field: "value",
                    filter: "agNumberColumnFilter",
                    editable: (params) => params.data?.isNewRow || isCellEditable,
                    onCellValueChanged: handleCellValueChanged,
                    valueParser: (data) => {
                      const newValue = parseFloat(data.newValue);
                      return newValue;
                    }
                  }
                ];

                if (isEditing) {
                  gridColumns.push({
                    headerName: "Actions",
                    field: "delete",
                    cellRenderer: (params) => {
                      if (params.data.isNewRow) {
                        return (
                          <button
                            onClick={() => handleSaveNewRow(params)}
                            className="bg-white outline outline-1 outline-green-500 drop-shadow-xl text-green-500 text-xs px-1 py-0.5 w-14 h-6 rounded-lg shadow hover:bg-green-200"
                          >
                            Save
                          </button>
                        );
                      }

                      return (
                        <button
                          onClick={() => handleDeleteRow(params)}
                          className="bg-white outline outline-1 outline-red-500 drop-shadow-xl text-red-500 font-semibold text-xs px-1 py-0.5 w-14 h-6 rounded-lg shadow hover:bg-red-200"
                        >
                          Delete
                        </button>
                      );
                    },
                    width: 80,
                  } as any);
                }

                return gridColumns;
              },
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
      <br></br>

      <Dialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onClose={() => setDialog({ ...dialog, isOpen: false })}
        onConfirm={dialog.onConfirm}
      />
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
