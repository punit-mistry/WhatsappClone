import React, { useState, useEffect } from "react";
import axios from "axios";

const Message = ({ Data, Name }) => {
  const [Message, setMessage] = useState("");
  const [NewData, setNewData] = useState(Data);

  const SendMessage = async () => {
    const newMessage = {
      content: Message,
      FromMe: true,
    };

    // Use the setMessage function to update the state
    setNewData([...NewData, newMessage]);

    const data = {
      message: Message,
      DriverNumber: Name.number,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/send-message",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setMessage(""); // Clear the input field after sending the message
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setNewData(Data);
  }, [Data]);

  return (
    <div className="ml-1">
      <div className=" p-5 bg-green-100 text-black font-bold flex gap-2 items-center ">
        <div className=" w-10 h-10 bg-gray-600 flex justify-center items-center rounded-full text-white">
          {Name.name.substring(0, 1)}
        </div>
        {Name.name}
      </div>
      <div className="bg-green-950 text-white font-bold w-[75vw] h-[90vh] flex flex-col gap-5 justify-between p-5 overflow-scroll">
        {NewData.map((res, index) => (
          <div
            key={index} // Consider using a unique identifier here, e.g., res.id
            className={`${
              res.FromMe ? "flex justify-end" : "flex justify-start"
            }`}
          >
            <div
              className={`items-center h-full p-3 max-w-52 rounded-xl ${
                res.FromMe
                  ? "rounded-br-none bg-green-400"
                  : "rounded-bl-none bg-slate-500"
              }`}
            >
              {res.content}
            </div>
          </div>
        ))}

        {/* Add a container for the sticky input and button */}
        <div className="sticky top-0 flex gap-5 items-center p-3 bg-green-950">
          <input
            type="text"
            className="w-[80vw] h-10 text-black p-3"
            onChange={(e) => setMessage(e.target.value)}
            value={Message}
          />
          <button onClick={SendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Message;
