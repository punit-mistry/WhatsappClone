import React from "react";
import { Link } from "react-router-dom";
import Img from "../assets/brand.gif";
const Navbar = () => {
  return (
    <div className=" p-3 bg-green-500 text-white font-bold flex justify-between items-center">
      <div>WHAT CHAT</div>
      <div className="flex gap-5">
        <div>
          <Link to="/qrcode"> Messages </Link>
        </div>
        <div>
          {" "}
          <Link to="/sendmessage">Send Message</Link>
        </div>
        <div>
          <button onClick={() => sessionStorage.clear()}>
            <Link to="/">Log Out</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
