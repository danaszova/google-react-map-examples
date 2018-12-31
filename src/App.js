import React, { Component } from "react";
import "./App.css";

import MapWithSearch from "./maps/MapWithSearch";
import MapPolygonDrawing from "./maps/MapPolygonDrawing";

class App extends Component {
  state = {
    mapCase: 2,
  };

  render() {
    let component = null;
    switch (this.state.mapCase) {
      case 1:
        component = (
          <div className="App">
            <h3>Map with Google Places Search Box</h3>
            <MapWithSearch
              currentLocation={{ latitude: "51.048615", longitude: "-114.070847" }}
              locations={[]}
            />
          </div>
        );
        break;
      case 2:
        component = (
          <div className="App">
            <h3>Map with Basic Polygon Drawing</h3>
            <MapPolygonDrawing
              currentLocation={{ latitude: "51.048615", longitude: "-114.070847" }}
              locations={[]}
            />
          </div>
        );
        break;
      default:
        component = (
          <div className="App">
            <h3>Map with Basic Polygon Drawing</h3>
            <MapPolygonDrawing
              currentLocation={{ latitude: "51.048615", longitude: "-114.070847" }}
              locations={[]}
            />
          </div>
        );
    }

    console.log(process.env);
    return (
      <div>
        <div className="App">
          <button
            onClick={() => {
              this.setState({
                mapCase: 1,
              });
            }}
          >
            Places Search
          </button>
          <button
            onClick={() => {
              this.setState({
                mapCase: 2,
              });
            }}
          >
            Polygon Drawing Basic
          </button>
        </div>
        {component}
      </div>
    );
  }
}

export default App;
