import ReactDOM from "react-dom";
import App from "./App.jsx";
import store from "./store.js";
import React from "react";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
