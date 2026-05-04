import React from 'react'

export const SelectTravelesList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A sole traveler in exploration',
    Icon: '✈️',
    people: '1'
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two travelers in tandem',
    Icon: '🥂',
    people: '2 people'
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of explorers',
    Icon: '🏡',
    people: '3 to 5 People'
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekers',
    Icon: '⛵',
    people: '5 to 10 People'
  },
];

function GroupSizeUi({ onSelectedOption }: any) {
  return (
    <div className='flex flex-col gap-3 mt-4 w-full'>
      {SelectTravelesList.map((item) => (
        <div
          key={item.id}
          className='p-3 border rounded-xl bg-white hover:border-gray-400 hover:shadow-sm cursor-pointer transition-all flex items-center gap-3'
          onClick={() => onSelectedOption(item.title + ":" + item.people)}
        >
          <span className="text-2xl">{item.Icon}</span>
          <div>
            <h2 className="font-medium">{item.title}</h2>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GroupSizeUi