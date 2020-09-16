import React, { Component, createRef } from "react";
// import logo from "./logo.svg";
import "./App.css";
// import { render } from "@testing-library/react";
import "bootstrap/dist/css/bootstrap.min.css";

let tempCity;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      city: null,
      country: null,
      weather: null,
      description: null,
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

    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?lon=${longtitude}&lat=${latitude}&appid=${apikey}&units=metric`;
    }

    let response = await fetch(url);
    let data = await response.json();
    console.log("data", data);
    this.setState({ ...this.state, weather: data });
  };

  // why setState on change?
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
    this.getWeather(0,0,tempCity);
  }

  componentDidMount() {
    this.getLocation();
  }

  render() {
    if (!this.state.weather) return <div>Loading</div>;
    return (
      <>
        <div className="container">
          <div className="wrapper">
            <form className="input-form" onSubmit={(e) => this.handleSubmit(e)}>
              <input
                className="city-input"
                type="text"
                placeholder="Search a city"
                onChange={(e) => this.onChangeSave(e)}
              />
              <input className="city-submit" type="submit" value="Search" />
              <h2 className="mt-5">{this.state.weather.name}</h2>
              <div className="info">
                {/* run following code only when state.weather is not null */}

                <h1>{this.state.weather && this.state.weather.main.temp}ºC</h1>
                <h5>
                  Humidity
                  {this.state.weather && this.state.weather.main.humidity}
                </h5>
                <div className="max-min-temp">
                  <h5>
                    Min temp{" "}
                    <p>
                      {this.state.weather && this.state.weather.main.temp_min}
                    </p>
                  </h5>
                  <h5>
                    Max temp{" "}
                    <p>
                      {this.state.weather && this.state.weather.main.temp_max}
                    </p>
                  </h5>
                </div>
                <h3>
                  {this.state.weather &&
                    this.state.weather.weather[0].description}
                </h3>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}
