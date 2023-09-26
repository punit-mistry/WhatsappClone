import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import * as XLSX from "xlsx";
const SendMessage = () => {
  const [Data, setData] = useState({
    Number: [],
    Message: "",
  });
  const [excelDataInput, setExcelDataInput] = useState("");
  const [ShowExcel, setShowExcel] = useState(false);
  const [PreviewMessage, setPreviewMessage] = useState([]);
  const [ResponseData, setResponseData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // To store the selected file
  const [ExcelFile, setExcelFile] = useState([]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const FileData = [];
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Assuming you have one sheet
        const sheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        // Now, excelData contains your Excel data as an array of arrays
        FileData.push(excelData);
        setExcelFile(FileData);
        console.log(excelData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const HandelChange = () => {
    // Split each element in Data.Number and wrap it in a sub-array
    const Numbers = Data.Number.map((Res) => Res);

    let data = JSON.stringify({
      clientName: sessionStorage.getItem("clientName"),
      message: Data.Message,
      DriverNumbers: Numbers[0],
    });

    console.log(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://0b8a-203-122-54-18.ngrok-free.app/send-message",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        if (response.status === 200) {
          setResponseData(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ExcelResponseSend = () => {
    // Extract headers from the first row of ExcelFile
    const headers = ExcelFile[0][0].map((header) => header.trim()); // Remove extra spaces

    // Initialize an array to store replaced rows
    const replacedRows = [];

    // Iterate through ExcelFile rows (starting from the second row)
    for (let rowIndex = 1; rowIndex < ExcelFile[0].length; rowIndex++) {
      const rowData = ExcelFile[0][rowIndex];

      // Create an object to store "Number" and "Message" values for each row
      const rowValues = {
        Number: rowData[0],
        Message: excelDataInput, // Initialize Message value with the template
      };

      // Iterate through headers (excluding the "Number" header) and replace placeholders with values
      for (let colIndex = 1; colIndex < headers.length; colIndex++) {
        const placeholder = `{{${headers[colIndex]}}}`;
        const value = rowData[colIndex];
        rowValues.Message = rowValues.Message.replace(
          new RegExp(placeholder, "g"),
          value
        );
      }

      replacedRows.push(rowValues);
    }

    // Log the replaced rows
    replacedRows.forEach((row) => {
      console.log(row);
    });
    setPreviewMessage(replacedRows);
  };

  const SendmessageAll = () => {
    const Data = PreviewMessage.map((res) => ({
      clientName: sessionStorage.getItem("clientName"),
      message: res.Message,
      DriverNumbers: [String(res.Number)],
    }));

    Data.forEach((res) => {
      const data = JSON.stringify({
        message: res.message,
        DriverNumbers: res.DriverNumbers, // Access the number to send the message to
      });

      console.log(data);

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://0b8a-203-122-54-18.ngrok-free.app/send-message",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          if (response.status === 200) {
            setResponseData(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const SendMessageSingle = (res) => {
    const Data = {
      clientName: sessionStorage.getItem("clientName"),
      message: res.Message,
      DriverNumbers: [String(res.Number)],
    };

    const data = JSON.stringify(Data);

    console.log(data);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://0b8a-203-122-54-18.ngrok-free.app/send-message",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        if (response.status === 200) {
          setResponseData(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="flex gap-5 p-5 bg-black text-white">
        <button onClick={() => setShowExcel(false)}>BoardCast Message</button>
        <button onClick={() => setShowExcel(true)}>Upload Excel</button>
      </div>

      {ShowExcel ? (
        <div className="flex flex-col gap-5">
          <div className="p-5">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />

            <button
              className="bg-blue-500 p-2 font-bold text-white w-52 rounded-lg"
              onClick={handleUpload}
            >
              Upload and Read Excel
            </button>
          </div>

          {ExcelFile.length > 0 ? (
            <>
              <div className="flex">
                <div className="w-1/2">
                  <div className="m-5 flex items-center gap-10">
                    <div className="flex flex-col">
                      <label>
                        {" "}
                        {`Eg. :-  hii {{a}} when will you {{b}} please {{c}} ...`}
                      </label>
                      <textarea
                        className="border-2 border-black rounded-lg w-52 p-3"
                        placeholder="Enter the Format "
                        onChange={(e) => setExcelDataInput(e.target.value)}
                      />
                    </div>
                    <button
                      className="bg-blue-500 p-2 font-bold text-white w-52 rounded-lg"
                      onClick={ExcelResponseSend}
                    >
                      Show Preview
                    </button>
                  </div>

                  <table className="m-5 w-full ">
                    {ExcelFile.map((res) => {
                      return (
                        <tr className="h-10">
                          {res[0].map((cellHeader) => (
                            <th className="border border-black">
                              {cellHeader}
                            </th>
                          ))}
                        </tr>
                      );
                    })}
                    {ExcelFile[0]
                      .filter((res) => /^\d{12}$/.test(res[0]))
                      .map((res, rowIndex) => (
                        <tr
                          className="h-14 text-center"
                          key={rowIndex}
                        >
                          {res.map((cell, cellIndex) => (
                            <td
                              className="border border-black"
                              key={cellIndex}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </table>
                </div>

                <div className="w-1/2 p-10 flex flex-col gap-10">
                  <button
                    className="bg-red-500 p-2 font-bold text-white w-52 rounded-lg"
                    onClick={SendmessageAll}
                  >
                    {" "}
                    Send All
                  </button>
                  <div className="flex gap-10">
                    {PreviewMessage.map((res) => (
                      <div
                        className="bg-amber-50 w-80 h-96 rounded-lg flex flex-col  justify-between gap-5"
                        key={res.id}
                      >
                        <div className="flex flex-col gap-3">
                          <div className="h-16 bg-gray-300 flex items-center gap-5">
                            <div className="bg-green-600 w-10 flex items-center justify-center text-3xl h-10 ml-5 text-white rounded-full">
                              A
                            </div>
                            <span className="font-bold">+{res.Number}</span>
                          </div>
                          <div className="bg-green-500 w-fit h-10 flex items-center p-2 rounded-full  rounded-bl-none ml-3">
                            {res.Message}
                          </div>
                        </div>
                        <div className="flex items-center justify-center h-20">
                          <button
                            className="bg-green-500 w-32 text-white font-bold h-10 rounded-lg "
                            onClick={() => SendMessageSingle(res)}
                          >
                            {" "}
                            send
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            "No Excel Found !!"
          )}
        </div>
      ) : (
        <>
          <div className="flex gap-5 m-5 items-center ">
            <div className="flex flex-col h-[7.7vh]">
              <label className="text-xs">
                Eg. (918286075880,918286075881,918286075882)
              </label>
              <input
                type="text"
                placeholder="Enter The Number you want to send !! (Enter the Number With the +91)"
                className="border border-black h-10 w-[30vw] p-3"
                onChange={(e) => {
                  const numbers = [e.target.value.split(",")];
                  setData({ ...Data, Number: numbers });
                }}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter your Message "
                className="border border-black h-10 w-[30vw] p-3"
                onChange={(e) => setData({ ...Data, Message: e.target.value })}
              />
            </div>
            <button
              className="bg-blue-500 p-2 font-bold text-white w-32 rounded-lg"
              onClick={HandelChange}
            >
              {" "}
              Send{" "}
            </button>
          </div>

          {ResponseData.length > 0 ? (
            <div className="p-5 flex flex-col gap-5">
              <span className="font-bold text-3xl">Status :- </span>
              <table className="w-[70vw] text-center ">
                <tr className="h-10">
                  <th className="border border-black">Number</th>
                  <th className="border border-black">Status</th>
                </tr>
                {ResponseData.map((res) => {
                  return (
                    <tr className="h-14 ">
                      <td className="border border-black">{res.number}</td>
                      <td className="border border-black">{res.status}</td>
                    </tr>
                  );
                })}
              </table>
            </div>
          ) : (
            "No Response"
          )}
        </>
      )}
    </>
  );
};

export default SendMessage;
