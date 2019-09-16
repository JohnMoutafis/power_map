import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import withStyles from '@material-ui/core/styles/withStyles';


const styles = theme => ({
  formControl: {
    flexGrow: 1,
    width: '100%'
  },
  inputLabel: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  select: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
});

class EndpointFilters extends Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      selected: ''
    };
  }

  handleChange(event){
    this.setState({selected: event.target.value});
    if(event.target.value !== ''){
      this.props.handleChange(this.props.endpointOptions[event.target.value])
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <FormControl className={classes.formControl} variant='filled'>
        <InputLabel className={classes.inputLabel} htmlFor='endpoint-pick'>Dataset</InputLabel>
        <Select
          className={classes.select}
          value={this.state.selected}
          onChange={this.handleChange}
          inputProps={{
            id: 'endpoint-pick',
            name: 'endpoint',
          }}
        >
          {this.props.endpointOptions.map((endpoint, index) => (
            <MenuItem key={index} value={index}>
              {endpoint.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }
}

export default withStyles(styles)(EndpointFilters);
