import React from 'react';
import { NavTab } from './Dashboard';

export default function Explore() {
  const spaces = [
    'illustration',
    'statistics',
    'streetwear',
    'slow jazz',
    'illustration',
    'statistics',
    'streetwear',
    'slow jazz',
    'illustration',
    'statistics',
    'streetwear',
    'slow jazz',
    'streetwear',
    'slow jazz',
    'illustration',
    'statistics',
    'streetwear',
    'slow jazz',
  ];
  const colors = ['green', 'indigo', 'blue', 'yellow'];
  let color = colors[Math.floor(Math.random() * colors.length)];
  
  function rand() {
    if (Math.floor(Math.random() * 10) < 2) {
      return 2;
    }
    return 1;
  }

  let seed = rand()
  
  return (
    <div className="flex min-h-screen">
      <NavTab />
      <div className="bg-gray-800 w-full">
      <div className="grid grid-cols-6 grid-rows-4 gap-4 p-10 bg-gray-800 overflow-auto">
        {spaces.map((name) => (
          <div
            className={`h-40 col-span-${rand()} row-span-1 bg-post-img hover:bg-${color}-400 bg-${color}-300 rounded-lg font-semibold text-2xl text-white p-4 cursor-pointer`}
          >
            {name}
          </div>
        ))}
      </div>
      </div>

    </div>
  );
}
