import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PDFviewer } from '../components/PDFviewer';
import api from '../controller/QueryService';
import { IconFolder, IconPlus } from '../icons/FileIcons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { NavTab } from '../components/NavTab';
import { useAuth } from '../context/AuthContext';

export default function Docs() {
  let fileList = useMemo(
    () => ({
      id: 'f4f97a43-2725-4a50-a90b-feab448ad6c5',
      name: 'main',
      items: [
        {
          id: '4889a371-8129-4c7a-a76d-53d70f07645d',
          name: 'parent one',
          items: [
            {
              id: 'b46ced9b-7459-4bb5-b202-676465a90010',
              name: 'ones child one',
              items: [],
            },
            {
              id: '2d877662-bced-49bb-aa9a-900ca1de02e4',
              name: 'ones child two',
              items: [],
            },
            {
              id: 'ae0246a6-df55-44b1-926c-bebaa53b640b',
              name: 'Rembrandt Symposium',
              url: 'https://www.nga.gov/content/dam/ngaweb/Education/learning-resources/an-eye-for-art/AnEyeforArt-RembrandtVanRijn.pdf',
            },
          ],
        },
        {
          id: 'f2cd8ff1-3e1e-42d8-b876-b45829a33e49',
          name: 'parent three',
          items: [],
        },
      ],
    }),
    []
  );

  const { currentUser } = useAuth();
  const [activeDoc, setActiveDoc] = useState();
  const [fileSystem, setFileSystem] = useState(fileList);
  const [isFetching, setIsFetching] = useState(true);

  const getName = (name, url) => {
    setActiveDoc(url);
  };

  function spliceFileSystem(folderId, folder) {
    for (let i = 0; i < folder.length; i++) {
      const item = folder[i];
      if (item.id === folderId) {
        folder.splice(i, 1);
        setFileSystem(fileSystem);
        console.log(item);
        return item;
      }
    }

    for (const item of folder) {
      if ('items' in item) {
        return spliceFileSystem(folderId, item.items);
      }
    }
  }

  function pushFileSystem(folderId, folder, newItem) {
    for (let i = 0; i < folder.length; i++) {
      const item = folder[i];
      if (item.id === folderId) {
        console.log(newItem);
        item.items.push(newItem);
        setFileSystem(fileSystem);
        return;
      }
    }

    for (const item of folder) {
      if ('items' in item) {
        pushFileSystem(folderId, item.items, newItem);
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (currentUser !== undefined) {
        const [user, response] = await api.getUserById(currentUser?.uid);
        if (response) {
          const fetchedPosts = { ...fileList };
          for (const id of user.savedPosts) {
            const { data } = await api.getPostById(id);
            fetchedPosts.items.push({
              name: data.title,
              url: data.url,
            });
          }
          setFileSystem(fetchedPosts);
          setIsFetching(false);
        }
      }
    })();
  }, [currentUser, fileList]);

  function RecursiveDrawFolder({
    id,
    name,
    items,
    pass,
    url,
    counter,
    provided,
    innerRef,
  }) {
    const [showChildren, setShowChildren] = useState(true);
    const [hovered, setHovered] = useState(false);

    const handleClick = useCallback(() => {
      if (!items) {
        pass(name, url);
        return;
      }
      setShowChildren(!showChildren);
    }, [items, name, pass, showChildren, url]);

    function addFolder() {
      items.push({ id: crypto.randomUUID(), name: 'new folder', items: [] });
    }

    if (items) {
      counter = counter + 1;
    }

    return (
      <div
        className="text-white flex flex-col space-y-2"
        {...provided?.draggableProps}
        {...provided?.dragHandleProps}
        ref={innerRef}
      >
        <div
          className="flex w-full h-10"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <button
            onDoubleClick={handleClick}
            className={`flex-grow w-2/3 text-left flex bg-gray-900 hover:bg-gray-800 ${
              items
                ? 'rounded-l-lg'
                : 'rounded-lg bg-indigo-800 hover:bg-indigo-700'
            } items-center p-2`}
          >
            {items && <IconFolder fill={items.length} />}
            <span className="ml-2">{name}</span>
          </button>
          {items && (
            <button
              onClick={addFolder}
              className={`hover:bg-gray-800 rounded-r px-2 h-full flex items-center justify-center ${
                hovered ? 'visible' : 'invisible'
              }`}
            >
              <IconPlus />
            </button>
          )}
        </div>

        <div className="relative flex flex-col left-4 px-4 transition">
          {showChildren &&
            (items ?? []).map((item, i, items) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={i + counter + (items.at(i - 1)?.items?.length || 0)}
              >
                {(provided) => (
                  <RecursiveDrawFolder
                    {...item}
                    pass={pass}
                    counter={counter + i}
                    provided={provided}
                    innerRef={provided.innerRef}
                  />
                )}
              </Draggable>
            ))}
        </div>
      </div>
    );
  }

  function onDragEnd(result) {
    if (!result.destination) {
      console.log(result);
    }

    if (result.combine) {
      let file = spliceFileSystem(result.draggableId, fileSystem.items);
      console.log(file);
      pushFileSystem(result.combine.draggableId, fileSystem.items, file);
    }
  }

  return (
    <div className="flex min-h-screen">
      <NavTab currentUser={currentUser} active="docs" />
      <div className="bg-gray-900 w-full flex p-10">
        <div className="w-1/2 xl:w-1/3 h-full mr-10">
          {isFetching ? (
            <div className="text-white p-10 flex space-x-3">
              <span>Loading...</span>
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="docsDND" isCombineEnabled>
                {(provided) => (
                  <div
                    className="h-full w-full rounded-lg border border-white p-4"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <RecursiveDrawFolder
                      {...fileSystem}
                      pass={getName}
                      counter={0}
                    />
                    {/* {Array.from(["red", "indigo", "blue", "green"]).map(
                    (item, i) => (
                      <Draggable key={item} index={i} draggableId={item}>
                        {(provided) => (
                          <div
                            className={`bg-${item}-300 w-full h-20 rounded my-1`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    )
                  )} */}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
        <div className="h-full flex-1">
          <div className="flex flex-col text-white w-full h-full grow space-y-4">
            {activeDoc && (
              <PDFviewer
                file={activeDoc}
                title={'Selected document'}
                height="full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
