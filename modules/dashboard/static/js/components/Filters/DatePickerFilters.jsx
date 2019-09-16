import React, { Component } from 'react';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import {MuiPickersUtilsProvider, DatePicker} from '@material-ui/pickers';

const returnDateFormat = 'YYYY-MM-DD';


export default class DateRangePicker extends Component{
  constructor(props) {
    super(props);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.state = {
      from: null,
      to: null
    }
  }

  handleFromChange(from) {
    this.props.handleDatePickerFromChange(
      moment(from, returnDateFormat).isValid()? moment(from).format(returnDateFormat) : undefined
    );
    this.setState({from: from});
  }

  handleToChange(to) {
    this.props.handleDatePickerToChange(
      moment(to, returnDateFormat).isValid()? moment(to).format(returnDateFormat) : undefined
    );
    this.setState({to: to});
  }

  render() {
    const {from, to} = this.state;
    const format = 'MMM d, yyyy';

    return(
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <Grid item xs={6}>
            <DatePicker
              margin='normal'
              variant='inline'
              label='from'
              disableFuture
              format={format}
              value={from}
              onChange={this.handleFromChange}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              margin='normal'
              variant='inline'
              label='until'
              disableFuture
              format={format}
              value={to}
              onChange={this.handleToChange}
            />
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    )
  }
}