import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {createForecastDataList} from '../../common/utils';
import {timeseriesGraphOptions} from '../../common/graph-options';


export default class ForecastGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphOptions: {}
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.graphData !== undefined && nextProps.graphData !== this.props.graphData){
      const {categories, series} = createForecastDataList(nextProps.graphData[0]);
      console.log(categories);
      console.log(series);
      this.setState({
        graphOptions: {...timeseriesGraphOptions('Generation Forecast', categories, series)}
      })
    }
  }

  componentWillUnmount() {
    this.setState({graphOptions: {}})
  }

  render() {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={this.state.graphOptions}
      />
    )
  }
}
