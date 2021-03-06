import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
// import { render } from "@testing-library/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

// for spinner
const override = css`
  display: block;
  margin: 25% auto;
  border-color: red;
`;

let tempCity;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      city: null,
      // country: null,
      weather: null,
      // description: null,
      error: "",
    };
  }

  // get current location of user
  getLocation = () => {
    navigator.geolocation.getCurrentPosition((post) => {
      this.getWeather(post.coords.longitude, post.coords.latitude);
    });
  };

  getWeather = async (longtitude, latitude, city) => {
    // apikey hidden in env file
    let apikey = process.env.REACT_APP_APIKEY;
    // get city value from state
    // let city = this.state.city;
    let url;
    console.log("city", city);

    try {
      if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/weather?lon=${longtitude}&lat=${latitude}&appid=${apikey}&units=metric`;
      }

      let response = await fetch(url);
      let data = await response.json();
      console.log("data", data);
      this.setState({ ...this.state, weather: data });
    } catch (e) {
      alert("Please type in valid city");
      // this.getLocation();
    }
  };

  onChangeSave(e) {
    e.preventDefault();
    tempCity = e.target.value;
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("temp", tempCity);

    this.setState({
      ...this.state,
      city: tempCity,
    });
    console.log("this.state.city", this.state.city);
    // call getWeather again after we got the city
    this.getWeather(0, 0, tempCity);
  }

  componentDidMount() {
    this.getLocation();
  }

  render() {
    if (!this.state.weather)
      return (
        <div className="sweet-loading">
          <ClipLoader
            css={override}
            size={150}
            color={"#purple"}
            loading={this.state.loading}
          />
        </div>
      );
    return (
      <>
        <div className="container">
          <div
            className={`wrapper ${
              this.state.weather.main.temp > 20 ? "warm" : "cold"
            }`}
          >
            <form className="input-form" onSubmit={(e) => this.handleSubmit(e)}>
              <input
                className="city-input"
                type="text"
                placeholder="Search a city"
                onChange={(e) => this.onChangeSave(e)}
                // below func equals onChangeSave func
                // onChange={(event) => {this.setState({...this.state, cityName: event.target.value})}}
              />
              <input className="city-submit" type="submit" value="Search" />
              <h2 className="mt-5">{this.state.weather.name}</h2>
              <div className="info">
                {/* run following code only when state.weather is not null */}

                <h1>{this.state.weather.main.temp}ºC</h1>
                <h5>
                  Humidity
                  <span className="ml-2">
                    {this.state.weather.main.humidity}
                  </span>
                </h5>
                <div className="max-min-temp">
                  <h5>
                    Min temp <p>{this.state.weather.main.temp_min}</p>
                  </h5>
                  <h5>
                    Max temp <p>{this.state.weather.main.temp_max}</p>
                  </h5>
                </div>
                <h3>{this.state.weather.weather[0].description}</h3>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}
