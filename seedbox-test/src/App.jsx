import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./Login.jsx";
import SecuredHomepage from "./SecuredHomepage.jsx";

class App extends Component {
  render = () => {
    return (
      <BrowserRouter>
        <Route
          exact={true}
          path="/"
          render={() => (
            <div>
              <Login />
            </div>
          )}
        />
        <Route path="/secured-homepage" component={SecuredHomepage} />
      </BrowserRouter>
    );
  };
}

export default App;
