import React from "react";
import axios from "axios";
export const Test = () => {
  const SendData = () => {
    let data = JSON.stringify({
      ADVANCE: "900",
      BALANCE: "100",
      CUSTOMER: "TRuck",
      DATE: "Mon Sep 25 2023 12:49:24 GMT+0530 (India Standard Time)",
      DRIVERNAME: "DAMMAR SINGH BIST",
      DRIVERNO: "8318393949",
      EMAIL: "mailtoakashit@gmail.com",
      FLTTYPE: "32 FT/CONTAINER REGULAR/SA",
      FROM: "Aditya Hospital, Deoria, Deoria, UP, India",
      GPSNO: "apfi254586",
      GPSSTATUS: "Yes",
      HEIGHT: "01",
      LENGTH: "1",
      LOADTYPE: "ODC",
      MOBILENO: "08318393949",
      ORDERBY: "VIEW BY ALL",
      ORDERSTATUS: "Active",
      ROLE: "Admin",
      TO: "Deoria Sadar, Deoria, UP, India",
      TOTALHIRE: "1000",
      TRANSPORTARNAME: "priyesh",
      VEHICLENO: "TEST123",
      VEHICLESTATUS: "GBOPending",
      WEIGHT: "12",
      WIDTH: "10",
      REMARK: "",
    });

    axios
      .post(
        "https://script.google.com/macros/s/AKfycbwPc2mvKb54slYm5KnY44fsrqxQRfNIW93_lYyJ62Z9e2Il3_ewRd58rK9I5IwWz0BZjw/exec?action=addUser",
        data
      )

      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <button onClick={SendData}>Send Data</button>
    </div>
  );
};
