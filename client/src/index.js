import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // ✅ AJOUTER ÇA
import App from "./App";
import store from "./JS/redux/store";
import "./index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>   {/* ✅ AJOUTER ÇA */}
      <App />
    </BrowserRouter>
  </Provider>
);