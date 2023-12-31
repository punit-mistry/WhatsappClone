import React, { useState, useEffect } from "react";
import axios from "axios";
import Message from "./Message";
import { useNavigate } from "react-router-dom";
const Whatsapp = () => {
  const Nav = useNavigate();
  const [AllHistory, setAllHistory] = useState([]);
  const [Chats, setChats] = useState([]);
  const [ChatName, setChatName] = useState({ name: "", number: "" });
  const [ShowChats, setShowChats] = useState(false);

  const FetchAll = async () => {
    try {
      const Response = await axios.get(
        `http://localhost:3000/chat/history?clientName=${sessionStorage.getItem(
          "clientName"
        )}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (Response.data.length > 0) {
        setAllHistory(Response.data);
      } else {
        Nav("/qrcode");
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    FetchAll();
  }, []);

  const CallChats = async (a, name) => {
    setChatName({ name: name, number: a });
    const response = await axios.get(
<<<<<<< HEAD
      `http://localhost:3000/chat/messages/${sessionStorage.getItem(
=======
      `https://3a45-203-122-54-18.ngrok-free.app/chat/messages/${sessionStorage.getItem(
>>>>>>> 4af6b89e35a5947efb3f65056edd084cec786911
        "clientName"
      )}/${a}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    console.log(response.data, name);
    setChats(response.data);
    setShowChats(true);
  };

  return (
    <>
      <div className="bg-green-900 text-white flex">
        <div className="flex flex-col min-w-[18vw] max-h-[100vh] overflow-scroll overflow-x-hidden ">
          {AllHistory.length > 0 &&
            AllHistory.map((res, key) => {
              return (
                <button
                  className="h-16 border-b-2 w-[20vw] font-bold p-2 hover:bg-green-500  transition-all flex gap-5 items-center"
                  onClick={() => CallChats(res.number._serialized, res.chatId)}
                  key={key} // Add a unique key for each button
                >
                  <span className=" w-10 h-10 bg-gray-600 flex justify-center items-center rounded-full text-white">
                    {res?.chatId?.substring(0, 1) || "null"}
                  </span>
                  {res.chatId}
                  <br />
                </button>
              );
            })}
        </div>
        {ShowChats && (
          <Message
            Data={Chats}
            Name={ChatName}
          />
        )}{" "}
        {/* Pass Chats as Data prop */}
        {!ShowChats && (
          <div className="h-[100vh] w-[100vw] flex flex-col gap-10 justify-center items-center">
            <img
              src="https://imgs.search.brave.com/CtZAnKvw24PF9N1hJcjHImd6s70z8qYgvWZoWb_PqkM/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDgx/MTYxNTMyL3Bob3Rv/L3doYXRzYXBwLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1j/Q2pIbXNNS2dwQ2FU/anpndFEwU1hNVm9X/ZEp1X2xZWXh3Zmcx/aVhkVnZzPQ"
              width={500}
              height={500}
            />
            <span className="text-3xl font-thin">
              Download What chat for Windows
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Whatsapp;
