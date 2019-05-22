import React, { Component } from 'react';
import { Map, GeoJSON } from 'react-leaflet';



export default class CentralMap extends Component{
  constructor(props) {
    super(props);
    this.state = {
      hasData: false,
      borders: []
    };
  }

  fetchCountries() {
    fetch('/api/v1/countries/').then(
      results => {return results.json();}
    ).then(
      data => this.setState({hasData: true, borders: data})
    ).catch(err => {throw err})
  }

  componentDidMount() {
    this.fetchCountries();
  }

  render() {
    const hasData = this.state.hasData;
    let geoJSONLayer;
    let style = {
      color: '#4a83ec',
      weight: 0.5,
      fillColor: "#1a1d62",
      fillOpacity: 0.2,
    };

    if (hasData) {
      geoJSONLayer = <GeoJSON data={this.state.borders} style={style}/>
    } else {
      geoJSONLayer = <h1>Fetching Border Data ...</h1>
    }

    return (
      <Map
        center={[55, 20]}
        zoom={4}
        maxZoom={6}
        minZoom={3}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
      >
        {geoJSONLayer}
      </Map>
    )
  }
}
