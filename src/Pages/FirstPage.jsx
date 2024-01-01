import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

import Whatsapp from "../Components/Whatsapp";
import Navbar from "../Components/Navbar";
const FirstPage = () => {
  const [QrData, setQrData] = useState("");
  const [ClientReady, setClientReady] = useState(false);
  const FetchQrCode = async () => {
    try {
      let data = JSON.stringify({
        clientName: sessionStorage.getItem("clientName"),
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/qrcode",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          if (response.data.qrCodeData !== "") {
            console.log("qrcode", response.data.qrCodeData);
            setQrData(response.data.qrCodeData);
          } else {
            setQrData("Set Qr Code");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchQrCode();
  }, []);

  const DeleteFolder = async () => {
    const response = await axios.get("http://localhost:3000/delete");
    console.log(response.data);
  };

  return (
    <div>
      {" "}
      {QrData != "Set Qr Code" && (
        <div className="flex  flex-col gap-10 justify-center items-center h-[100vh]">
          <button
            className="border-2 rounded-lg p-2  font-bold hover:shadow-2xl"
            onClick={DeleteFolder}
          >
            Refresh Data
          </button>
          <QRCodeSVG
            value={QrData}
            size="500"
          />
        </div>
      )}
      {QrData === "Set Qr Code" && (
        <div>
          <Navbar />
          <Whatsapp />
        </div>
      )}
      ,
    </div>
  );
};

export default FirstPage;
