import type { IDateComp, IDateParams } from "ag-grid-community";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/confetti.css";

export class DTPicker implements IDateComp {
  params!: IDateParams;
  eGui!: HTMLDivElement;
  eInput!: HTMLInputElement;
  picker: any;
  date: any;
  tempDate: any;

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
    this.tempDate = this.date;

    this.picker = flatpickr(this.eGui, {
      onChange: (selectedDates) => {
        if (selectedDates.length) {
          this.tempDate = selectedDates[0];
        }
      },
      wrap: true,
      enableTime: true,
      enableSeconds: true,
      time_24hr: true,
      closeOnSelect: false,
      onReady: (selectedDates, dateStr, instance) => {
        // Add custom buttons to the calendar
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
          this.tempDate = this.date;
          if (this.eInput) {
            this.eInput.value = this.date ? this.date.toLocaleString() : '';
          }
        };

        updateButton.onclick = () => {
          if (this.tempDate) {
            this.date = this.tempDate;
            this.params.onDateChanged();
          }
          instance.close();
        };

        buttonsContainer.appendChild(cancelButton);
        buttonsContainer.appendChild(updateButton);

        // Add the buttons container to the calendar
        instance.calendarContainer.appendChild(buttonsContainer);
      }
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
    this.tempDate = date;
  }

  setInputPlaceholder(placeholder: string) {
    this.eInput.setAttribute("placeholder", "Enter date here...");
  }

  setInputAriaLabel(label: string) {
    this.eInput.setAttribute("aria-label", label);
  }
}
