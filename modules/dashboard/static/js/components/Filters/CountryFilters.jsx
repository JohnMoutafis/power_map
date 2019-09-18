import React, { Component } from 'react';
import {connect} from 'react-redux';
import {countryDeselect, countrySelect} from '../../store/actions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import withStyles from '@material-ui/core/styles/withStyles';


const styles = theme => ({
  formControl: {
    flexGrow: 1,
    width: '100%'
  },
  inputLabel: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  select: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
});


class CountryFilters extends Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      selected: [],
    };
  }

  handleChange(event){
    console.log('values ' + event.target.value);
    console.log('state ' + this.state.selected);
    this.setState({selected: event.target.value});
  }

  // componentWillReceiveProps(nextProps, nextContext) {
  //   if (nextProps.selectedCountries !== this.props.selectedCountries){
  //     this.setState({selected: nextProps.selectedCountries})
  //   }
  // }

  render() {
    const {classes} = this.props;
    return (
      <FormControl className={classes.formControl} variant='filled'>
        <InputLabel className={classes.inputLabel} htmlFor='country-pick'>Countries</InputLabel>
          <Select
            multiple
            className={classes.select}
            value={this.props.selectedCountries}
            onChange={this.handleChange}
            inputProps={{
              id: 'country-pick',
              name: 'country',
            }}
            renderValue={selected => (
              <div className={classes.chips}>
                {selected.map(value => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
          >
            {this.props.countryOptions.map((country, index) => (
              <MenuItem key={index} value={country.label}>
                {country.label}
              </MenuItem>
            ))}
          </Select>
      </FormControl>
    )
  }
}


const mapStateToProps = state => ({
  selectedCountries: state.selectedCountries
});

const mapDispatchToProps = {
  countrySelect,
  countryDeselect
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CountryFilters));