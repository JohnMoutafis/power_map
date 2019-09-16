import React, { Component } from 'react';
import moment from 'moment';
import DateFnsUtils from "@date-io/date-fns";
import Grid from "@material-ui/core/Grid";
import {MuiPickersUtilsProvider, TimePicker} from "@material-ui/pickers";

const timeFormat = 'HH:00';


export default class TimeRangePicker extends Component{
  constructor(props) {
    super(props);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.state = {
      start: null,
      end: null
    }
  }

  handleStartChange(start) {
    this.props.handleTimePickerStartChange(
      moment(start, timeFormat).isValid()? moment(start).format(timeFormat) : undefined
    );
    this.setState({start: start});
  }

  handleEndChange(end) {
    this.props.handleTimePickerEndChange(
      moment(end, timeFormat).isValid()? moment(end).format(timeFormat) : undefined
    );
    this.setState({end: end});
  }

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <Grid item xs={6}>
            <TimePicker
              ampm={false}
              variant="inline"
              label={'from'}
              openTo="hours"
              views={["hours"]}
              value={this.state.start}
              onChange={this.handleStartChange}
              format={timeFormat}
            />
          </Grid>
          <Grid item xs={6}>
            <TimePicker
              ampm={false}
              variant="inline"
              label={'until'}
              openTo="hours"
              views={["hours"]}
              value={this.state.end}
              onChange={this.handleEndChange}
              format={timeFormat}
            />
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    )
  }
}
