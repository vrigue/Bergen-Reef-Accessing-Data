// all of this is sample code - use as reference if DTPicker breaks - this is an outdated but working (with tweaks) alternative

// import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
// import flatpickr from "flatpickr";
// import "flatpickr/dist/flatpickr.min.css";
// import "flatpickr/dist/themes/dark.css";

// const CustomDateRangeFilter = forwardRef((props: any, ref) => {
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);

//   const startPickerRef = useRef<HTMLDivElement>(null);
//   const endPickerRef = useRef<HTMLDivElement>(null);

//   // Update start date on Flatpickr date change
//   const onStartDateChange = (dates: Date[]) => {
//     const newStartDate = dates[0];
//     setStartDate(newStartDate);
//     props.filterChangedCallback(); // Notify AG Grid of filter changes
//   };

//   // Update end date on Flatpickr date change
//   const onEndDateChange = (dates: Date[]) => {
//     const newEndDate = dates[0];
//     setEndDate(newEndDate);
//     props.filterChangedCallback();
//   };

//   // Initialize Flatpickr instances
//   useEffect(() => {
//     flatpickr(startPickerRef.current, {
//       onChange: onStartDateChange,
//       dateFormat: "Y-m-d H:i:S",
//       enableTime: true,
//       enableSeconds: true,
//       wrap: true,
//     });

//     flatpickr(endPickerRef.current, {
//       onChange: onEndDateChange,
//       dateFormat: "Y-m-d H:i:S",
//       enableTime: true,
//       enableSeconds: true,
//       wrap: true,
//     });
//   }, []);

//   // Implement AG Grid filter lifecycle methods
//   useImperativeHandle(ref, () => ({
//     isFilterActive() {
//       console.log("Checking if filter is active:", startDate, endDate); // Debug
//       return !!startDate || !!endDate;
//     },
//     getModel() {
//       console.log("Getting filter model:", startDate, endDate); // Debug
//       if (!startDate && !endDate) return null;
//       return {
//         startDate: startDate ? startDate.toISOString() : null,
//         endDate: endDate ? endDate.toISOString() : null,
//       };
//     },
//     setModel(model) {
//       console.log("Setting filter model:", model); // Debug
//       setStartDate(model?.startDate ? new Date(model.startDate) : null);
//       setEndDate(model?.endDate ? new Date(model.endDate) : null);
//     },
//   }));

//   return (
//     <div className="custom-date-range-filter">
//       <div ref={startPickerRef}>
//         <input type="text" data-input placeholder="Start Date" />
//         <a className="input-button" title="clear" data-clear>
//           <i className="fa fa-times"></i>
//         </a>
//       </div>
//       <div ref={endPickerRef}>
//         <input type="text" data-input placeholder="End Date" />
//         <a className="input-button" title="clear" data-clear>
//           <i className="fa fa-times"></i>
//         </a>
//       </div>
//     </div>
//   );
// });

// export default CustomDateRangeFilter;