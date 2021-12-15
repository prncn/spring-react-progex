import React, { useCallback, useState } from 'react';
import { PDFviewer } from '../components/post';
import { useAuth } from '../controller/Firebase';
import { IconFolder } from '../icons/FileIcons';
import { NavTab } from './Dashboard';

export default function Docs() {
  const auth = useAuth();
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
          url: 'https://www.nga.gov/content/dam/ngaweb/Education/learning-resources/an-eye-for-art/AnEyeforArt-RembrandtVanRijn.pdf'
        }
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
      items: []
    }
  ];

  const defaultUrl = "https://imma.ie/wp-content/uploads/2018/10/whatisconceptualart.pdf"
  const [activeDoc, setActiveDoc] = useState(defaultUrl);
  const getName = (name, url) => {
    setActiveDoc(url);
  }

  const data = {
    name: 'main',
    items: fileList,
  };

  function RecursiveDrawFolder({ name, items, pass, url }) {
    const [showChildren, setShowChildren] = useState(false);

    const handleClick = useCallback(() => {
      setShowChildren(!showChildren);
      if(!items) {
        pass(name, url);
      }
    }, [name, pass, items, showChildren, setShowChildren, url]);

    return (
      <div className="text-white space-y-4 flex flex-col">
        <button onClick={handleClick} className="grow h-10 text-left flex hover:bg-gray-700 rounded-lg items-center p-2 space-x-2">
          {items && <IconFolder fill={items.length}/>}
          <span>{name}</span>
        </button>
        <div className="relative flex flex-col left-4 border-l border-gray-500 px-4 transition">
          {showChildren && (items ?? []).map((item) => (
            <RecursiveDrawFolder {...item} pass={pass}/>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <NavTab currentUser={auth} active="docs" />
      <div className="bg-gray-800 w-full flex">
        <div className="w-1/2 xl:w-1/3 h-full p-10">
          <div className="h-full w-full rounded-lg border border-white p-4">
            <RecursiveDrawFolder {...data} pass={getName} />
          </div>
        </div>
        <div className="h-full w-auto">
        <div className="flex flex-col text-white justify-center items-center w-full h-full grow space-y-4">
          <PDFviewer file={activeDoc} title={'someting'}/>
          <p>{activeDoc}</p>
        </div>
        </div>
      </div>
    </div>
  );
}
