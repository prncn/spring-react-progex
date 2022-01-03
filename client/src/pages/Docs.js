import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PDFviewer } from "../components/PDFviewer";
import { useAuth } from "../controller/Firebase";
import { getPostById, getUserById } from "../controller/QueryService";
import { IconFolder, IconPlus } from "../icons/FileIcons";
import { NavTab } from "./Dashboard";

const fileList = [
  {
    name: "parent one",
    items: [
      {
        name: "ones child one",
        items: [],
      },
      {
        name: "ones child two",
        items: [],
      },
      {
        name: "Rembrandt Eats My Ass.pdf",
        url: "https://www.nga.gov/content/dam/ngaweb/Education/learning-resources/an-eye-for-art/AnEyeforArt-RembrandtVanRijn.pdf",
      },
    ],
  },
  {
    name: "parent two",
    items: [
      {
        name: "twos child one",
        items: [
          {
            name: "twos child ones child one",
            items: [],
          },
          {
            name: "twos child ones child two",
            items: [],
          },
        ],
      },
    ],
  },
  {
    name: "parent three",
    items: [],
  },
];

export default function Docs() {
  const auth = useAuth();

  const data = useMemo(() => ({ 
    name: "main", 
    items: fileList
  }), []);

  const [activeDoc, setActiveDoc] = useState();
  const [fileSystem, setFileSystem] = useState(data);
  const getName = (name, url) => {
    setActiveDoc(url);
  };

  useEffect(() => {
    (async () => {
      if (auth !== undefined) {
        const [user, response] = await getUserById(auth?.uid);
        console.log(response);
        if ("savedPosts" in user) {
          for (const savedPostId of user.savedPosts) {
            const savedPost = await getPostById(savedPostId);
            console.log(savedPost.data);
            data.items = data.items.concat({
              name: savedPost.data.title,
              url: savedPost.data.url,
            });
          }
          console.log(data);
          setFileSystem(data);
        }
      }
    })();
  }, [auth, data]);

  function RecursiveDrawFolder({ name, items, pass, url, opened = false }) {
    const [showChildren, setShowChildren] = useState(opened);
    const [hovered, setHovered] = useState(false);

    const handleClick = useCallback(() => {
      if (!items) {
        pass(name, url);
        return;
      }
      setShowChildren(!showChildren);
    }, [items, name, pass, showChildren, url]);

    function addFolder() {
      items.push({ name: "new folder", items: [] });
    }

    return (
      <div className="text-white space-y-4 flex flex-col">
        <div
          className="flex w-full h-10"
          onMouseEnter={(e) => setHovered(true)}
          onMouseLeave={(e) => setHovered(false)}
        >
          <button
            onClick={handleClick}
            className={`flex-grow text-left flex hover:bg-gray-800 ${
              items ? "rounded-l-lg" : "rounded-lg"
            } items-center p-2`}
          >
            {items && <IconFolder fill={items.length} />}
            <span className="ml-2">{name}</span>
          </button>
          {items && (
            <button
              onClick={addFolder}
              className={`hover:bg-gray-800 rounded-r px-2 h-full flex items-center justify-center ${
                hovered ? "visible" : "invisible"
              }`}
            >
              <IconPlus />
            </button>
          )}
        </div>
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
      <div className="bg-gray-900 w-full flex p-10">
        <div className="w-1/2 xl:w-1/3 h-full mr-10">
          <div className="h-full w-full rounded-lg border border-white p-4">
            <RecursiveDrawFolder {...fileSystem} pass={getName} />
          </div>
        </div>
        <div className="h-full flex-1">
          <div className="flex flex-col text-white w-full h-full grow space-y-4">
            {activeDoc && (
              <PDFviewer file={activeDoc} title={"Selected document"} height="full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
