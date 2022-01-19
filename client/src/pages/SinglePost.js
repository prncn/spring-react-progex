import "../index.css";
import Post, { timeDifference } from "../components/Post";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useSearchParams } from "react-router-dom";
import { IconDotMenu, IconHeart, IconTrash } from "../icons/PostIcons";
import { PDFviewer } from "../components/PDFviewer";
import Highlighter from "react-highlight-words";
import { NavTab } from "../components/NavTab";
import { SpacesTab } from "./Dashboard";
import api from "../controller/QueryService";
import { confirmAlert } from "react-confirm-alert";

// const commentPlaceholder = [
//   {
//     id: "1",
//     user: {
//       id: "2",
//       displayName: "Erykah",
//       photoURL: "https://i.imgur.com/Ks2oou4.jpg",
//     },
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id augue rutrum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id augue rutrum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id augue rutrum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id augue rutrum1",
//     date: {
//       seconds: 1638807536,
//       nanos: 782000000,
//     },
//   },
//   {
//     id: "2",
//     user: {
//       id: "3",
//       displayName: "Grace",
//       photoURL: "https://i.imgur.com/NDFE7BQ.jpg",
//     },
//     content: "Checkout out this thing I found on page 6 by clicking on it.",
//     date: {
//       seconds: 1638807536,
//       nanos: 782000000,
//     },
//   },
// ];

export default function SinglePost() {
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const postId = searchParams.get("id");

  const post = useLocation().state;
  const [paginator, setPaginator] = useState();
  const [commentData, setCommentData] = useState([]);

  useEffect(() => {
    (async () => {
      const postData = await api.getPostById(postId);
      setCommentData(postData.data.comments);
    })();
  }, [postId]);

  return (
    <div className="flex min-h-screen justify-center divide-x">
      <NavTab currentUser={currentUser} active="dash" />
      <div className="flex flex-col items-center divide-y xl:w-1/2 flex-grow xl:flex-grow-0 bg-gray-50">
        <h1 className="font-bold text-gray-500 text-3xl text-left pt-5 w-full px-3">
          View
        </h1>
        <Post key={post.id} data={post} currentUser={currentUser}>
          <PDFviewer
            file={post.url}
            title={post.title}
            setPaginator={setPaginator}
            embedMode="SIZED_CONTAINER"
          />
        </Post>
        <div className="p-3 w-full space-y-2">
          <CommmentCreator />
          {commentData.map((comment, i) => (
            <Comment
              key={i}
              data={comment}
              paginator={paginator}
              currentUser={currentUser}
              postId={post.id}
            />
          ))}
        </div>
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

  function CommmentCreator() {
    const commentRef = useRef();

    function handleSubmit(event) {
      event.preventDefault();
      if ("current" in commentRef && currentUser) {
        api.createComment(
          post.id,
          { id: currentUser.uid },
          commentRef.current.value
        );
        setCommentData(post?.comments);
      }
    }

    return (
      <div className="flex p-3 rounded-lg text-white bg-black">
        <div className="w-16 h-16 mt-2 rounded-full shadow-lg flex-shrink-0">
          <img
            className="w-full h-full object-cover rounded-full shadow-lg"
            src={currentUser?.photoURL}
            alt={currentUser?.displayName}
          />
        </div>
        <div className="w-full flex flex-col p-2 text-sm">
          <div className="font-semibold">me</div>
          <form className="w-full flex">
            <textarea
              className="appearance-none bg-transparent w-full mr-3 py-3 leading-tight focus:outline-none"
              type="text"
              placeholder="Speak you mind..."
              autoFocus={true}
              spellCheck="false"
              ref={commentRef}
            />
            <button
              className="self-end rounded-full h-2/3 py-2 px-5 bg-gray-50 hover:bg-gray-100 text-black"
              onClick={handleSubmit}
            >
              Send.
            </button>
          </form>
        </div>
      </div>
    );
  }
}

function Comment({ data, paginator, currentUser, postId }) {
  const [liked, setLiked] = useState(false);

  function paginate(content) {
    const strip = content.replace(/[^0-9]+/g, "");

    return paginator.ready().then(() => {
      paginator.goToPage(Number(strip));
    });
  }

  function Highlight({ children }) {
    return (
      <div
        onClick={() => paginate(children)}
        className="text-indigo-400 hover:underline cursor-pointer inline-block"
      >
        {children}
      </div>
    );
  }

  function handleDelete() {
    confirmAlert({
      title: "Confirm to submit",
      message: "Really delete this comment?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            api.deleteComment(postId, data.id)
            window.location.reload();
          },
        },
        {
          label: "No",
        },
      ],
    });
  }

  function toggleLiked() {
    setLiked(!liked);
  }

  console.log(data.user.id === currentUser?.uid);

  return (
    <div className="flex p-3 rounded-lg hover:bg-gray-200">
      <div className="w-16 h-16 mt-2 rounded-full shadow-lg flex-shrink-0">
        <img
          className="w-full h-full object-cover rounded-full block shadow-lg"
          src={data.user.photoURL}
          alt={data.user.displayName}
        />
      </div>
      <div className="w-full flex flex-col p-2 text-sm">
        <div className="font-semibold mb-1">
          {data.user.displayName + " "}
          &#183;{" "}
          <div className="font-light inline">{timeDifference(data.date)}</div>
        </div>
        <div className="mb-2">
          <Highlighter
            highlightTag={Highlight}
            searchWords={[/page\s[0-9]+/g]}
            textToHighlight={data.description}
          />
        </div>
      </div>
      <div className="flex items-center">
        {data.user.id === currentUser?.uid ? (
          <button className="rounded-full hover:bg-gray-300 p-3" onClick={handleDelete}>
            <IconDotMenu />
          </button>
        ) : (
          <button className="rounded-full hover:bg-gray-300 p-3" onClick={toggleLiked}>
            <IconHeart />
          </button>
        )}
      </div>
    </div>
  );
}
