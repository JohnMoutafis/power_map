import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {createGenerationDataLists} from '../../common/utils';
import {timeseriesGraphOptions} from '../../common/graph-options';


export default class GenerationGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphOptions: {}
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.graphData !== undefined && nextProps.graphData !== this.props.graphData){
      const {countries, hours, series} = createGenerationDataLists(nextProps.graphData[0]);
      this.setState({graphOptions: {...timeseriesGraphOptions('Generation', countries, hours, series)}})
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
