import '../index.css';
import {
  IconComment,
  IconBook,
  IconHeart,
  IconDotMenu,
  IconTrash,
  IconEdit,
} from '../icons/PostIcons';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../controller/QueryService';
import { Img } from 'react-image';
import anonIcon from '../img/img_258083.png';
import { deleteFile } from '../controller/Firebase';
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

export function timeDifference(previous) {
  previous = Math.floor(previous.seconds * 1000);
  const current = Math.floor(Date.now());

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    let days = Math.round(elapsed / msPerDay);
    if (days > 1) {
      return days + ' days ago';
    } else {
      return 'yesterday';
    }
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
}

export default function Post({ data, currentUser, children }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [descInputValue, setDescInputValue] = useState(data.description);
  const [editEnabled, setEditEnabled] = useState(false);

  const menuRef = useRef(null);
  const postContainerRef = useRef(null);
  const descInputRef = useRef(null);

  useEffect(() => {
    let mounted = false;
    (async () => {
      if (!mounted) {
        setLiked(await api.checkIfPostLikedByUser(data.id, currentUser?.uid));
        setSaved(await api.checkIfPostSavedByUser(data.id, currentUser?.uid));
      }
    })();
    return () => {
      mounted = true;
    };
  }, [currentUser?.uid, data.id]);

  const handleClickOutside = (event) => {
    const path = event.path || (event.composedPath && event.composedPath());

    if (!path.includes(menuRef.current)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
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
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Really delete this post?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            api.deletePost(data.id, data.category);
            deleteFile(data.url);
            toast.error('Deleted Post', {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 3000,
              theme: 'dark',
            });
            sessionStorage.clear();
            window.location.reload();
          },
        },
        {
          label: 'No',
        },
      ],
    });
  }

  function editHandler(event) {
    setEditEnabled(true);
    postContainerRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
    if (descInputRef.current) {
      console.log(descInputRef.current);
      descInputRef.current.disabled = false;
      descInputRef.current.focus();
    }
    document.body.style.overflow = 'hidden';
  }

  function editHandlerOk() {
    api.editPost({
      id: data.id,
      title: data.title,
      description: descInputValue,
      category: data.category,
    });
    document.body.style.overflow = 'visible';
    setEditEnabled(false);
    toast.success('Edited Post', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
      theme: 'dark',
    });
    window.sessionStorage.clear();
  }

  function editHandlerCancel() {
    document.body.style.overflow = 'visible';
    setEditEnabled(false);
  }

  return (
    <>
      <div
        className={`fixed bg-black opacity-70 transition h-screen w-full top-0 left-0 z-20 ${
          editEnabled ? 'block' : 'hidden'
        }`}
      />
      <div
        className={`flex w-full border-b pt-2 px-2 mx-4 text-black bg-gray-50 hover:bg-gray-100 transition text-sm ${
          editEnabled ? 'z-50' : 'z-10'
        }`}
        ref={postContainerRef}
      >
        <div className="w-20 pl-4 rounded-lg">
          <ToastContainer />
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
            <div className="font-light">{`${timeDifference(data.date)} ${
              data.category ? ' in' : ''
            }`}</div>
            <Link to={`/spaces/${data.category}`}>
              <div className="ml-1 text-indigo-400">{data.category}</div>
            </Link>
            {data.user.id === currentUser?.uid && (
              <div className="flex ml-auto space-x-4">
                {editEnabled && (
                  <>
                    <div
                      className="text-sm text-gray-400 font-medium hover:text-gray-800 cursor-pointer"
                      onClick={editHandlerOk}
                    >
                      ok
                    </div>
                    <div
                      className="text-sm text-gray-400 font-medium hover:text-gray-800 cursor-pointer"
                      onClick={editHandlerCancel}
                    >
                      cancel
                    </div>
                  </>
                )}
                <span
                  className="text-gray-500 hover:text-gray-800 cursor-pointer relative"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  ref={menuRef}
                >
                  <IconDotMenu />
                  <div
                    className={`bg-gray-50 rounded-lg w-40 absolute right-0 border top-6 transition overflow-hidden ${
                      isMenuOpen ? 'visible' : 'invisible'
                    }`}
                  >
                    <div
                      onClick={deleteHandler}
                      className="text-red-400 p-2 flex space-x-2 items-center hover:bg-red-200"
                    >
                      <IconTrash />
                      <span>Delete</span>
                    </div>
                    <div
                      onClick={editHandler}
                      className="text-gray-600 p-2 flex space-x-2 items-center hover:bg-gray-200"
                    >
                      <IconEdit />
                      <span>Edit</span>
                    </div>
                  </div>
                </span>
              </div>
            )}
          </div>
          <input
            className="pb-3 bg-transparent focus:outline-none"
            value={descInputValue}
            disabled={!editEnabled}
            onChange={(event) => setDescInputValue(event.target.value)}
            spellCheck={false}
            ref={descInputRef}
            autoFocus={true}
          />
          {children}
        </div>
      </div>
    </>
  );
}
