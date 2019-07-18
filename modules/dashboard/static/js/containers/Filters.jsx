import React, { Component } from 'react';
import EndpointFilters from '../components/Filters/EndpointFilter';
import CountryFilters from '../components/Filters/CountryFilters';
import DateRangePicker from '../components/Filters/DatePickerFilters';
import TimeRangePicker from '../components/Filters/TimePickerFilters';


const endpointOptions = [
  {label: 'capacity', value: '/api/v1/country-capacity/'},
  {label: 'generation', value: '/api/v1/country-generation/'},
  {label: 'generation forecast', value: '/api/v1/country-forecast/'},
];


export default class Filters extends Component{
  constructor(props) {
    super(props);
    this.handleEndpointSelect = this.handleEndpointSelect.bind(this);
    this.handleCountrySelect = this.handleCountrySelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDatePickerFromChange = this.handleDatePickerFromChange.bind(this);
    this.handleDatePickerToChange = this.handleDatePickerToChange.bind(this);
    this.handleTimePickerStartChange = this.handleTimePickerStartChange.bind(this);
    this.handleTimePickerEndChange = this.handleTimePickerEndChange.bind(this);
    this.state = {
      hasData: false,
      countryOptions: [],
      selectedEndpoints: [endpointOptions[0]],
      selectedCountries: [],
      dateFrom: undefined,
      dateTo: undefined,
      timeStart: undefined,
      timeEnd: undefined
    };
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

  handleDatePickerFromChange(from) {
    this.setState({dateFrom: from});
  }

  handleDatePickerToChange(to) {
    this.setState({dateTo: to});
  }

  handleTimePickerStartChange(start) {
    this.setState({timeStart: start});
  }

  handleTimePickerEndChange(end) {
    this.setState({timeEnd: end});
  }

  handleSubmit(event) {
    if (!this.state.selectedEndpoints || !this.state.selectedEndpoints.length){
      console.log('Empty');
    } else if (!this.state.selectedCountries || !this.state.selectedCountries.length) {
       console.log('Empty');
    } else {
      this.props.handleSubmit(
        this.state.selectedEndpoints,
        this.state.selectedCountries,
        this.state.dateFrom,
        this.state.dateTo,
        this.state.timeStart,
        this.state.timeEnd
      );
    }
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
            Available Info
            <EndpointFilters
              endpointOptions={endpointOptions}
              selectedEndpoints={selectedEndpoints}
              defaultValue={endpointOptions[0]}
              handleChange={this.handleEndpointSelect}
            />
          </label>
          <br/>
          <label>
            Available Countries
            <CountryFilters
              countryOptions={this.state.countryOptions}
              selectedCountries={selectedCountries}
              handleChange={this.handleCountrySelect}
            />
          </label>
          <br/>
          <label>
            Date Range
            <DateRangePicker
              handleDatePickerFromChange={this.handleDatePickerFromChange}
              handleDatePickerToChange={this.handleDatePickerToChange}
            />
          </label>
          <br/>
          <label>
            Time Range
            <TimeRangePicker
              handleTimePickerStartChange={this.handleTimePickerStartChange}
              handleTimePickerEndChange={this.handleTimePickerEndChange}
            />
          </label>
          <br/>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}