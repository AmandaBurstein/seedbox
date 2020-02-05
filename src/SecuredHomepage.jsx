import React, { Component } from "react";
import { connect } from "react-redux";
// import { Link, Redirect, withRouter } from "react-router-dom";

class UnconnectedSecuredHomepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      access: false,
      servers: []
    };
  }

  componentDidMount = () => {
    if (this.props.loggedIn) {
      history.pushState(null, null, location.href);
      window.onpopstate = function(event) {
        history.go(1);
      };
    }
  };

  verifyKey = async () => {
    let data = new FormData();
    data.append("key", this.props.securityKey);
    let response = await fetch("/verify-key", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (!body.success) {
      alert("An error occurred when attempting to access servers");
    }
    if (body.success) {
      this.setState({ access: true });
      let request = await fetch("/servers", { method: "GET" });
      let servers = await request.text();
      servers = JSON.parse(servers);
      this.setState({ servers: servers });
    }
  };

  addServer = async () => {
    let newId = window.prompt("Enter new Server Id");
    if (newId === null) {
      return;
    }
    let data = new FormData();
    data.append("newId", newId);
    let response = await fetch("/add-server", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (!body.success) {
      alert("An error occurred when adding this server");
    }
    if (body.success) {
      let request = await fetch("/servers", { method: "GET" });
      let servers = await request.text();
      servers = JSON.parse(servers);
      this.setState({ servers: servers });
    }
  };

  deleteServer = async server => {
    let data = new FormData();
    data.append("serverId", server);
    let response = await fetch("/delete-server", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (!body.success) {
      alert("An error occurred when deleting this server");
    }
    if (body.success) {
      let request = await fetch("/servers", { method: "GET" });
      let servers = await request.text();
      servers = JSON.parse(servers);
      this.setState({ servers: servers });
    }
  };

  render() {
    if (this.props.loggedIn && !this.state.access) {
      return <button onClick={this.verifyKey}>View Available Servers</button>;
    }
    if (this.props.loggedIn && this.state.access) {
      return (
        <div>
          <div>Server Inventory:</div>
          <br></br>
          <button onClick={this.addServer}>Add new server</button>
          {this.state.servers.map(server => {
            return (
              <div>
                <div>
                  ServerId: {server.ServerId}
                  <button onClick={() => this.deleteServer(server.ServerId)}>
                    Delete server
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    this.props.history.push("/");
    return null;
  }
}

let mapStateToProps = state => {
  return { loggedIn: state.loggedIn, securityKey: state.securityKey };
};

let SecuredHomepage = connect(mapStateToProps)(UnconnectedSecuredHomepage);

export default SecuredHomepage;
