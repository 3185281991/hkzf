import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
//导入antd-design样式
import "antd-mobile/bundle/style.css";
import "react-virtualized/styles.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
