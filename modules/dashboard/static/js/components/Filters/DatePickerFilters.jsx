import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

const returnDateFormat = 'YYYY-MM-DD';


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
    const format = 'MMMM d, yyyy';

    return(
      <div>
        <DatePicker
          placeholderText='From'
          dateFormat={format}
          selectsStart
          showYearDropdown
          showMonthDropdown
          dropdownMode='select'
          selected={from}
          startDate={from}
          endDate={to}
          onChange={this.handleFromChange}
          todayButton={'Today'}
          isClearable={true}
        />
        <DatePicker
          placeholderText='To'
          dateFormat={format}
          selectsEnd
          showYearDropdown
          showMonthDropdown
          dropdownMode='select'
          selected={to}
          startDate={from}
          endDate={to}
          minDate={from}
          onChange={this.handleToChange}
          todayButton={'Today'}
          isClearable={true}
        />
      </div>
    )
  }
}