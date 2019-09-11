import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated/dist/react-select.esm';


const animatedComponents = makeAnimated();


export default class EndpointFilters extends Component{
  render() {
    return (
      <Select
        value={this.props.selectedEndpoints}
        onChange={this.props.handleChange}
        options={this.props.endpointOptions}
        closeMenuOnSelect={true}
        components={animatedComponents}
      />
    )
  }
}
