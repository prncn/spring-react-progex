import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { NavTab } from "../components/NavTab";
import { PDFviewer } from "../components/PDFviewer";
import { useAuth } from "../controller/Firebase";
import api from "../controller/QueryService";

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
  const colors = ["green", "indigo", "blue"];
  let color = colors[Math.floor(Math.random() * colors.length)];
  const [data, setData] = useState([]);

  function rand() {
    if (Math.floor(Math.random() * 10) < 2) {
      return 2;
    }
    return 1;
  }

  useEffect(() => {
    if ("spaceId" in params) {
      (async () => {
        const postsData = await api.getPosts();
        setData(postsData);
      })();
    }
  }, [params]);

  return (
    <div className="flex min-h-screen">
      <NavTab currentUser={auth} active="spaces" />
      <div className="bg-gray-100 w-full">
        {"spaceId" in params ? (
          <div className="p-1">
            <h1 className="ml-1 mt-10 text-lg font-semibold">
              {params.spaceId}
            </h1>
            <p className="ml-1 font-light">{data?.length} documents</p>
            <div className="flex flex-wrap mt-5">
              {data.map((post, i) => (
                <Link to={`/view?id=${post.id}`} state={post} key={i}>
                  <div className="h-60 w-44 m-1 overflow-hidden relative bg-red-400">
                    <PDFviewer
                      idn={i}
                      file={post.url}
                      title={post.title}
                      embedMode="SIZED_CONTAINER"
                      height="60"
                      className="overflow-hidden"
                      scroll={false}
                      rounded={false}
                    />
                    <div className="bg-black w-full h-full absolute top-0 left-0 hover:opacity-30 opacity-0 transition" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap p-2">
            {spaces.map((name, i) => (
              <Link to={`/spaces/${encodeURIComponent(name)}`} key={i}>
                <div
                  className={`overflow-hidden h-40 w-${
                    40 * rand()
                  } m-1 bg-post-img hover:bg-${color}-400 bg-${color}-300 rounded-lg font-semibold text-2xl text-white p-4 cursor-pointer`}
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
