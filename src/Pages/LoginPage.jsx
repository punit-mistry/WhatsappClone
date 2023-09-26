import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chat from "../assets/Texting.gif";
export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [Data, setData] = useState({
    userName: "",
    Password: "",
  });

  const handleInputChange = (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Data.userName !== "" && Data.Password !== "") {
      try {
        const Response = await axios.post(
          "https://0b8a-203-122-54-18.ngrok-free.app/login",
          Data
        );

        if (Response.data.Message === "Login successful") {
          sessionStorage.setItem("clientName", Data.userName);
          sessionStorage.setItem("isLoggedIn", true);
          navigate("/qrcode");
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      }
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row   justify-between md:px-20 items-center md:h-screen">
      <span>
        <img
          src={Chat}
          className="md:ml-20"
        />
      </span>
      <form
        onSubmit={handleSubmit}
        className="border border-black md:w-[50vw] h-1/2 p-10 flex flex-col gap-6 items-center justify-between"
      >
        <div className="flex flex-col gap-10">
          <span className="text-5xl font-bold">Login </span>
          <input
            type="text"
            name="userName"
            value={Data.userName}
            onChange={handleInputChange}
            className="border border-black h-10 p-2 rounded-lg md:w-[20vw]"
            placeholder="Enter your Name"
          />
          <input
            type="password"
            name="Password"
            value={Data.Password}
            onChange={handleInputChange}
            className="border border-black h-10 p-2 rounded-lg md:w-[20vw]"
            placeholder="Enter your Password"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 p-3 font-bold rounded-lg w-24"
        >
          Login
        </button>

        {error && (
          <div className="text-red-500 bg-red-200 text-sm p-2 md:p-3 border-red-600 border rounded font-semibold">
            Please Enter Valid UserName & Password !!
          </div>
        )}
      </form>
    </div>
  );
};
