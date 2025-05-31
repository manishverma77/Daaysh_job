import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        🔍 Filter Jobs
      </h1>
      <hr className="mb-4 border-gray-200" />

      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-2">
              {data.filterType}
            </h2>
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`;
              return (
                <div
                  key={itemId}
                  className="flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                  onClick={() => changeHandler(item)}
                >
                  <RadioGroupItem
                    value={item}
                    id={itemId}
                    className="h-4 w-4 border-2 border-gray-400 rounded-full data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 transition-colors duration-200"
                  />
                  <Label
                    htmlFor={itemId}
                    className={`text-sm font-medium ${
                      selectedValue === item ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {item}
                  </Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
