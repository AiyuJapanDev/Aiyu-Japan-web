import React from "react";

type PropType = {
  selected: boolean;
  index: number;
  onClick: () => void;
};

export const CarouselSteps: React.FC<PropType> = (props) => {
  const { selected, index, onClick } = props;

  return (
    <div
      className={`flex-shrink-0 w-[22%] sm:w-[15%] px-3.2 min-w-0 ${
        selected ? "text-white" : ""
      }`}
    >
      <button
        onClick={onClick}
        type="button"
        className={`flex items-center justify-center w-full h-24 rounded-[1.8rem] text-xl font-semibold cursor-pointer border-0 p-0 m-0 ring-inset ring-2 ring-gray-400 text-gray-600 transition-all ${
          selected ? "text-gray-900" : ""
        }`}
      >
        {index + 1}
      </button>
    </div>
  );
};
