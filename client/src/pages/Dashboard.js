import "../index.css";
import Post from "../components/Post";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { logout, useAuth } from "../controller/Firebase";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { createPost, getPosts, placeholder } from "../controller/QueryService";
import {
  IconLogout,
  IconExplore,
  IconDocs,
  IconProfile,
} from "../icons/NavIcons";
import IconHome from "../icons/home";
import { lightbox, PDFviewer } from "../components/PDFviewer";
import ViewSDKClient from "../controller/ViewSDKClient";
import { useDropzone } from "react-dropzone";

export default function Dashboard() {
  const [data, setData] = useState(placeholder);
  const currentUser = useAuth();
  console.log(currentUser);

  useEffect(() => {
    (async () => {
      const { data } = await getPosts();
      console.log(data);
      setData(data);
    })();
  }, []);

  return (
    <div className="flex min-h-screen justify-center divide-x">
      <NavTab currentUser={currentUser} active="dash" />
      <div className="flex flex-col items-center divide-y xl:w-1/2 flex-grow xl:flex-grow-0 bg-gray-50">
        <Stories storyposts={data.slice(0, 5)} />
        <PostCreator currentUser={currentUser} />
        <h1 className="font-bold text-gray-500 text-3xl text-left pt-10 w-full px-3">
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
        spaces={[
          "distributedsystems",
          "illustrations",
          "streetwear",
          "fitness",
        ]}
      />
    </div>
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
  borderWidth: 2,
  borderColor: "#a5b4fc",
  borderStyle: "dashed",
  transition: "border .24s ease-in-out",
};

function PostCreator({ currentUser }) {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [url, setUrl] = useState();
  const pfpIcon = currentUser?.photoURL;
  const [show, setShow] = useState(false);
  
  const onDrop = useCallback(acceptedFiles => {
    setUrl(acceptedFiles.at(-1)?.path)
  }, []);

  const {
    getRootProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ accept: "application/pdf", onDrop });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    createPost(
      {
        ...currentUser,
        id: currentUser?.uid,
      },
      title,
      description,
      url
    );
    console.log(title);
  };

  function handleReveal(e) {
    e.preventDefault();
    if (!show) {
      setShow(true);
    }
  }


  return (
    <div className="w-full h-40 mb-2">
      {!show ? (
        <div
          onClick={handleReveal}
          className="w-full h-40 flex rounded-b-xl bg-gradient-to-tr from-red-300 to-indigo-500 p-3 mb-6 cursor-pointer hover:from-indigo-400 animate-gradient-y transition-all"
        >
          <div className={"self-end w-1/3 text-3xl text-white font-semibold"}>
            Hi, {currentUser?.displayName}. ✋ <br />{" "}
            <p className="font-light"> Share your docs here. </p>
          </div>
        </div>
      ) : (
        <div className="bg-indigo-100 p-2 mb-3 rounded-b-xl">
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
                className="py-1 bg-transparent text-lg focus:outline-none"
                placeholder="Post Title"
                value={title}
                onInput={(event) => setTitle(event.target.value)}
                spellCheck="false"
              ></input>
              <textarea
                className="py-1 bg-transparent text-sm focus:outline-none resize-none"
                placeholder="Description"
                value={description}
                onInput={(event) => setDescription(event.target.value)}
                spellCheck="false"
              ></textarea>
              <input
                className="py-1 bg-transparent text-sm focus:outline-none text-gray-500"
                placeholder="Document URL or drag your file here"
                value={url}
                onInput={(event) => setUrl(event.target.value)}
                spellCheck="false"
              ></input>
            </div>
            <button
              onClick={handleSubmit}
              className="bg-gray-50 px-5 py-2 rounded-full self-end mt-auto hover:bg-gray-100"
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

function Stories({ storyposts }) {
  const sdk = new ViewSDKClient();
  return (
    <div className="w-full p-4">
      <ul className="flex justify-around">
        {storyposts.map((item, i) => (
          <li key={i} className="flex flex-col justify-center items-center">
            <div
              className="bg-gradient-to-tr from-red-300 to-indigo-700 rounded-full p-1 block cursor-pointer animate-gradient-xy"
              onClick={() => lightbox(sdk, item.url, item.title)}
            >
              <img
                src={item.user.photoURL}
                className="rounded-full w-20 h-20 object-cover"
                alt="pfp_st"
              />
            </div>
            <p className="text-sm text-gray-700">{item.user.displayName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NavTab({ currentUser, active }) {
  const navigate = useNavigate();

  async function handleLogout(e) {
    e.preventDefault();

    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  function NavLink({ path, children }) {
    return (
      <Link
        to={`/${path === "profile" ? path + `/${currentUser?.uid}` : path}`}
      >
        <button
          className={`dashboard-nav__btn ${
            active === path ? "bg-indigo-100 text-indigo-400" : ""
          }`}
        >
          {children}
          <span>{path}</span>
        </button>
      </Link>
    );
  }

  return (
    <div className="sticky h-screen top-0 md:flex flex-col hidden">
      <div className="w-72 h-24 border rounded-lg m-4 ml-auto flex p-3 bg-gray-50">
        <div className="w-16 h-16 rounded-full shadow-md overflow-visible">
          <img
            className="w-full h-full object-cover rounded-full"
            src={currentUser?.photoURL}
            alt="pfp_icon"
          />
        </div>
        <div className="ml-2">
          <p>
            {new Date().toLocaleTimeString("en-GB", {
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
          <p className="font-semibold text-sm">{currentUser?.displayName}</p>
          <p className="font-light text-sm">{currentUser?.email}</p>
        </div>
      </div>
      <div className="flex flex-col items-end mx-4 mb-auto">
        <div className="flex flex-col w-72 text-left text-gray-600 text-xl">
          <NavLink path="dash">
            <IconHome />
          </NavLink>
          <NavLink path="spaces">
            <IconExplore />
          </NavLink>
          <NavLink path="docs">
            <IconDocs />
          </NavLink>
          <NavLink path="profile">
            <IconProfile />
          </NavLink>
          <button onClick={handleLogout} className="dashboard-nav__btn">
            <IconLogout />
            <span>logout</span>
          </button>
        </div>
      </div>
      <div className="m-4 font-semibold text-3xl ml-auto mt-auto">Murdoc.</div>
    </div>
  );
}

export function SpacesTab({ spaces }) {
  return (
    <div className="sticky top-0 min-h-screen h-full hidden xl:block">
      <div className="w-80 h-96 rounded-lg border m-4 py-6 right-20 bg-gray-50">
        <h1 className="text-xl font-semibold mb-4 pl-6">Spaces for you</h1>
        <div className="font-semibold divide-y">
          {spaces.map((space, i) => (
            <Link to={`/spaces/${space}`} key={i}>
              <div className="py-3 px-6 hover:bg-gray-200 cursor-pointer">
                <p>#{space}</p>
                <p className="font-light text-sm">4124 Docs in this Space</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
