import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Drawer from "./components/Drawer";
import Bus17 from "./components/Bus17";
import Bus25 from "./components/Bus25";
import Bus35 from "./components/Bus35";

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
      path: "/Bus17",
      element: (
        <Layout isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer}>
          <Bus17 />
        </Layout>
      ),
    },
    {
      path: "/Bus25",
      element: (
        <Layout isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer}>
          <Bus25 />
        </Layout>
      ),
    },
    {
      path: "/Bus35",
      element: (
        <Layout isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer}>
          <Bus35 />
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
