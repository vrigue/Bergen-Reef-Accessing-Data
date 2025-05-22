import React, { useState, useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/themes/confetti.css";

function formatDate(date: Date | null) {
  if (!date) return '';
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${mm}/${dd}/${yy} ${hh}:${min}:${ss}`;
}

const DateBoundElement = ({ value, onChange }: { value: Date | null; onChange: (date: Date | null) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<any>(null);
  const [tempDate, setTempDate] = useState<Date | null>(value);

  useEffect(() => {
    if (!inputRef.current) return;

    // Destroy existing instance if it exists
    if (fpRef.current) {
      fpRef.current.destroy();
    }

    const config = {
      enableTime: true,
      enableSeconds: true,
      time_24hr: true,
      defaultDate: value,
      dateFormat: "m:d:y H:i:S", // for flatpickr calendar, but we'll format input ourselves
      closeOnSelect: false,
      onChange: (selectedDates: Date[]) => {
        if (selectedDates.length) {
          const newDate = selectedDates[0];
          setTempDate(newDate);
          if (inputRef.current) {
            inputRef.current.value = formatDate(newDate);
          }
        }
      },
      disable: [
        {
          from: new Date(new Date().setDate(new Date().getDate() + 1)),
          to: new Date(9999, 12, 31)
        }
      ],
      onReady: (selectedDates: Date[], dateStr: string, instance: any) => {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'flatpickr-buttons';
        buttonsContainer.style.cssText = `
          display: flex;
          justify-content: space-between;
          padding: 8px;
          border-top: 1px solid #ddd;
          background: #f8f8f8;
          border-radius: 0 0 4px 4px;
        `;

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.cssText = `
          padding: 6px 12px;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          color: #666;
        `;
        cancelButton.onmouseover = () => cancelButton.style.background = '#e0e0e0';
        cancelButton.onmouseout = () => cancelButton.style.background = '#f0f0f0';

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.style.cssText = `
          padding: 6px 12px;
          background: #4CAF50;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          color: white;
        `;
        updateButton.onmouseover = () => updateButton.style.background = '#45a049';
        updateButton.onmouseout = () => updateButton.style.background = '#4CAF50';

        cancelButton.onclick = () => {
          instance.close();
          setTempDate(value);
          if (inputRef.current) {
            inputRef.current.value = formatDate(value);
          }
          instance.setDate(value);
        };

        updateButton.onclick = () => {
          // Always get the selected date from flatpickr instance
          const selected = instance.selectedDates && instance.selectedDates[0] ? instance.selectedDates[0] : tempDate;
          if (selected) {
            onChange(selected);
            if (inputRef.current) {
              inputRef.current.value = formatDate(selected);
            }
          }
          instance.close();
        };

        buttonsContainer.appendChild(cancelButton);
        buttonsContainer.appendChild(updateButton);

        // Add the buttons container to the calendar
        instance.calendarContainer.appendChild(buttonsContainer);
      }
    };

    // Initialize flatpickr
    fpRef.current = flatpickr(inputRef.current, config);

    // Set initial input value
    if (inputRef.current) {
      inputRef.current.value = formatDate(value);
    }

    const updateWidth = () => {
      if (inputRef.current) {
        inputRef.current.style.width = `${inputRef.current.value.length + 1}ch`;
      }
    };

    inputRef.current.addEventListener('input', updateWidth);
    updateWidth();

    // Cleanup function
    return () => {
      if (fpRef.current) {
        fpRef.current.destroy();
      }
      if (inputRef.current) {
        inputRef.current.removeEventListener('input', updateWidth);
      }
    };
  }, [value, onChange]);

  return <input ref={inputRef} />;
};

export default DateBoundElement;