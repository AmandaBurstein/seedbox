import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

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
    return;
  };

  handleUsernameChange = event => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
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
      JSON.parse(keyResponse);
      this.props.history.push("/secured-homepage");
    }
    return;
  };

  render() {
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
  }
}

let mapStateToProps = state => {
  return { loggedIn: state.loggedIn, securityKey: state.securityKey };
};

let Login = connect(mapStateToProps)(UnconnectedLogin);

export default withRouter(Login);
