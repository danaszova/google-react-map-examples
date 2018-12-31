import React from "react";
import { GoogleApiWrapper } from "google-maps-react";
import googleMapsConfig from "./googlemaps";
import currentLocationIcon from "./assets/currentLocation.png";
import crossHairs from "./assets/crosshairs.png";
import LoadingContainer from "./assets/components/LoadingContainer";

const styles = {
  map: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  input: {
    position: "relative",
    height: "100%",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #1AA89D",
  },
  outerContainer: {
    height: "92vh",
    position: "absolute",
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
  },
  innerContainer: {
    padding: 4,
    backgroundColor: "#fff",
  },
};

class MapPolygonDrawing extends React.Component {
  resetCenter = centerLocation => {
    this.deleteMarkers();
    let map = this.map;
    const { google } = this.props;
    const icon = {
      url: currentLocationIcon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25),
    };

    this.markers.push(
      new google.maps.Marker({
        map: map,
        icon: icon,
        title: "My location",
        position: centerLocation,
      })
    );

    this.map.panTo(centerLocation);
    this.map.setZoom(9);
  };

  createShape = e => {
    const polygonsingle = [];
    for (var i = 0; i < e.overlay.getPath().getLength(); i++) {
      var point = {
        lat: e.overlay
          .getPath()
          .getAt(i)
          .lat(),
        lng: e.overlay
          .getPath()
          .getAt(i)
          .lng(),
      };
      polygonsingle.push(point);
    }

    let newShape = e.overlay;
    newShape.type = e.type;
    console.log("The last polygon drawn", polygonsingle);
  };

  drawMap = () => {
    const { latitude, longitude } = this.props.currentLocation;
    const { google } = this.props;
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    this.currentLocation = new google.maps.LatLng({ lat, lng });
    let currentLocation = this.currentLocation;
    this.markers = [];

    //Set up map

    this.map = new google.maps.Map(this.mapNode, {
      center: {
        lat,
        lng,
      },
      mapTypeId: "roadmap",
      zoom: 9,
      mapTypeControl: false,
      scrollwheel: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER,
      },
      streetViewControl: false,
    });
    let map = this.map;

    //Drawing manager setup

    const toolOptions = {
      fillColor: "#BCDCF9",
      fillOpacity: 0.5,
      strokeWeight: 3,
      strokeColor: "#57ACF9",
      clickable: true,
      editable: true,
      zIndex: 1,
    };

    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: toolOptions,
      circleOptions: toolOptions,
      rectangleOptions: toolOptions,
    });
    drawingManager.setMap(this.map);

    google.maps.event.addListener(drawingManager, "overlaycomplete", this.createShape);

    //Custom current location icon

    const icon = {
      url: currentLocationIcon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25),
    };

    this.markers.push(
      new google.maps.Marker({
        map: map,
        icon: icon,
        title: "current location",
        position: currentLocation,
      })
    );

    // Custom searchbox setup.

    const input = document.getElementById("seach-input");
    const searchBox = new google.maps.places.SearchBox(input);

    map.addListener("bounds_changed", function() {
      searchBox.setBounds(map.getBounds());
    });

    const centerLocation = document.getElementById("center-button");
    centerLocation.style.marginTop = "9px";
    centerLocation.style.margin = "8px";
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerLocation);

    centerLocation.addEventListener("click", async () => {
      this.resetCenter(currentLocation);
    });

    searchBox.addListener("places_changed", () => {
      let places = searchBox.getPlaces();

      if (places.length === 0) {
        console.log("there are no places");
        return;
      }

      this.deleteMarkers();

      places.forEach(place => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        //Add default places icons for groups of found locations ie: restaurants

        let icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        //Add custom Icon for a single location

        if (places.length === 1) {
          icon = {
            url: currentLocationIcon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
          };
        }

        this.markers.push(
          new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
          })
        );

        map.panTo(place.geometry.location);
        this.map.setZoom(9);
      });
    });
  };

  deleteMarkers = () => {
    let markers = this.markers;
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
  };

  mapMounted = node => {
    this.mapNode = node;
  };

  componentDidMount() {
    this.drawMap();
  }

  render() {
    return (
      <div style={styles.outerContainer}>
        <div style={styles.innerContainer}>
          <input
            style={{
              width: "100%",
              borderRadius: 4,
            }}
            id="seach-input"
            type="input"
            placeholder="Search an area..."
          />
        </div>
        <img src={crossHairs} alt="my location" id="center-button" style={{ height: 40 }} />
        <div ref={this.mapMounted} style={styles.map} />
      </div>
    );
  }
}

const configWithLoader = {
  ...googleMapsConfig,
  libraries: ["drawing", "places", "geometry"],
  LoadingContainer: LoadingContainer,
};

export default GoogleApiWrapper(configWithLoader)(MapPolygonDrawing);
