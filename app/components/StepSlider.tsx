import React, { useState } from "react";

interface StepSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const StepSlider: React.FC<StepSliderProps> = ({ value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value);
  return (
    <div className="w-full">
          <div className="mt-[30px] ml-4 text-left text-m font-semibold">Step: {sliderValue}</div>
        <input
          type="range"
          min="0"
          max="20"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="ml-4 w-11/12 h-2 bg-gray-400 rounded-lg cursor-pointer accent-dark-orange"
        />
      </div>
  );
};

export default StepSlider;