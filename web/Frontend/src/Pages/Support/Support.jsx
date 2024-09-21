import { MdError } from "react-icons/md";
export default function Support() {
  return (
    <div className="flex flex-col justify-center items-center h-100 font-bold">
      <MdError style={{ width: "30px", height: "30px" }} />
      <h1>Oops! Page not found.</h1>
      <p>The Support page you are looking for is under Development</p>
    </div>
  );
}
