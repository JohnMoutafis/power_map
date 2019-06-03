import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class DateRangePicker extends Component{
  constructor(props) {
    super(props);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.state = {
      from: undefined,
      to: undefined
    }
  }

  handleFromChange(from) {
    this.props.handleDatePickerFromChange(from);
    this.setState({from: from});
  }

  handleToChange(to) {
    this.props.handleDatePickerToChange(to);
    this.setState({to: to});
  }

  render() {
    const {from, to} = this.state;
    const format = 'yyyy-MM-dd';

    return(
      <div>
        <DatePicker
          placeholderText='From'
          dateFormat={format}
          selected={from}
          selectsStart
          startDate={from}
          endDate={to}
          onChange={this.handleFromChange}
          todayButton={'Today'}
          isClearable={true}
          shouldCloseOnSelect={false}
          showYearDropdown
          showMonthDropdown
          dropdownMode='select'
        />
        {' '}-{' '}
        <DatePicker
          placeholderText='To'
          dateFormat={format}
          selected={to}
          selectsEnd
          startDate={from}
          endDate={to}
          minDate={from}
          onChange={this.handleToChange}
          todayButton={'Today'}
          isClearable={true}
          shouldCloseOnSelect={false}
          showYearDropdown
          showMonthDropdown
          dropdownMode='select'
        />
      </div>
    )
  }
}