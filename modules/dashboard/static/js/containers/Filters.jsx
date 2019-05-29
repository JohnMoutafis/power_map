import React, { Component } from 'react';
import EndpointFilters from '../components/EndpointFilter';
import CountryFilters from '../components/CountryFilters';


const endpointOptions = [
  {label: 'capacity', value: '/api/v1/country-capacity/'},
  {label: 'generation', value: '/api/v1/country-generation'},
  {label: 'generation forecast', value: '/api/v1/country-forecast'},
];


export default class Filters extends Component{
  constructor(props) {
    super(props);
    this.state = {
      hasData: false,
      countryOptions: [],
      selectedEndpoints: endpointOptions[0],
      selectedCountries: []
    };
    this.handleEndpointSelect = this.handleEndpointSelect.bind(this);
    this.handleCountrySelect = this.handleCountrySelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  fetchCountries() {
    fetch('/api/v1/countries/name-iso-list').then(
      results => {return results.json();}
    ).then(
      data => this.setState({hasData: true, countryOptions: data})
    ).catch(err => {throw err})
  }

  handleEndpointSelect(selectedOptions) {
    this.setState({selectedEndpoints: selectedOptions? selectedOptions : []});
  }

  handleCountrySelect(selectedOptions) {
    this.setState({selectedCountries: selectedOptions? selectedOptions : []});
  }

  handleSubmit(event) {
    console.log('Endpoints', this.state.selectedEndpoints);
    console.log('Countries', this.state.selectedCountries);
    event.preventDefault();
  }

  componentDidMount() {
    this.fetchCountries();
  }

  render() {
    const { selectedEndpoints } = this.state.selectedEndpoints;
    const { selectedCountries } = this.state.selectedCountries;

    return (
      <div>
        <h3>Available Filters</h3>
        <form onSubmit={this.handleSubmit}>
          <label>
            Available Info:
            <EndpointFilters
              endpointOptions={endpointOptions}
              selectedEndpoints={selectedEndpoints}
              defaultValue={endpointOptions[0]}
              handleChange={this.handleEndpointSelect}
            />
          </label>
          <br/>
          <label>
            Available Countries:
            <CountryFilters
              countryOptions={this.state.countryOptions}
              selectedCountries={selectedCountries}
              handleChange={this.handleCountrySelect}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}