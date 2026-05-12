import React, { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

function SelectDaysUi({ onSelectedOption }) {
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
      <div className="rounded-2xl bg-neutral-900 shadow-2xl border border-white/10 p-6 flex flex-col items-center justify-center max-w-sm">
        <h2 className="text-lg font-bold text-white text-center mb-6">
          How many days do you want to travel?
        </h2>
        
        <div className="flex items-center gap-6 mb-6">
          <button 
            onClick={handleDecrease}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 bg-neutral-800 hover:bg-neutral-700 hover:border-blue-500/50 transition text-white disabled:opacity-30"
            disabled={days <= 1}
          >
            <Minus size={20} strokeWidth={3} />
          </button>
          
          <span className="text-2xl font-bold w-24 text-center text-white">
            {days} Days
          </span>
          
          <button 
            onClick={handleIncrease}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 bg-neutral-800 hover:bg-neutral-700 hover:border-blue-500/50 transition text-white disabled:opacity-30"
            disabled={days >= 30}
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>

        <Button 
          onClick={() => onSelectedOption(`${days} Days`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-bold w-full"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default SelectDaysUi;
