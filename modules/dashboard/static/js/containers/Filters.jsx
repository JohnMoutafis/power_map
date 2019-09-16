import React, { Component } from 'react';
import EndpointFilters from '../components/Filters/EndpointFilter';
import CountryFilters from '../components/Filters/CountryFilters';
import DateRangePicker from '../components/Filters/DatePickerFilters';
import TimeRangePicker from '../components/Filters/TimePickerFilters';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';


const endpointOptions = [
  {label: 'Generation Capacity', value: '/api/v1/country-capacity/'},
  {label: 'Actual Generation', value: '/api/v1/country-generation/'},
  {label: 'Generation Forecast', value: '/api/v1/country-forecast/'},
];


const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '61vh',
    maxHeight: '61vh'
  },
  container: {
    width: '100%',
    height: '51vh',
    maxHeight: '51vh',
    overflow: 'auto'
  },
  title: {
    marginTop: theme.spacing(1),
  },
  box: {
    marginTop: theme.spacing(2),
  },
  span: {
    color: theme.palette.text.secondary
  },
  button: {
    width: '93%',
    margin: theme.spacing(1),
    marginTop: theme.spacing(2)
  }
});


class Filters extends Component{
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

  handleEndpointSelect(selectedOption) {
    this.setState({selectedEndpoints: selectedOption ? selectedOption : []});
  }

  handleCountrySelect(selectedOptions) {
    this.setState({
      selectedCountries: this.state.countryOptions.filter(country => (
        selectedOptions.includes(country.label)
      ))
    });
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
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <Typography variant='h5' align='center' className={classes.title}>Available Filters</Typography>
        <form onSubmit={this.handleSubmit}>
          <Box className={classes.container}>
            <Typography variant='h6' align='center' className={classes.title}>
              Select Data <span className={classes.span}>(Required)</span>
            </Typography>
            <EndpointFilters
              endpointOptions={endpointOptions}
              handleChange={this.handleEndpointSelect}
            />
            <CountryFilters
              countryOptions={this.state.countryOptions}
              handleChange={this.handleCountrySelect}
            />
            <Typography variant='h6' align='center' className={classes.title}>
              Define Date/Time Constraints <span className={classes.span}>(Optional)</span>
            </Typography>
            <Box className={classes.box}>
              <DateRangePicker
                handleDatePickerFromChange={this.handleDatePickerFromChange}
                handleDatePickerToChange={this.handleDatePickerToChange}
              />
              <Typography variant='subtitle2' align='center'>Date Constraints</Typography>
            </Box>
            <Box className={classes.box}>
              <TimeRangePicker
                handleTimePickerStartChange={this.handleTimePickerStartChange}
                handleTimePickerEndChange={this.handleTimePickerEndChange}
              />
              <Typography variant='subtitle2' align='center'>Time Constraints</Typography>
            </Box>
          </Box>
          <Button
            className={classes.button}
            type='submit' variant='contained'
            color='primary' size='large'
          >
           Show
          </Button>
        </form>
      </div>
    )
  }
}

export default withStyles(styles)(Filters);