import React, { useState, useEffect } from "react";
import axios from "axios";
import Message from "./Message";

const Whatsapp = () => {
  const [AllHistory, setAllHistory] = useState([]);
  const [Chats, setChats] = useState([]);
  const [ChatName, setChatName] = useState({ name: "", number: "" });
  const [ShowChats, setShowChats] = useState(false);

  const FetchAll = async () => {
    try {
      const Response = await axios.get("http://localhost:3000/chat/history");
      setAllHistory(Response.data);
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
      `http://localhost:3000/chat/messages/${a}`
    );
    console.log(response.data, name);
    setChats(response.data);
    setShowChats(true);
  };

  return (
    <div className="bg-green-900 text-white flex">
      <div className="flex flex-col min-w-[18vw] max-h-[100vh] overflow-scroll overflow-x-hidden ">
        {AllHistory.length > 0 &&
          AllHistory.map((res, key) => {
            return (
              <button
                className="h-10  w-80 font-bold p-2 hover:bg-green-500 hover:scale-110 transition-all"
                onClick={() => CallChats(res.number._serialized, res.chatId)}
                key={key} // Add a unique key for each button
              >
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
            Download WhatsApp for Windows
          </span>
        </div>
      )}
    </div>
  );
};

export default Whatsapp;
