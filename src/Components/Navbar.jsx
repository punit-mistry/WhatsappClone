import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className=" p-3 bg-green-500 text-white font-bold flex justify-between items-center">
      <div>
        <img
          src="https://o.remove.bg/downloads/6981a2bb-dbb9-463b-b553-fbc76508af7d/png-transparent-whatsapp-logo-computer-icons-whatsapp-whatsapp-text-android-symbol-thumbnail-removebg-preview.png"
          className="w-16"
        />
      </div>
      <div className="flex gap-5">
        <div>
          <Link to="/qrcode"> Messages </Link>
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
