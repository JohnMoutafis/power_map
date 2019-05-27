import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


const animatedComponents = makeAnimated();
const endpointOptions = [
  {label: 'capacity', value: '/api/v1/country-capacity/'},
  {label: 'generation', value: '/api/v1/country-generation'},
  {label: 'generation forecast', value: '/api/v1/country-forecast'},
];


export default class Filters extends Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: endpointOptions[0],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedOptions) {
    this.setState({selectedOptions});
    console.log('Options:', selectedOptions)
  };

  render() {
    const {selectedOptions} = this.state;

    return (
      <form>
        <h3>Available Filters</h3>
        <label>
          Available Info:
          <Select
            value={selectedOptions}
            onChange={this.handleChange}
            options={endpointOptions}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
          />
        </label>
      </form>
    )
  }
}