import "../index.css";
import Post from "../components/Post";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../controller/QueryService";
import { lightbox, PDFviewer } from "../components/PDFviewer";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../controller/Firebase";
import { NavTab } from "../components/NavTab";
import ViewSDKClient from "../controller/ViewSDKClient";
import { Img } from "react-image";
import anonIcon from "../img/img_258083.png";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [data, setData] = useState(api.placeholder);
  const { currentUser } = useAuth();

  useEffect(() => {
    (async () => {
      const session = window.sessionStorage.getItem("POST_CACHE");
      if (session) {
        setData(JSON.parse(session));
      } else {
        const res = await api.getPosts();
        window.sessionStorage.setItem("POST_CACHE", JSON.stringify(res));
        setData(res);
      }
    })();
  }, []);

  const [revealLoader, setRevealLoader] = useState(false);

  return (
    <>
      <div className="bg-black w-full h-2">
        {revealLoader && (
          <div className="h-full bg-gradient-to-r to-red-300 from-indigo-500 animate-progress" />
        )}
      </div>
      <div className="flex min-h-screen justify-between divide-x">
        <NavTab currentUser={currentUser} data={data.slice(0, 6)} />
        <div className="flex flex-col items-center divide-y xl:w-1/2 flex-grow xl:flex-grow-0 bg-gray-50">
          <PostCreator currentUser={currentUser} setRevealLoader={setRevealLoader}/>
          <h1
            className="font-bold text-gray-500 text-3xl text-left pt-10 pb-5 w-full px-3"
          >
            Posts
          </h1>
          {data.map((post, i) => (
            <Post key={post.id} data={post} currentUser={currentUser}>
              <PDFviewer
                idn={i}
                file={post.url}
                title={post.title}
                embedMode="SIZED_CONTAINER"
              />
            </Post>
          ))}
        </div>
        <SpacesTab
          data={data.slice(0, 3)}
        />
      </div>
    </>
  );
}

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#be185d",
};

const baseStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  borderRadius: "0.75em",
  padding: "0.75rem",
  borderWidth: 4,
  borderColor: "#a5b4fc",
  borderStyle: "dashed",
  transition: "border .24s ease-in-out",
};

function PostCreator({ currentUser, setRevealLoader }) {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [url, setURL] = useState();
  const [urlStatus, setURLStatus] = useState();
  const [category, setCategory] = useState();
  const pfpIcon = currentUser?.photoURL;
  const [show, setShow] = useState(false);
  
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles.at(-1);
      setURLStatus("Uploading...");
      setRevealLoader(true);
      uploadFile(file).then((downloadURL) => {
        setURL(downloadURL);
        setURLStatus("File uploaded.");
      })
    }
  }, [setRevealLoader]);

  const { getRootProps, isDragActive, isDragAccept, isDragReject } =
    useDropzone({ accept: "application/pdf", onDrop });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  console.log(url);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let completed_flag = false;
    [title, description, url, category].forEach((item) => {
      if (/^ *$/.test(item)) {
        completed_flag = true;
      }
    });

    if (urlStatus !== "Uploading..." && !completed_flag) {
      api.createPost(
        { ...currentUser, id: currentUser?.uid },
        title,
        description,
        category,
        url
      );
      console.log(title);

      window.sessionStorage.clear();
      window.location.reload();
    }
  };

  function handleReveal(e) {
    e.preventDefault();
    if (!show) {
      setShow(true);
    }
  }

  return (
    <div className="w-full h-52 mb-2">
      {!show ? (
        <div
          onClick={handleReveal}
          className="w-full h-52 flex rounded-b-xl bg-gradient-to-tr from-red-300 to-indigo-500 p-3 mb-6 cursor-pointer hover:from-indigo-400 animate-gradient-y transition-all shadow-xl"
        >
          <div className={"self-end w-1/3 text-3xl text-white font-semibold"}>
            Hi, {currentUser?.displayName}. <br />{" "}
            <p className="font-light"> Share your docs here. </p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-2 mb-3 rounded-b-xl">
          <div {...getRootProps({ style })}>
            <div className="w-20">
              <div className="w-16 h-16 mt-2 rounded-full">
                <img
                  className="w-full h-full object-cover rounded-full block shadow-lg"
                  src={pfpIcon}
                  alt="pfp_icon"
                />
              </div>
            </div>
            <form className="w-full h-full flex">
              <div className="flex flex-col w-full">
                <input
                  className="py-1 bg-transparent text-sm w-1/3 focus:outline-none text-gray-500"
                  placeholder="Drag your file here"
                  value={urlStatus}
                  onInput={(event) => setURLStatus(event.target.value)}
                  spellCheck="false"
                  disabled={true}
                ></input>
                <input
                  className="py-1 bg-transparent text-lg focus:outline-none"
                  placeholder="Post Title"
                  value={title}
                  onInput={(event) => setTitle(event.target.value)}
                  spellCheck="false"
                ></input>
                  <input
                    className="py-1 bg-transparent text-sm focus:outline-none"
                    placeholder="Space"
                    value={category}
                    onInput={(event) => setCategory(event.target.value)}
                    spellCheck="false"
                  ></input>
                <textarea
                  className="py-1 bg-transparent text-sm focus:outline-none resize-none"
                  placeholder="Description"
                  value={description}
                  onInput={(event) => setDescription(event.target.value)}
                  spellCheck="false"
                ></textarea>
              </div>
              <button
                onClick={handleSubmit}
                className="bg-gray-100 px-8 py-2 rounded-full self-end mt-auto hover:bg-gray-200"
              >
                <span>Send.</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function SpacesTab({ data }) {
  const [spaces, setSpaces] = useState({});

  useEffect(() => {
    (async () => {
      // const session = sessionStorage.getItem('SPACES_DATA');
      const session = false;
      if(session) {
        setSpaces(session);
      } else {
        const spacesData = await api.getSpaces();
        setSpaces(spacesData);
        sessionStorage.setItem('SPACES_DATA', JSON.stringify(spacesData));
      }
    })();
  }, []);

  return (
    <div
      className="sticky top-0 bg-white hidden xl:block flex-1 z-0"
      style={{ height: "94vh" }}
    >
      <div className="w-80 rounded-lg border m-4 py-6 bg-gray-50">
        <h1 className="text-xl font-semibold mb-4 pl-6">Spaces for you</h1>
        <div className="font-semibold divide-y">
          {Object.keys(spaces).slice(0, 5).map((space, i) => (
            <Link to={`/spaces/${space}`} key={i}>
              <div className="py-3 px-6 hover:bg-gray-200 cursor-pointer">
                <p>{space}</p>
                <p className="font-light text-sm"> {spaces[space]} Docs in this Space</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {data && (
        <div className="w-80 rounded-lg border m-4 py-6 bg-gray-50">
          <h1 className="text-xl font-semibold mb-4 pl-6">
            Highlights by Users
          </h1>
          <div className="flex justify-center">
            <Stories data={data} />
          </div>
        </div>
      )}
    </div>
  );
}

function Stories({ data }) {
  const storyposts = data.slice(0, 3);
  const sdk = new ViewSDKClient();
  return (
    <div className="w-72">
      <ul className="flex flex-wrap justify-around">
        {storyposts.map((item, i) => (
          <li key={i} className="flex flex-col justify-center items-center">
            <div
              className="bg-gradient-to-tr from-red-300 to-indigo-700 rounded-full p-1 m-1 block cursor-pointer animate-gradient-xy"
              onClick={() => lightbox(sdk, item.url, item.title)}
            >
              <Img
                src={[item.user?.photoURL, anonIcon]}
                className="rounded-full w-16 h-16 object-cover"
                alt="pfp_st"
              />
            </div>
            <Link to={`/profile/${item.user.id}`}>
              <p className="text-sm text-gray-700 font-light">
                {item.user.displayName}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
