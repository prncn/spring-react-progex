import React, { useCallback, useState } from 'react';
import { PDFviewer } from '../components/post';
import { useAuth } from '../controller/Firebase';
import { IconFolder } from '../icons/FileIcons';
import { NavTab } from './Dashboard';

const fileList = [
  {
    name: 'parent one',
    items: [
      {
        name: 'ones child one',
        items: [],
      },
      {
        name: 'ones child two',
        items: [],
      },
      {
        name: 'Rembrandt Eats My Ass.pdf',
        url: 'https://www.nga.gov/content/dam/ngaweb/Education/learning-resources/an-eye-for-art/AnEyeforArt-RembrandtVanRijn.pdf',
      },
    ],
  },
  {
    name: 'parent two',
    items: [
      {
        name: 'twos child one',
        items: [
          {
            name: 'twos child ones child one',
            items: [],
          },
          {
            name: 'twos child ones child two',
            items: [],
          },
        ],
      },
    ],
  },
  {
    name: 'parent three',
    items: [],
  },
];

export default function Docs() {
  const auth = useAuth();

  const [activeDoc, setActiveDoc] = useState();
  const getName = (name, url) => {
    setActiveDoc(url);
  };

  const data = {
    name: 'main',
    items: fileList,
  };

  function RecursiveDrawFolder({ name, items, pass, url, opened = false }) {
    const [showChildren, setShowChildren] = useState(opened);

    const handleClick = useCallback(() => {
      if (!items) {
        pass(name, url);
        return;
      }
      setShowChildren(!showChildren);
    }, [items, name, pass, showChildren, url]);

    return (
      <div className="text-white space-y-4 flex flex-col">
        <button
          onClick={handleClick}
          className="grow h-10 text-left flex hover:bg-gray-700 rounded-lg items-center p-2 space-x-2"
        >
          {items && <IconFolder fill={items.length} />}
          <span>{name}</span>
        </button>
        <div className="relative flex flex-col left-4 border-gray-500 px-4 transition">
          {showChildren &&
            (items ?? []).map((item) => (
              <RecursiveDrawFolder {...item} pass={pass} />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <NavTab currentUser={auth} active="docs" />
      <div className="bg-gray-800 w-full flex p-10">
        <div className="w-1/2 xl:w-1/3 h-full mr-10">
          <div className="h-full w-full rounded-lg border border-white p-4">
            <RecursiveDrawFolder {...data} pass={getName} />
          </div>
        </div>
        <div className="h-full flex-1">
          <div className="flex flex-col text-white w-full h-full grow space-y-4">
            {activeDoc && (
              <PDFviewer file={activeDoc} title={'someting'} height="full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
