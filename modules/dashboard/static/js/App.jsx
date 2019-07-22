import React, { Component } from 'react';
import Dashboard from './containers/Dashboard'
import * as Highcharts from 'highcharts';
let HighchartsGroupedCategories = require('highcharts-grouped-categories')(Highcharts);


export default class App extends Component{
  render(){
    return <Dashboard />;
  }
}
