import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./Login.jsx";
import SecuredHomepage from "./SecuredHomepage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Route exact={true} path="/" component={Login} />
      <Route path="/secured-homepage" component={SecuredHomepage} />
    </BrowserRouter>
  );
}
