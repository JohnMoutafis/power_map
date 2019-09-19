import React, { Component } from 'react';
import Loader from 'react-loader';
import {connect} from 'react-redux';
import {countrySelect, countryDeselect} from '../store/actions';
import {Map, GeoJSON, TileLayer, ZoomControl} from 'react-leaflet';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import {addPropertyToFeatureCollection} from "../common/utils";


const defaultStyle = {
  color: '#000000',
  weight: 0.5,
  fillColor: "#1a1d62",
  fillOpacity: 0.5
};

const mouseOverStyle = {
  color: '#ff9800',
  weight: 3,
  fillColor: "#1a1d62",
  fillOpacity: 0.5
};

const selectedStyle = {
  color: '#ff9800',
  weight: 2,
  fillColor: "#ffc107",
  fillOpacity: 0.5
};

const styles = themes => ({
  root: {
    height: '75%',
    width: '100%'
  },
  leafletContainer: {
    height: '100%',
    width: '100%',
    margin: 'auto'
  },
  paper: {
    width: '100%',
    height: '61vh',
    marginTop: themes.spacing(1)
  },
});

class CentralMap extends Component{
  constructor(props) {
    super(props);
    this.handleOnEachFeature = this.handleOnEachFeature.bind(this);
    this.style = this.style.bind(this);
    this.state = {
      hasData: false,
      borders: []
    };
  }

  fetchCountries() {
    fetch('/api/v1/countries/').then(
      results => {return results.json();}
    ).then(
      data => this.setState({hasData: true, borders: addPropertyToFeatureCollection(data)})
    ).catch(err => {throw err})
  }

  handleOnEachFeature(feature, layer) {
    layer.on({
      'click': () => {
        if(!feature.properties.selected){
          this.props.countrySelect(feature.properties.name);
        } else {
          this.props.countryDeselect(feature.properties.name);
        }
      },
      'mouseover': function () {
        if(!feature.properties.selected){
          layer.setStyle(mouseOverStyle);
        }
      },
      'mouseout': function () {
        if(!feature.properties.selected) {
          layer.setStyle(defaultStyle)
        }
      }
    });
  }

  style(feature) {
    if (feature.properties.selected) {
      return selectedStyle
    } else {
      return defaultStyle
    }
  }

  componentWillMount() {
    this.fetchCountries();
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    if(nextProps.selectedCountries !== this.props.selectedCountries){
      const updatedBorders = {...this.state.borders};
      for(const feature of updatedBorders.features){
        feature.properties.selected = nextProps.selectedCountries.includes(feature.properties.name);
      }
      this.setState({borders: updatedBorders});
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Map
            className={classes.leafletContainer}
            center={[47.85706, 12.78247]}
            maxBounds={[[71.59175, -10.42977], [34.46931, 40.48272]]}
            zoom={4}
            maxZoom={6}
            minZoom={3}
            zoomControl={false}
            attributionControl={true}
            doubleClickZoom={true}
            scrollWheelZoom={true}
            dragging={true}
            animate={true}
            easeLinearity={0.35}
          >
            <ZoomControl position='bottomleft' />
            <Loader loaded={this.state.hasData} color='#07620A' scale={3.00}>
              <TileLayer url={'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'} />
              <GeoJSON
                data={this.state.borders} style={this.style}
                onEachFeature={this.handleOnEachFeature}
              />
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


const mapStateToProps = state => ({
  selectedCountries: state.selectedCountries
});

const mapDispatchToProps = {
  countrySelect,
  countryDeselect
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CentralMap));
