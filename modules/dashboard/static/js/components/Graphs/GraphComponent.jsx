import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


export default class GraphComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphOptions: {}
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.graphOptions !== undefined && nextProps.graphOptions !== prevState.graphOptions){
      return {graphOptions: nextProps.graphOptions}
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
