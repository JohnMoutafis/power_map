import React, { Component } from 'react';
import Dashboard from './containers/Dashboard'
import AppBar from '@material-ui/core/AppBar/AppBar';
import {Toolbar} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';


const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '99vw',
    height: '99vh',
    marginLeft: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(10)
  },
  ntua_logo: {
    height: 50,
    width: 50,
  },
  spi_logo: {
    height: 50,
    maxWidth: 100,
    marginLeft: theme.spacing(1),
    background: theme.palette.text.primary,
  },
});


class App extends Component{
  render(){
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h3' align='center' className={classes.title}>Interactive Power Data Map</Typography>
            <img src={require('../assets/ntua_logo.png')} alt='ntua_logo' className={classes.ntua_logo}/>
            <img src={require('../assets/spi_title.png')} alt='spi_title' className={classes.spi_logo}/>
          </Toolbar>
        </AppBar>
        <Dashboard />
      </div>
    )
  }
}

export default withStyles(styles)(App);