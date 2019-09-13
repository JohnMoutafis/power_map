import React, { Component } from 'react';
import Dashboard from './containers/Dashboard'
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar/AppBar';


const styles = {
  root: {
    flexGrow: 1,
    width: '99%',
    height: '99%',
  },
  title: {
    // flexGrow: 1,
  },
};


class App extends Component{
  render(){
    const {classes} = this.props;
    return (
      <div className={classes.root} style={{height: 100}}>
        <AppBar position='static'>
          <div><h3>Power Map</h3></div>
        </AppBar>
        <Dashboard />;
      </div>
    )
  }
}

export default withStyles(styles)(App);