import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import Docs from "./pages/Docs";
import SinglePost from "./pages/SinglePost";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function App() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll, { passive: true });

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  console.log(scrollPosition);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="h-screen bg-white mt-5">
          <Router>
            <Routes>
              <Route path="/dash" element={<Dashboard />} />
              <Route path="/view" element={<SinglePost />} />
              <Route path="/forgot-password" element={<Home form="reset" />} />
              <Route path="/profile" element={<Profile />}>
                <Route path=":userId" element={<Profile />} />
              </Route>
              <Route path="/spaces" element={<Explore />}>
                <Route path=":spaceId" element={<Explore />} />
              </Route>
              <Route path="/docs" element={<Docs />} />
              <Route path="/signup" element={<Home form="signup" />} />
              <Route path="/" element={<Home form="login" />} />
              <Route path="/login" element={<Home form="login" />} />
            </Routes>
          </Router>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}
