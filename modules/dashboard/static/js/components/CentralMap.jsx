import React, { Component } from 'react';
import { Map, GeoJSON, TileLayer } from 'react-leaflet';
import Loader from 'react-loader';
import '../../css/central-map.css';


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
    let style = {
      color: '#000000',
      weight: 0.5,
      fillColor: "#1a1d62",
      fillOpacity: 0.5,
    };

    return (
      <Map
        center={[49.85706, 14.78247]}
        maxBounds={[[71.59175, -10.42977], [32.46931, 45.48272]]}
        zoom={4}
        maxZoom={6}
        minZoom={4}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
      >
        <Loader loaded={this.state.hasData} color='#07620A' scale={3.00}>
          <TileLayer
            url={'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'}
          />
          <GeoJSON data={this.state.borders} style={style}/>
          <TileLayer
            url={'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png'}
            zIndex={10}
          />
        </Loader>
      </Map>
    )
  }
}
