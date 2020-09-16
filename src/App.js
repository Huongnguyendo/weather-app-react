import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { render } from "@testing-library/react";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: null,
    };
  }

  getWeather = async () => {
    // apikey hiden in env file
    let apikey = process.env.REACT_APP_APIKEY;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=hanoi&appid=${apikey}&unit=metric`;
    let response = await fetch(url);
    let data = await response.json();
    console.log("data", data);
    this.setState({ weather: data });
  };

  componentDidMount() {
    this.getWeather();
  }

  render() {
    return (
      <>
        {/* run following code only when state.weather is not null */}
        <h1>{this.state.weather && this.state.weather.main.temp} C</h1>
      </>
    );
  }
}
