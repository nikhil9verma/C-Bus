import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Drawer from "./components/Drawer";
import Bus1 from "./components/Bus1";
import Bus2 from "./components/Bus2";
import Bus3 from "./components/Bus3";

const Layout = ({ children, isDrawerOpen, toggleDrawer }) => (
  <div className="flex">
    <Drawer drawer={isDrawerOpen} />
    <div className="flex-1  min-h-screen">
      <Navbar drawer={isDrawerOpen} toggle={toggleDrawer} />
      {children}
    </div>
  </div>
);

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer}>
          <Home />
        </Layout>
      ),
    },
    {
      path: "/Bus1",
      element: (
        <Layout isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer}>
          <Bus1 />
        </Layout>
      ),
    },
    {
      path: "/Bus2",
      element: (
        <Layout isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer}>
          <Bus2 />
        </Layout>
      ),
    },
    {
      path: "/Bus3",
      element: (
        <Layout isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer}>
          <Bus3 />
        </Layout>
      ),
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
