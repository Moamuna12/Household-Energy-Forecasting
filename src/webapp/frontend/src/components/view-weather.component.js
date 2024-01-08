import React, { Component } from "react";
import Card from "./Card.component";
import ls from "local-storage";
import { Alert } from "react-bootstrap";
import "../css/SideNavbar.css";

// appid is the open weather api key, id is the city id
const apiKey = "95e286bae5647877dbb924f3779736a8";
const city = "Marrakech"; // Replace with the desired city name in Morocco
const country = "MA"; // Replace with the country code for Morocco
const weatherURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${apiKey}&units=metric`;

export default class Weather extends Component {
  state = {
    message: "",
    type: "light",
    days: [],
  };

  fetchInfo = () => {
    fetch(weatherURL)
      .then((res) => res.json())
      .then((data) => {
        const dailyData = data.list.filter((reading) =>
          reading.dt_txt.includes("18:00:00")
        );
        this.setState({ days: dailyData, message: "", type: "light" });
      })
      .catch((err) => {
        this.setState({ message: err.message, type: "danger" });
      });
  };

  componentDidMount = () => {
    if (
      ls.get("username") !== this.props.match.params.id ||
      ls.get("userType") !== this.props.match.params.type
    ) {
      ls.clear();
      window.location.href = "/login";
    }
    this.fetchInfo();
  };

  HandleAlert = () => {
    setTimeout(() => {
      this.setState({ message: "", type: "light" });
    }, 10000);
    return (
      <React.Fragment>
        {this.state.message !== "" && (
          <React.Fragment>
            <br />
            <Alert
              key="general"
              variant={this.state.type}
              onClose={() => this.setState({ message: "", type: "light" })}
              dismissible
            >
              {this.state.message}
            </Alert>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  };

  formatCards = () => {
    return this.state.days.map((day, index) => <Card day={day} key={index} />);
  };

  render() {
    return (
      <div align="center" className="container">
        <this.HandleAlert />
        <br />
        <h1 className="display-4" align="center" style={{ marginTop: '50px', marginBottom: '50px', fontFamily: '-moz-initial' }}>5-Day Forecast</h1>
        <h5 className="display-5 text-muted">Marrakesh, Morocco</h5>
        <div className="row justify-content-center">{this.formatCards()}</div>
      </div>
    );
  }
}
