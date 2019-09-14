import React, { Component } from 'react';
import Dashboard from './containers/Dashboard'
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar/AppBar';


const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '99vw',
    height: '99vh',
    marginLeft: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
});


class App extends Component{
  render(){
    const {classes} = this.props;
    return (
      <div className={classes.root} style={{height: 100}}>
        <AppBar position='static'>
          <div><h3>Power Map</h3></div>
        </AppBar>
        <Dashboard />
      </div>
    )
  }
}

export default withStyles(styles)(App);