import React, { useState } from "react";

interface ZoomSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const ZoomSlider: React.FC<ZoomSliderProps> = ({ value, onChange }) => {
  let [sliderValue, setSliderValue] = useState(value);
  return (
    <div className="w-full">
          <div className="mt-[265px] ml-4 text-left text-m font-semibold">Zoom: {sliderValue}%</div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="ml-4 w-11/12 h-2 bg-gray-400 rounded-lg cursor-pointer accent-medium-teal"
        />
      </div>
  );
};
  
  export default ZoomSlider;