import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../controller/Firebase";
import ViewSDKClient from "../controller/ViewSDKClient";
import { IconDocs, IconExplore, IconHome, IconLogout, IconProfile } from "../icons/NavIcons";
import { lightbox } from "./PDFviewer";

export function NavTab({ currentUser, data }) {
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
  
    function NavLinkBtn({ path, children }) {
      return (
        <NavLink
          to={`/${path === "profile" ? path + `/${currentUser?.uid}` : path}`}
          className={({ isActive }) => isActive && "bg-indigo-100 text-indigo-400 rounded-lg"}
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
        {/* <Stories data={data}/> */}
        <div className="m-4 font-semibold text-3xl ml-auto mt-auto">Murdoc.</div>
      </div>
    );
  }

  function Stories({ data }) {
    const storyposts = data.slice(0, 6);
    const sdk = new ViewSDKClient();
    return (
      <div className="w-72">
        <ul className="flex flex-wrap">
          {storyposts.map((item, i) => (
            <li key={i} className="flex flex-col justify-center items-center">
              <div
                className="bg-gradient-to-tr from-red-300 to-indigo-700 rounded-full p-1 m-1 block cursor-pointer animate-gradient-xy"
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