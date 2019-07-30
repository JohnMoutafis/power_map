import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {createCapacityDataLists} from '../../common/utils';
import {simpleGraphOptions} from '../../common/graph-options';


export default class CapacityGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphOptions: {}
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.graphData !== undefined && nextProps.graphData !== this.props.graphData){
      const {categories, series} = createCapacityDataLists(nextProps.graphData[0]);
      this.setState({graphOptions: {...simpleGraphOptions(categories, series)}})
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
