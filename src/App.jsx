import React from "react";
import { Routes, Route } from "react-router-dom";
import FirstPage from "./Pages/FirstPage";
import SendMessage from "./Components/SendMessage";
const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<FirstPage />}
        />
        <Route
          path="/sendmessage"
          element={<SendMessage />}
        />
      </Routes>
    </div>
  );
};

export default App;
