import React from "react";
import { CalendarDays, Sparkles, Clock3 } from "lucide-react";

type Props = {
  onSelectedOption: (value: string) => void;
};

function SelectDaysUi({ onSelectedOption }: Props) {
  const dayOptions = [
    {
      id: 1,
      title: "Weekend Escape",
      days: "2-3 Days",
      desc: "Perfect for a quick refresh trip.",
      color: "from-orange-100 to-orange-50",
      iconBg: "bg-orange-500",
    },
    {
      id: 2,
      title: "Short Vacation",
      days: "4-5 Days",
      desc: "Balanced trip with comfort and fun.",
      color: "from-purple-100 to-purple-50",
      iconBg: "bg-purple-500",
    },
    {
      id: 3,
      title: "Full Adventure",
      days: "6-7 Days",
      desc: "Explore deeply without rushing.",
      color: "from-pink-100 to-pink-50",
      iconBg: "bg-pink-500",
    },
  ];

  return (
    <div className="w-full space-y-4 mt-4">
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 px-5 py-4">
        <p className="text-gray-800 text-base leading-7">
          Awesome! How many days would you like for your trip?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {dayOptions.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectedOption(item.days)}
            className={`group cursor-pointer rounded-3xl border border-white/50 bg-gradient-to-br ${item.color} p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-md`}
              >
                <CalendarDays className="text-white w-6 h-6" />
              </div>

              <span className="flex items-center gap-1 text-sm font-medium text-gray-600 bg-white/70 px-3 py-1 rounded-full">
                <Clock3 size={15} />
                {item.days}
              </span>
            </div>

            <div className="mt-5">
              <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
              <p className="text-sm text-gray-600 mt-2 leading-6">
                {item.desc}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-orange-600">
              <Sparkles size={16} />
              Best for smart planning
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectDaysUi;