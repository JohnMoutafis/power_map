import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated/dist/react-select.esm';


const animatedComponents = makeAnimated();


export default class CountryFilters extends Component{
  render() {
    return (
      <Select
        value={this.props.selectedCountries}
        onChange={this.props.handleChange}
        options={this.props.countryOptions}
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
      />
    )
  }
}