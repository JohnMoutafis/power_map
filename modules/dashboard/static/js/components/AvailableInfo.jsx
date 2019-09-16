import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';


const styles = theme => ({
  root: {
    height: '20%',
    width: '100%',
  },
  paper: {
    width: '100%',
    height: '22vh',
    maxHeight: '22vh',
    overflowX: 'auto'
  },
  table: {
    minWidth: 650,
  },
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  }
});


class AvailableInfo extends Component{
  constructor(props){ super(props); }

  render(){
    const {classes} = this.props;
    return(
      <div className={classes.root}>
        <Typography variant='h5' align='center' className={classes.title}>Available Data</Typography>
        <Paper className={classes.paper}>
          <Table className={classes.table} size='small' stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell> </TableCell>
                <TableCell align='center' colSpan={2}>Generation Capacity</TableCell>
                <TableCell align='center' colSpan={2}>Actual Generation</TableCell>
                <TableCell align='center' colSpan={2}>Generation Forecast</TableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <TableCell align='center'>Country</TableCell>
                <TableCell align='center'>From</TableCell>
                <TableCell align='center'>Until</TableCell>
                <TableCell align='center'>From</TableCell>
                <TableCell align='center'>Until</TableCell>
                <TableCell align='center'>From</TableCell>
                <TableCell align='center'>Until</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.availableInfo.map(row => (
                <TableRow key={row.country}>
                  <TableCell component='th' scope='row' align='center'>{row.country}</TableCell>
                  <TableCell align='center'>{row.capacity.from}</TableCell>
                  <TableCell align='center'>{row.capacity.to}</TableCell>
                  <TableCell align='center'>{row.generation.from}</TableCell>
                  <TableCell align='center'>{row.generation.to}</TableCell>
                  <TableCell align='center'>{row.forecast.from}</TableCell>
                  <TableCell align='center'>{row.forecast.to}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(AvailableInfo);