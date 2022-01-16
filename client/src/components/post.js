import "../index.css";
import {
  IconComment,
  IconBook,
  IconHeart,
  IconDotMenu,
  IconTrash,
  IconEdit,
} from "../icons/PostIcons";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../controller/QueryService";
import { Img } from "react-image";
import anonIcon from "../img/img_258083.png";

export function timeDifference(previous) {
  previous = previous.seconds / 1000;
  const current = Math.floor(Date.now() / 1000);

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}

export default function Post({ data, currentUser, children }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLiked(await api.checkIfPostLikedByUser(data.id, currentUser?.uid));
      setSaved(await api.checkIfPostSavedByUser(data.id, currentUser?.uid));
    })();
  }, [currentUser?.uid, data.id]);

  const handleClickOutside = (event) => {
    const path = event.path || (event.composedPath && event.composedPath());

    if (!path.includes(menuRef.current)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function toggleLiked(e) {
    e.preventDefault();
    if (!liked) {
      api.likePost(data.id, currentUser?.uid);
    } else {
      api.unlikePost(data.id, currentUser?.uid);
    }
    setLiked(!liked);
  }

  function toggleSaved(e) {
    e.preventDefault();
    if (!saved) {
      api.savePost(data.id, currentUser?.uid);
    } else {
      api.unsavePost(data.id, currentUser?.uid);
    }
    setSaved(!saved);
  }

  function deleteHandler() {
    if (window.confirm("Sure you want to delete this?")) {
      api.deletePost(data.id);
    }
  }

  return (
    <div className="flex w-full border-b pt-2 px-2 mx-4 text-black bg-gray-50 hover:bg-gray-100 transition text-sm">
      <div className="w-20 pl-4 rounded-lg">
        <div className="w-16 h-16 mt-2 rounded-full shadow-lg">
          <Link to={`/profile/${data.user.id}`}>
            <Img
              className="w-full h-full object-cover rounded-full block shadow-lg transition-all"
              src={[data.user.photoURL, anonIcon]}
              alt={data.user.displayName}
            />
          </Link>
        </div>
        <div className="h-2/3">
          <div className="h-full px-2 mt-8 flex flex-col justify-around items-center">
            <button
              className="hover:bg-gray-200 p-4 rounded-full"
              onClick={toggleLiked}
            >
              <IconHeart filled={liked} />
            </button>
            <Link to={`/view?id=${data.id}`} state={data}>
              <button className="hover:bg-gray-200 p-4 rounded-full">
                <IconComment />
              </button>
            </Link>
            <button
              className="hover:bg-gray-200 p-4 rounded-full"
              onClick={toggleSaved}
            >
              <IconBook filled={saved} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center align-center flex-col p-2 w-full">
        <div className={`font-semibold mb-1 w-full flex`}>
          <Link to={`/profile/${data.user.id}`}>{data.user.displayName}</Link>
          <span className="mx-2 font-bold">&#183;</span>
          <div className="font-light">{timeDifference(data.date)}</div>
          {data.user.id === currentUser?.uid && (
            <span
              className="ml-auto text-gray-500 hover:text-gray-800 cursor-pointer relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              ref={menuRef}
            >
              <IconDotMenu />
              <div
                className={`bg-gray-50 rounded-lg w-40 absolute right-0 border top-6 transition overflow-hidden ${
                  isMenuOpen ? "visible" : "invisible"
                }`}
              >
                <div
                  onClick={deleteHandler}
                  className="text-red-400 p-2 flex space-x-2 items-center hover:bg-red-200"
                >
                  <IconTrash />
                  <span>Delete</span>
                </div>
                <div className="text-gray-600 p-2 flex space-x-2 items-center hover:bg-gray-200">
                  <IconEdit />
                  <span>Edit</span>
                </div>
              </div>
            </span>
          )}
        </div>
        <div className="pb-3">{data.description}</div>
        {children}
      </div>
    </div>
  );
}
