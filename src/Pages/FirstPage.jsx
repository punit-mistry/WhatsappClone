import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

import Whatsapp from "../Components/Whatsapp";
import Navbar from "../Components/Navbar";
const FirstPage = () => {
  const [QrData, setQrData] = useState("");
  const [ClientName, setClientName] = useState("");
  const FetchQrCode = async () => {
    try {
      let data = JSON.stringify({
        clientName: sessionStorage.getItem("clientName"),
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://0919-203-122-54-18.ngrok-free.app/qrcode",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          if (response.data.qrCodeData) {
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
    setInterval(() => {
      FetchQrCode();
    }, 60000);
    FetchQrCode();
  }, []);

  return (
    <div>
      {" "}
      {QrData != "Set Qr Code" && (
        <div className="flex justify-center items-center h-[100vh]">
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
