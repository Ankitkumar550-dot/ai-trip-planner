import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

type Props = {
  onSelectedOption: (value: string) => void;
};

function SelectDaysUi({ onSelectedOption }: Props) {
  const [days, setDays] = useState(3);

  const handleDecrease = () => {
    if (days > 1) {
      setDays(days - 1);
    }
  };

  const handleIncrease = () => {
    if (days < 30) {
      setDays(days + 1);
    }
  };

  return (
    <div className="w-full mt-4">
      <div className="rounded-2xl bg-white shadow-sm border p-6 flex flex-col items-center justify-center max-w-sm">
        <h2 className="text-lg font-bold text-gray-900 text-center mb-6">
          How many days do you want to travel?
        </h2>
        
        <div className="flex items-center gap-6 mb-6">
          <button 
            onClick={handleDecrease}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition text-gray-600 disabled:opacity-50"
            disabled={days <= 1}
          >
            <Minus size={20} strokeWidth={3} />
          </button>
          
          <span className="text-2xl font-bold w-24 text-center">
            {days} Days
          </span>
          
          <button 
            onClick={handleIncrease}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition text-gray-600 disabled:opacity-50"
            disabled={days >= 30}
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>

        <Button 
          onClick={() => onSelectedOption(`${days} Days`)}
          className="bg-[#f25e3d] hover:bg-[#d95234] text-white px-8 rounded-xl font-medium"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default SelectDaysUi;