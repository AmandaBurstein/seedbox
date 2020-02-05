import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";

class UnconnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      securityKey: ""
    };
  }

  securityKeyGenerator = length => {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.setState({ securityKey: result });
    console.log("this.state.securityKey:", this.state.securityKey);
    return;
  };

  handleUsernameChange = event => {
    console.log("new username", event.target.value);
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = event => {
    console.log("new password", event.target.value);
    this.setState({ password: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    console.log("login form submitted");
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    let response = await fetch("/login", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (!body.success) {
      alert("Invalid username or password");
    }
    if (body.success) {
      this.props.dispatch({
        type: "login-success"
      });
      this.securityKeyGenerator(25);
      this.props.dispatch({
        type: "security-key",
        value: this.state.securityKey
      });
      let newData = new FormData();
      newData.append("username", this.state.username);
      newData.append("key", this.props.securityKey);
      let newResponse = await fetch("/add-key", {
        method: "POST",
        body: newData
      });
      let keyResponse = await newResponse.text();
      let newBody = JSON.parse(keyResponse);
      console.log(newBody.success);
      this.props.history.push("/secured-homepage");
      console.log("this.props.securityKey:", this.props.securityKey);
    }
    return;
  };

  render = () => {
    return (
      <div>
        <h1>Login </h1>
        <form onSubmit={this.handleSubmit}>
          <div>Username</div>
          <input type="text" onChange={this.handleUsernameChange} />
          <div></div>
          <div>Password</div>
          <input type="password" onChange={this.handlePasswordChange} />
          <input type="submit" value="Login" />
        </form>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return { loggedIn: state.loggedIn, securityKey: state.securityKey };
};

let Login = connect(mapStateToProps)(UnconnectedLogin);

export default withRouter(Login);
