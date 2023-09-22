import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className=" p-3 bg-green-500 text-white font-bold flex justify-between items-center">
      <div>Logo</div>
      <div className="flex gap-5">
        <div>
          <Link to="/"> Messages </Link>
        </div>
        <div>
          {" "}
          <Link to="/sendmessage">Send Message</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
