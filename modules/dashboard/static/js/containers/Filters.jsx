import React, { Component } from 'react';
import AvailableInfo from '../components/Filters/AvailableInfo';
import EndpointFilters from '../components/Filters/EndpointFilter';
import CountryFilters from '../components/Filters/CountryFilters';
import DateRangePicker from '../components/Filters/DatePickerFilters';
import TimeRangePicker from '../components/Filters/TimePickerFilters';
import 'react-datepicker/dist/react-datepicker.css';


const endpointOptions = [
  {label: 'Generation Capacity', value: '/api/v1/country-capacity/'},
  {label: 'Actual Generation', value: '/api/v1/country-generation/'},
  {label: 'Generation Forecast', value: '/api/v1/country-forecast/'},
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
      availableInfo: [],
      selectedEndpoints: [],
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

  fetchAvailableInfo() {
    fetch('/api/v1/countries/available-info').then(
      results => {return results.json();}
    ).then(
      data => this.setState({availableInfo: data})
    ).catch(err => {throw err})
  }

  handleEndpointSelect(selectedOption) {
    this.setState({selectedEndpoints: selectedOption ? selectedOption : []});
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
    if (!this.state.selectedEndpoints){
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
    this.fetchAvailableInfo();
  }

  render() {
    const { selectedEndpoints } = this.state.selectedEndpoints;
    const { selectedCountries } = this.state.selectedCountries;

    return (
      <div>
        <div>
          <h3>Available Filters</h3>
          <form onSubmit={this.handleSubmit}>
            <h4>Select Data</h4>
            <label>
              Dataset
              <EndpointFilters
                endpointOptions={endpointOptions}
                selectedEndpoints={selectedEndpoints}
                defaultValue={endpointOptions[0]}
                handleChange={this.handleEndpointSelect}
              />
            </label>
            <br/>
            <label>
              Countries
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
            <input type="submit" value="SHOW" />
          </form>
        </div>
        <hr/>
        <div className={'available-info-container'}>
          <h4>Available Data</h4>
          <AvailableInfo
            availableInfo={this.state.availableInfo}
          />
        </div>
      </div>
    )
  }
}