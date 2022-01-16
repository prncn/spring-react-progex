import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../controller/Firebase";
import { IconDocs, IconExplore, IconHome, IconLogout, IconProfile } from "../icons/NavIcons";
import anonIcon from "../img/img_258083.png";
import { Img } from "react-image";
import { useEffect, useState } from "react";

export function NavTab({ currentUser }) {
    const navigate = useNavigate();
    const [typeDark, setTypeDark] = useState('text-black');
  
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
  
    function NavLinkBtn({ path, children }) {
      return (
        <NavLink
          to={`/${path === "profile" ? path + `/${currentUser?.uid}` : path}`}
          className={({ isActive }) => isActive ? "bg-black text-white rounded shadow-xl" : ""}
        >
          <button
            className={`dashboard-nav__btn`}
          >
            {children}
            <span>{path}</span>
          </button>
        </NavLink>
      );
    }

    useEffect(() => {
      window.onscroll = () =>
        window.pageYOffset === 0 ? setTypeDark('text-black') : setTypeDark('text-white');
  
      return () => (window.onscroll = null);
    });
  
    return (
      <div className="sticky top-0 md:flex flex-col hidden bg-white" style={{ height: '94vh' }}>
        <div className="w-72 h-24 border rounded-lg m-4 ml-auto flex p-3 bg-gray-50">
          <div className="w-16 h-16 rounded-full shadow-md overflow-visible">
            <Img
              className="w-full h-full object-cover rounded-full"
              src={[currentUser?.photoURL, anonIcon]}
              alt="pfp_icon"
            />
          </div>
          <div className="ml-2 text-sm">
            <p>
              {new Date().toLocaleTimeString("en-GB", {
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
            <p className="font-semibold">{currentUser?.displayName}</p>
            <p className="font-light">{currentUser?.email}</p>
          </div>
        </div>
        <div className="flex flex-col items-end mx-4 mb-auto">
          <div className="flex flex-col w-72 text-left text-gray-600 text-xl">
            <NavLinkBtn path="dash">
              <IconHome />
            </NavLinkBtn>
            <NavLinkBtn path="spaces">
              <IconExplore />
            </NavLinkBtn>
            <NavLinkBtn path="docs">
              <IconDocs />
            </NavLinkBtn>
            <NavLinkBtn path="profile">
              <IconProfile />
            </NavLinkBtn>
            <button onClick={handleLogout} className="dashboard-nav__btn">
              <IconLogout />
              <span>logout</span>
            </button>
          </div>
        </div>
        <div className={`absolute -bottom-10 right-5 font-semibold text-3xl ${typeDark}`}>Murdoc.</div>
      </div>
    );
  }

  