import React, { Component } from 'react';
import Dashboard from './containers/Dashboard'
import AppBar from '@material-ui/core/AppBar/AppBar';
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
  },
});


class App extends Component{
  render(){
    const {classes} = this.props;
    return (
      <div className={classes.root} style={{height: 100}}>
        <AppBar position='static'>
          <Typography variant='h3' align='center' className={classes.title}>Interactive Power Data Map</Typography>
        </AppBar>
        <Dashboard />
      </div>
    )
  }
}

export default withStyles(styles)(App);