import React, { useState } from "react";

const ZoomSlider = () => {
    const [value, setValue] = useState(50);
  
    return (
      <div className="w-full justify-center">
          <div className="mt-[265px] ml-4 text-left text-m font-semibold">Zoom: {value}%</div>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="ml-4 w-11/12 h-2 bg-gray-400 rounded-lg cursor-pointer accent-medium-teal"
        />
      </div>
    );
  };
  
  export default ZoomSlider;