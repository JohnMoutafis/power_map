import React, { Component } from 'react';
import Loader from 'react-loader';
import {connect} from 'react-redux';
import {countrySelect, countryDeselect} from '../store/actions';
import {Map, GeoJSON, TileLayer, ZoomControl} from 'react-leaflet';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';


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

  handleOnEachFeature(feature, layer) {
    layer.on({
      'click': () => {
        layer.options.clickedFlag = !layer.options.clickedFlag;
        if(layer.options.clickedFlag){
          this.props.countrySelect(feature.properties.name);
          layer.setStyle(selectedStyle);
        } else {
          this.props.countryDeselect(feature.properties.name);
          layer.setStyle(defaultStyle);
        }
      },
      'mouseover': function () {
        if(!layer.options.clickedFlag){
          layer.setStyle(mouseOverStyle);
        }
      },
      'mouseout': function () {
        if(!layer.options.clickedFlag) {
          layer.setStyle(defaultStyle)
        }
      }
    });
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
                data={this.state.borders} style={defaultStyle}
                onEachFeature={this.handleOnEachFeature} clickedFlag={false}
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
