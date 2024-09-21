import { MdError } from "react-icons/md";
export default function About() {
  return (
    <div className="flex flex-col justify-center items-center h-100 font-bold">
      <MdError style={{ width: "30px", height: "30px" }} />
      <h1>Oops! Page not found.</h1>
      <p>The About page you are looking for is under Development</p>
    </div>
  );
}
