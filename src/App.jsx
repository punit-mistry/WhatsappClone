import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FirstPage from "./Pages/FirstPage";
import SendMessage from "./Components/SendMessage";
import { LoginPage } from "./Pages/LoginPage";

// Custom private route component
const PrivateRoute = ({ element }) => {
  // Check if the user is logged in
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    // If logged in, allow access to the specified route
    return element;
  } else {
    // If not logged in, redirect to the root ("/") route
    return <Navigate to="/" />;
  }
};

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<LoginPage />}
        />
        <Route
          path="/sendmessage"
          element={<PrivateRoute element={<SendMessage />} />}
        />
        <Route
          path="/qrcode"
          element={<PrivateRoute element={<FirstPage />} />}
        />
      </Routes>
    </div>
  );
};

export default App;
