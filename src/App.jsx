import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import Whatsapp from "./Components/Whatsapp";
const App = () => {
  const [QrData, setQrData] = useState("");

  const FetchQrCode = async () => {
    try {
      const response = await axios.get("http://localhost:3000/qrcode");
      if (response.data.qrCodeData) {
        setQrData(response.data.qrCodeData);
      } else {
        setQrData("Set Qr Code");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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
          <Whatsapp />
        </div>
      )}
      ,
    </div>
  );
};

export default App;
