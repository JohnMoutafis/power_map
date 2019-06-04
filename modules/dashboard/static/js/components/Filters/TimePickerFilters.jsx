import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const timeFormat = 'HH:mm';


export default class TimeRangePicker extends Component{
  constructor(props) {
    super(props);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.state = {
      start: undefined,
      end: undefined
    }
  }

  handleStartChange(start) {
    this.props.handleTimePickerStartChange(moment(start).format(timeFormat));
    this.setState({start: start});
  }

  handleEndChange(end) {
    this.props.handleTimePickerEndChange(moment(end).format(timeFormat));
    this.setState({end: end});
  }

  render() {
    return (
      <div>
        <DatePicker
          placeholderText='Time Start'
          selected={this.state.start}
          onChange={this.handleStartChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60}
          timeFormat={timeFormat}
          dateFormat={timeFormat}
          isClearable={true}
          shouldCloseOnSelect={false}
        />
        {' '}-{' '}
        <DatePicker
          placeholderText='Time End'
          selected={this.state.end}
          onChange={this.handleEndChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60}
          timeFormat={timeFormat}
          dateFormat={timeFormat}
          isClearable={true}
          shouldCloseOnSelect={false}
        />
      </div>
    )
  }
}
