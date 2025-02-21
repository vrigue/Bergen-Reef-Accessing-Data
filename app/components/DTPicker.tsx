import type { IDateComp, IDateParams } from "ag-grid-community";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/material_blue.css";

export class DTPicker implements IDateComp {
  params!: IDateParams;
  eGui!: HTMLDivElement;
  eInput!: HTMLInputElement;
  picker: any;
  date: any;

  init(params: IDateParams) {
    const template = `
        <input type="text" data-input style="width: 100%; border: 1px solid black; font-size: 16px;" />
        <a class="input-button" title="clear" data-clear>
          <i class="fa fa-times"></i>
        </a>`;

    this.params = params;
    this.eGui = document.createElement("div");
    this.eGui.setAttribute("role", "presentation");
    this.eGui.classList.add("ag-input-wrapper", "custom-date-filter");
    this.eGui.innerHTML = template;

    this.eInput = this.eGui.querySelector("input")!;

    this.picker = flatpickr(this.eGui, {
      onChange: this.onDateChanged.bind(this),
      // dateFormat: "Z", // used for UTC time, but breaks filtering user experience
      wrap: true,
      enableTime: true,
      enableSeconds: true,
      time_24hr: true,
    });

    this.picker.calendarContainer.classList.add("ag-custom-component-popup");
    this.date = null;
  }

  getGui() {
    return this.eGui;
  }

  onDateChanged(selectedDates: any) {
    this.date = selectedDates[0] || null;
    this.params.onDateChanged();
  }

  getDate() {
    return this.date;
  }

  setDate(date: any) {
    this.picker.setDate(date);
    this.date = date;
  }

  setInputPlaceholder(placeholder: string) {
    this.eInput.setAttribute("placeholder", "Enter date here...");
  }

  setInputAriaLabel(label: string) {
    this.eInput.setAttribute("aria-label", label);
  }
}
