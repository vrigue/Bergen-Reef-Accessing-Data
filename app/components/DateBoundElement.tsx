import React, { useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const DateBoundElement = ({ value, onChange }: { value: Date | null; onChange: (date: Date | null) => void }) => {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      const fp = flatpickr(ref.current, {
      enableTime: true,
      enableSeconds: true,
      time_24hr: true,
      defaultDate: value,
      onChange: (selectedDates) => {
        onChange(selectedDates.length ? selectedDates[0] : null);
      },
      disable: [
        {
          from: new Date(new Date().setDate(new Date().getDate() + 1)),
          to: new Date(9999, 12, 31)
        }
      ]
      });

      const updateWidth = () => {
      if (ref.current) {
        ref.current.style.width = `${ref.current.value.length + 1}ch`;
      }
      };

      ref.current.addEventListener('input', updateWidth);
      updateWidth();

      return () => {
      fp.destroy();
      if (ref.current) {
        ref.current.removeEventListener('input', updateWidth);
      }
      };
    }
  }, [value, onChange]);

  return <input ref={ref} />;
};

export default DateBoundElement;