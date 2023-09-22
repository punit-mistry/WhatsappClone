import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import Whatsapp from "../Components/Whatsapp";
import Navbar from "../Components/Navbar";
const FirstPage = () => {
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
            value={
              "2@L1IiBykovNwCHBz3rgJ/PVYph0ByWsa+QWnSZzP3BtN2oUHhPAiDaRUSM5yh9N8UqEydflTDFSlKrQ==,a2gyw247em1g97R/BwNOJhajhmkCFfapZUfI7fZCISo=,zuXChC+t/ECSFwBieVTaQpZ6fLCAdvrxpquQ57JTdRw=,FDg93k0D3VdVh8a+1X1QvP6Y2qsD2pV989/DyGeuFpY=,1"
            }
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
