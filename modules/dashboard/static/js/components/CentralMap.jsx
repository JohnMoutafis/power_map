import React, { Component } from 'react';
import Loader from 'react-loader';
import Paper from "@material-ui/core/Paper";
import { Map, GeoJSON, TileLayer } from 'react-leaflet';
import withStyles from "@material-ui/core/styles/withStyles";
import '../../css/central-map.css';


const styles = {
  root: {
    height: '75%',
    width: '100%'
  },
  paper: {
    width: '100%',
    height: '61vh',
  },
};


class CentralMap extends Component{
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
    const {classes} = this.props;
    const style = {
      color: '#000000',
      weight: 0.5,
      fillColor: "#1a1d62",
      fillOpacity: 0.5,
    };

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Map
            center={[49.85706, 14.78247]}
            maxBounds={[[71.59175, -10.42977], [32.46931, 45.48272]]}
            zoom={3}
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
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(CentralMap);
