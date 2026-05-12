import React from 'react'

export const SelectBudgetOption = [
    {
        id: 1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: '💵',
    },
     {
        id: 2,
        title: 'Moderate',
        desc: 'Keep cost on the average side',
        icon: '💰',
    },
     {
        id: 3,
        title: 'Luxury',
        desc: "Don't worry about cost",
        icon: '💸',
    },
]

function BudgetUi({onSelectedOption}) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 w-full'>
      {SelectBudgetOption.map((item, index) => (
        <div
          key={index}
          className='p-4 border border-white/10 rounded-2xl bg-neutral-900 hover:border-blue-500/50 hover:shadow-indigo-500/10 cursor-pointer transition-all flex flex-col text-left'
          onClick={() => onSelectedOption(item.title + ":" + item.desc)}
        >
          <div className='text-4xl mb-3'>{item.icon}</div>
          <h2 className='text-base font-bold text-white'>{item.title}</h2>
          <p className='text-sm text-gray-400 mt-1 leading-snug'>{item.desc}</p>
        </div>
      ))}
    </div>
  )
}

export default BudgetUi
