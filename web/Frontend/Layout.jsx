import { Outlet } from "react-router-dom";
import Navbar from "./src/Components/Navbar/Navbar";
import Footer from "./src/Components/Footer/Footer";

export function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
