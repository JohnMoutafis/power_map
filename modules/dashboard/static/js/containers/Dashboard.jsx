import React, { Component } from 'react';
import CentralMap from '../components/CentralMap';
import Filters from './Filters';
import '../../css/dashboard.css';


export default class Dashboard extends Component{
  render() {
    return (
      <div className={'dashboard'}>
        <div className={'header'}>Power Map</div>
        <div className={'filters'}>
          <Filters />
        </div>
        <div className={'central-map'}>
          <CentralMap />
        </div>
        <div className={'graphs'}>Graphs</div>
      </div>
    )
  }
}