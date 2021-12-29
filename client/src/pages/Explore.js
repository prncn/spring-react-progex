import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../controller/Firebase';
import { NavTab } from './Dashboard';

export default function Explore() {
  const auth = useAuth();
  const params = useParams();
  const spaces = [
    'illustration',
    'statistics',
    'streetwear',
    'slow jazz',
    'neural networks',
    'machine learning',
    'object oriented programming',
    'social sciences',
    'philosophy',
    'taxation',
    'volatility',
    'investments',
    'culture',
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

  return (
    <div className="flex min-h-screen">
      <NavTab currentUser={auth} active="spaces" />
      <div className="bg-gray-100 w-full">
        {'spaceId' in params ? (
          <div className="p-10">
            <h1 className="text-4xl font-semibold text-gray-500">
              {params.spaceId}
            </h1>
            <div className="mt-5">
              <div className="rounded-lg bg-white h-80 w-52"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-6 grid-rows-4 gap-4 p-10 overflow-auto">
            {spaces.map((name) => (
              <Link to={`/spaces/${encodeURIComponent(name)}`}>
                <div
                  className={`h-40 col-span-${rand()} row-span-1 bg-post-img hover:bg-${color}-400 bg-${color}-300 rounded-lg font-semibold text-2xl text-white p-4 cursor-pointer`}
                >
                  {name}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
