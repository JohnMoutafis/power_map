import React, { Component } from 'react';
import CentralMap from '../components/CentralMap';
import Filters from './Filters';
import GraphModal from './GraphModal';
import '../../css/dashboard.css';


export default class Dashboard extends Component{
  constructor(props) {
    super(props);
    this.fetchFromEndpoint = this.fetchFromEndpoint.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      hasPreviousData: false,
      endpointsData: []
    };
  }

  fetchFromEndpoint(endpoint) {
    fetch(endpoint).then(
      results => {return results.json();}
    ).then(
      data => this.setState({endpointsData: [...this.state.endpointsData, data]})
    ).catch(err => {throw err})
  }

  handleSubmit(endpoints, countries, dateFrom, dateTo, timeStart, timeEnd) {
    for (let endpoint of endpoints){
      let params = {};
      if(endpoint.label === 'capacity') {
        // params = {country_iso2: countries, reference_year_before: dateTo.year, reference_year_after: dateFrom.year}
      } else {
        params = {country_iso2: countries,}
      }
      this.fetchFromEndpoint(endpoint.value);
    }
    event.preventDefault();
  }

  render() {
    return (
      <div className={'dashboard'}>
        <div className={'header'}>Power Map</div>
        <div className={'filters'}>
          <Filters handleSubmit={this.handleSubmit}/>
        </div>
        <div className={'central-map'}>
          <CentralMap />
          <GraphModal displayData={this.state.endpointsData}/>
        </div>
        <div className={'graphs'}>Graphs</div>
      </div>
    )
  }
}