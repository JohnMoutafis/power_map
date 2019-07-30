import React, { Component } from 'react';
import CentralMap from '../components/CentralMap';
import Filters from './Filters';
import GraphModal from './GraphModal';
import GraphStorageArea from './GraphStorageArea';
import '../../css/dashboard.css';


export default class Dashboard extends Component{
  constructor(props) {
    super(props);
    this.cleanFetchedData = this.cleanFetchedData.bind(this);
    this.fetchFromEndpoint = this.fetchFromEndpoint.bind(this);
    this.graphRenderingOption = this.graphRenderingOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      fetchedEndpoints: [],
      endpointsData: [],
      savedGraphs: [],
    };
  }

  cleanFetchedData() {
    this.setState({
      fetchedEndpoints: [],
      endpointsData: []
    })
  }

  fetchFromEndpoint(endpoint) {
    fetch(endpoint).then(
      results => {return results.json();}
    ).then(
      data => this.setState({endpointsData: [...this.state.endpointsData, data]})
    ).catch(err => {throw err})
  }

  handleSubmit(endpoints, countries, dateFrom, dateTo, timeStart, timeEnd) {
    this.cleanFetchedData();
    let tmpFetchedEndpoints = [];
    for (let endpoint of endpoints){
      let final_endpoint = endpoint.value;
      tmpFetchedEndpoints.push(endpoint.label);

      let country_iso2 = 'country_iso2=';
      for(const country of countries) {
        country_iso2 += (country.value + ',')
      }
      final_endpoint += '?' + country_iso2.slice(0, -1);

      if(dateTo != null) {
        if(endpoint.label === 'capacity') {
          final_endpoint += '&reference_year_before=' + dateTo;
        } else {
          final_endpoint += '&reference_date_before=' + dateTo
        }
      }
      if(dateFrom != null){
        if(endpoint.label === 'capacity') {
          final_endpoint += '&reference_year_after=' + dateFrom;
        } else {
          final_endpoint += '&reference_date_after=' + dateFrom;
        }
      }

      if(timeStart != null && endpoint.label !== 'capacity'){
        if(endpoint.label === 'generation'){
          final_endpoint += '&generation_time_after=' + timeStart;
        } else {
          final_endpoint += '&forecast_time_after=' + timeStart + '&wind_solar_time_after=' + timeStart;
        }
      }
      if(timeEnd != null && endpoint.label !== 'capacity'){
        if(endpoint.label === 'generation') {
          final_endpoint += '&generation_time_before=' + timeEnd;
        } else {
          final_endpoint += '&forecast_time_before=' + timeEnd + '&wind_solar_time_before=' + timeEnd;
        }
      }
      this.fetchFromEndpoint(final_endpoint);
    }
    this.setState({fetchedEndpoints: tmpFetchedEndpoints});
    event.preventDefault();
  }

  graphRenderingOption(){
    if (this.state.fetchedEndpoints.length === 0){
      return '';
    } else if(this.state.fetchedEndpoints.length === 1){
      return this.state.fetchedEndpoints[0];
    } else {
      return 'combination';
    }
  }

  render() {
    let graphToRender = this.graphRenderingOption();
    return (
      <div className={'dashboard'}>
        <div className={'header'}>Power Map</div>
        <div className={'filters'}>
          <Filters handleSubmit={this.handleSubmit}/>
        </div>
        <div className={'central-map'}>
          <CentralMap />
          <GraphModal renderOption={graphToRender} displayData={this.state.endpointsData}/>
        </div>
        <div className={'graphs'}>
          <GraphStorageArea savedGraphs={this.state.savedGraphs}/>
        </div>
      </div>
    )
  }
}