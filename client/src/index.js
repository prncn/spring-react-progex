import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import store from "./Store";
import { Provider } from "react-redux";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App classname="overflow-visible"/>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);