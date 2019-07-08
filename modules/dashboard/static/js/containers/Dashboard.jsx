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
    console.log(endpoint);
    fetch(endpoint).then(
      results => {return results.json();}
    ).then(
      data => this.setState({endpointsData: [...this.state.endpointsData, data]})
    ).catch(err => {throw err})
  }

  handleSubmit(endpoints, countries, dateFrom, dateTo, timeStart, timeEnd) {
    for (let endpoint of endpoints){
      let final_endpoint = endpoint.value;

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
          final_endpoint += '&reference_year_after=' + dateFrom;
        }
      }
      this.fetchFromEndpoint(final_endpoint);
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