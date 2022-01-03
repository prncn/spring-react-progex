import React, { createRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PDFviewer } from "../components/post";
import { useAuth } from "../controller/Firebase";
import { getPosts } from "../controller/QueryService";
import { NavTab } from "./Dashboard";

export default function Explore() {
  const auth = useAuth();
  const params = useParams();
  const spaces = [
    "illustration",
    "statistics",
    "streetwear",
    "slow jazz",
    "neural networks",
    "machine learning",
    "object oriented programming",
    "social sciences",
    "philosophy",
    "taxation",
    "volatility",
    "investments",
    "culture",
    "slow jazz",
    "illustration",
    "statistics",
    "streetwear",
    "slow jazz",
  ];
  const colors = ["green", "indigo", "blue", "yellow"];
  let color = colors[Math.floor(Math.random() * colors.length)];
  const [data, setData] = useState([]);

  function rand() {
    if (Math.floor(Math.random() * 10) < 2) {
      return 2;
    }
    return 1;
  }

  useEffect(() => {
    (async () => {
      const postsData = await getPosts();
      setData(postsData.data);
    })();
  }, []);

  return (
    <div className="flex min-h-screen">
      <NavTab currentUser={auth} active="spaces" />
      <div className="bg-gray-100 w-full">
        {"spaceId" in params ? (
          <div className="p-5">
            <h1 className="text-4xl font-semibold text-gray-500">
              {params.spaceId}
            </h1>
            <div className="mt-5 flex flex-wrap">
              {data.map((post, i) => (
                <Link to={`/view?id=${post.id}`} state={post} key={i}>
                  <div className="h-80 w-56 m-2 overflow-hidden relative">
                    <PDFviewer
                      idn={i}
                      file={post.url}
                      title={post.title}
                      embedMode="SIZED_CONTAINER"
                      height="80"
                      className="overflow-hidden"
                    />
                    <div className="bg-black w-full h-full absolute top-0 left-0 hover:opacity-30 opacity-0 transition rounded-lg" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-6 grid-rows-4 gap-4 p-10 overflow-auto">
            {spaces.map((name) => (
              <Link to={`/spaces/${encodeURIComponent(name)}`}>
                <div
                  className={`h-40 col-span-${rand()} row-span-1 bg-post-img hover:bg-${color}-400 bg-${color}-300 rounded-lg font-semibold text-2xl text-white p-4 cursor-pointer`}
                >
                  {name}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
