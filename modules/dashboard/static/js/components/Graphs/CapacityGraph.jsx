import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {createCountryList} from "../../common/utils";
import {capacityGraphOptions} from "../../common/graph-options";


export default class CapacityGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphOptions: {}
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.graphData !== this.props.graphData){
      const {categories, series} = createCountryList(this.props.graphData[0]);
      const graphOption = JSON.parse(JSON.stringify(capacityGraphOptions));
      graphOption.xAxis.categories = categories;
      graphOption.series = series;
      this.setState({graphOptions: {...graphOption}})
    }
  }

  componentWillMount() {
    const {categories, series} = createCountryList(this.props.graphData[0]);
    const graphOption = JSON.parse(JSON.stringify(capacityGraphOptions));
    graphOption.xAxis.categories = categories;
    graphOption.series = series;
    this.setState({graphOptions: {...graphOption}})
  }

  componentWillUnmount() {
    this.setState({graphOptions: {}})
  }

  render() {
    console.log(this.state.graphOptions);
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={this.state.graphOptions}
      />
    )
  }
}
