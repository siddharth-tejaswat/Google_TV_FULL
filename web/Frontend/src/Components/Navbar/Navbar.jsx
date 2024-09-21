import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <a href="https://truedatasoft.com/" target="_blank">
            <svg
              className="w-8 h-8 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </a>
          <nav className="hidden md:flex space-x-4">
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                ` ${
                  isActive
                    ? " bg-red-500 text-white animate-pulse"
                    : "bg-gray-200 text-black"
                } px-4 py-2 rounded-lg font-bold `
              }
            >
              LIVE
            </NavLink>
            <NavLink
              to={"/Status"}
              className={({ isActive }) =>
                `pt-2 ${isActive ? "border-b-2 border-orange-500" : ""}`
              }
            >
              Status
            </NavLink>
            <NavLink
              target="_blank"
              to={"https://truedatasoft.com/contact-us/"}
              className={({ isActive }) =>
                `pt-2 ${isActive ? "border-b-2 border-orange-500" : ""}`
              }
            >
              Contact
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <NavLink
            target="_blank"
            to={"https://truedatasoft.com/who-we-are/"}
            className="px-4 py-2 border rounded-md"
          >
            About us
          </NavLink>
          <NavLink
            target="_blank"
            to={"https://truedatasoft.com/contact-us/"}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Support
          </NavLink>
        </div>
      </header>
    </>
  );
}
