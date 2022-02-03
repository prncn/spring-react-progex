import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavTab } from '../components/NavTab';

import api from '../controller/QueryService';
import { useAuth } from '../context/AuthContext';
import { IconRight } from '../icons/FileIcons';
import { updateMessages } from '../controller/Firebase';

class Message {
  constructor(text, to) {
    this.text = text;
    this.to = to;
    this.at = Date.now();
  }
}

export default function Messages() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [msgList, setMsgList] = useState([]);
  const [input, setInput] = useState([]);
  const [recip, setRecip] = useState();
  const inputRef = useRef();

  useEffect(() => {
    (async () => {
      const usersData = await api.getUserList();
      console.log(usersData);
      setUsers(usersData);
    })();
  }, []);

  useEffect(() => {
    setRecip(users?.at(0));
  }, [users]);

  const buildMessages = useCallback(() => {
    function dateCompare(a, b) {
      return a.at < b.at ? -1 : a.at > b.at ? 1 : 0;
    }

    for (const user of users) {
      if (user.id === currentUser?.uid) {
        const myMessages = user.messages.filter((msg) => msg.to === recip?.id);
        const theirMessages = recip?.messages.filter(
          (msg) => msg.to === currentUser?.uid
        );
        const concatMsg = myMessages.concat(theirMessages);
        return concatMsg.sort(dateCompare);
      }
    }
  }, [currentUser, users, recip]);

  function dateCompare(a, b) {
    return a.at > b.at ? 1 : -1;
  }

  const buildMessagesOther = useCallback(
    (other) => {
      for (const user of users) {
        if (user.id === currentUser?.uid) {
          const myMessages = user.messages.filter(
            (msg) => msg.to === other?.id
          );
          const theirMessages = other?.messages.filter(
            (msg) => msg.to === currentUser?.uid
          );
          const concatMsg = myMessages.concat(theirMessages);
          return concatMsg.sort(dateCompare);
        }
      }
    },
    [currentUser, users]
  );

  useEffect(() => {
    setMsgList(buildMessages);
  }, [buildMessages]);

  function submitMsg(event) {
    event.preventDefault();
    inputRef.current.focus();
    const newMsg = new Message(input, recip.id);
    const currentMsgList = [...msgList, { ...newMsg }];
    if (!/^ *$/.test(input)) {
      setMsgList(currentMsgList);
      setInput('');
    }
    updateMessages({ ...newMsg });
  }

  function switchRecip(user) {
    setRecip(user);
    setMsgList(buildMessages());
  }

  return (
    <div className="flex min-h-screen">
      <NavTab currentUser={currentUser} active="messages" />
      <div className="bg-white w-full flex">
        <div className="bg-gray-50 h-full w-96 divide-y">
          <div className="text-3xl font-semibold m-5">Messages</div>
          {users
            .filter((user) => user.id !== currentUser?.uid)
            .sort(dateCompare)
            .map((user) => (
              <UserCard user={user} key={user.id} />
            ))}
        </div>
        <div className="w-1/2 h-full border space-y-2 justify-end flex flex-col relative overflow-y-auto">
          <div className="w-full flex p-4 absolute top-0 left-0">
            <div className="w-16 h-16 rounded-full">
              <img
                className="w-full h-full object-cover rounded-full"
                src={recip?.photoURL}
                alt="pfp_icon"
              />
            </div>
            <div className="px-4">
              <div className="font-medium">{recip?.displayName} </div>
              <div className="font-light">{recip?.email} </div>
            </div>
          </div>

          <div className="p-4 space-y-2 flex flex-col">
            {msgList?.map((msg, i) => (
              <Bubble msg={msg} key={i} />
            ))}
          </div>
          <div className="border-t w-full p-4 flex space-x-2">
            <input
              className="focus:outline-none rounded-full flex-grow py-2 px-4 border"
              spellCheck={false}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              autoFocus={true}
              ref={inputRef}
            />
            <button
              className="bg-black hover:opacity-80 rounded-full w-14 h-14 text-white flex justify-center items-center"
              onClick={submitMsg}
            >
              <IconRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function UserCard({ user }) {
    function trunc(str) {
      const maxLength = 20;
      return `${str.substring(0, maxLength)}${
        str.length > maxLength ? '...' : ''
      }`;
    }

    return (
      <button
        className="w-full flex relative px-4 py-3"
        onClick={() => switchRecip(user)}
      >
        <div className="bg-black h-full w-full opacity-0 hover:opacity-10 absolute top-0 left-0 transition" />
        {buildMessagesOther(user)?.at(-1)?.to === currentUser?.uid && (
          <div className="bg-gradient-to-r from-indigo-400 to-pink-300 animate-gradient-xy rounded-full absolute right-3 top-3 h-2 w-2" />
        )}
        <div className="w-16 h-16 rounded-full">
          <img
            className="w-full h-full object-cover rounded-full"
            src={user?.photoURL}
            alt="pfp_icon"
          />
        </div>
        <div className="px-4 text-left">
          <div className="font-medium">
            {user?.displayName}{' '}
            <div className="font-light text-gray-400 inline-block">
              {trunc(user?.email)}
            </div>
          </div>
          <div className="font-normal text-gray-400 text-sm mt-1">
            {
              user?.messages.filter((msg) => msg.to === currentUser?.uid).at(-1)
                ?.text
            }
          </div>
        </div>
      </button>
    );
  }

  function Bubble({ msg }) {
    function getTime(current) {
      return new Date(current).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }

    return (
      <div
        className={`py-2 mb-1 pl-2 flex items-center max-w-xl rounded ${
          msg?.to !== currentUser?.uid
            ? 'bg-indigo-400 text-white ml-auto'
            : 'bg-gray-50 text-black mr-auto'
        }`}
      >
        <div className="mr-10">{msg?.text}</div>

        <div className="text-xs font-light text-right px-2">
          {getTime(msg?.at)}
        </div>
      </div>
    );
  }
}
