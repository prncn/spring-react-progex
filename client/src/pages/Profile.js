import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../controller/QueryService";
import Post from "../components/Post";
import { prominent } from "color.js";
import { PDFviewer } from "../components/PDFviewer";
import { NavTab } from "../components/NavTab";
import { SpacesTab } from "./Dashboard";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";

export default function Profile() {
  const [postData, setData] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState("Posts");

  const {currentUser, _updateEmail, _updatePassword} = useAuth();
  const [isOpen,setIsOpen] = useState(false)
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const [profilePalette, setProfilePalette] = useState([]);
  console.log(loading);

  const params = useParams();
  useEffect(() => {
    (async () => {
      const [data, response] = await api.getUserById(params.userId);
      console.log(response);
      setUser(data);
    })();
  }, [params]);

  function handleUpdate(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      alert("Passwords do not match");
    }

    setLoading(true);
    const promises = [];

    if (emailRef.current.value !== currentUser.email) {
      promises.push(_updateEmail(currentUser.email));
    }

    if (passwordRef.current.value) {
      promises.push(_updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        alert("Profile could not be updated, try again");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  
  useEffect(() => {
    (async () => {
      const [data, status] = await api.getPostsOfUser(user.id);
      console.log(status);
      setUserPosts(data);
      setData(data);

      if (user?.photoURL !== undefined) {
        const color = await prominent(user.photoURL, {
          amount: 3,
          format: "hex",
          sample: 30,
          group: 30,
        });
        setProfilePalette(color);
      }
    })();
  }, [user]);
  console.log(handleUpdate.name);

  async function switchTab(currentTab) {
    setActiveTab(currentTab);

    switch (currentTab) {
      case "Posts":
        setData(userPosts);
        break;

      case "Liked":
        const likedPostsIds = user.likedPosts;
        let likedPosts = [];
        let validLikedIds = [];
        for (const id of likedPostsIds) {
          const { data } = await api.getPostById(id);
          console.log(data);
          if(data.id !== '5') {
            likedPosts.push(data);
            validLikedIds.push(id);
          }
        }
        if(likedPostsIds.length !== validLikedIds.length) {
          console.log("FIRED");
          api.updateUser(user.id, {likedPosts: validLikedIds});
        }
        setData(likedPosts);
        break;

      case "Saved":
        const savedPostsIds = user.savedPosts;
        let savedPosts = [];
        let validSavedIds = [];
        for (const id of savedPostsIds) {
          const { data } = await api.getPostById(id);
          savedPosts.push(data);
          if(data !== null || data !== undefined) {
            savedPosts.push(data);
            validSavedIds.push(id);
          }
        }
        if(savedPostsIds.length !== validSavedIds.length) {
          api.updateUser(user.id, {savedPosts: validSavedIds});
        }
        setData(savedPosts);
        break;

      default:
        setData(userPosts);
        break;
    }
  }

  return (
    <div className="flex min-h-screen justify-center divide-x">
      <NavTab currentUser={currentUser} active="profile" />
      <div className="flex flex-col items-center xl:w-1/2 flex-grow xl:flex-grow-0 bg-gray-50 relative">
        <div
          className={`w-full h-32 flex justify-end rounded-b-xl p-3 relative bg-cover bg-black animate-gradient-y `}
          style={{
            backgroundImage: `linear-gradient(to bottom left, black,  ${profilePalette[2]})`,
            // animation: 'gradient-xy'
            // backgroundImage: `url(${user?.photoURL})`,
          }}
        >
          {/* {profilePalette.map((color, i) => (
            <div
              className={`h-full w-20 mx-4`}
              key={i}
              style={{ backgroundColor: color }}
            />
          ))} */}
          <div className="w-32 h-32 rounded-full absolute -bottom-10 left-10 border-4 border-gray-50 bg-gray-50" >
            <img
              className="w-full h-full object-cover rounded-full"
              src={user?.photoURL}
              alt="pfp_icon"
            />
          </div>
          <div className="flex flex-col p-5 h-full">
           <div className="text-2xl text-white font-semibold">
              <button onClick={()=> setIsOpen(true)}>
                Update Profile
              </button>
              <Modal open={isOpen} onClose={()=>setIsOpen(false)}/>
            </div>
           </div>
          <div className="flex flex-col p-4 h-full">
            <div className="text-3xl text-white font-semibold">
              {user.displayName}
            </div>
            <div className=" text-white font-light">
              {user.likedPosts?.length} Docs Liked
            </div>
            <div className=" text-white font-light">
              {user.savedPosts?.length} Docs Saved
            </div>
          </div>
          <div className="h-full">
            <div className="py-2 px-6 border border-white rounded-full text-white font-semibold cursor-pointer hover:shadow transition">
              <span className="opactiy-100">Follow</span>
            </div>
          </div>
        </div>
        <div className="flex self-start mt-14 space-x-5 m-3">
          <button onClick={() => switchTab("Posts")}>
            <span
              className={
                `font-bold text-3xl text-left focus:outline-none ` +
                (activeTab === "Posts"
                  ? "text-gray-500"
                  : "text-gray-300 hover:text-gray-400")
              }
            >
              Posts
            </span>
          </button>
          <button onClick={() => switchTab("Liked")}>
            <span
              className={
                `font-bold text-3xl text-left focus:outline-none ` +
                (activeTab === "Liked"
                  ? "text-gray-500"
                  : "text-gray-300 hover:text-gray-400")
              }
            >
              Liked
            </span>
          </button>
          <button onClick={() => switchTab("Saved")}>
            <span
              className={
                `font-bold text-3xl text-left focus:outline-none ` +
                (activeTab === "Saved"
                  ? "text-gray-500"
                  : "text-gray-300 hover:text-gray-400")
              }
            >
              Saved
            </span>
          </button>
        </div>
        {postData.map((post, i) => (
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
