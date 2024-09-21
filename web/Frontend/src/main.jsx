import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Layout } from "../Layout.jsx";
import Home from "./Pages/Home/Home.jsx";
import Status from "./Pages/Status/Status.jsx";
import Contact from "./Pages/Contact/Contact.jsx";
import About from "./Pages/About/About.jsx";
import Support from "./Pages/Support/Support.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="Status" element={<Status />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/About" element={<About/>}/>
      <Route path="/Support" element={<Support/>}/>
    </Route>
  )
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
