import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [Data, setData] = useState({
    Name: "",
  });

  const Submit = () => {
    sessionStorage.setItem("clientName", Data.Name);
    sessionStorage.setItem("isLoggedIn", true);
    navigate("/qrcode"); // Use the navigate function to navigate to "/qrcode"
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen flex-col gap-10">
        <div className="border border-black w-1/2 h-1/2 p-10 flex flex-col gap-10 items-center justify-center">
          <input
            onChange={(e) => setData({ ...Data, Name: e.target.value })}
            className="border border-black h-10 p-2 rounded-lg w-[20vw] "
            placeholder="Enter your Name"
          />
          <button
            onClick={Submit}
            className="bg-green-500 p-3 font-bold rounded-lg w-24"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
};
