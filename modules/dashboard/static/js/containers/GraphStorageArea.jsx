import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';


const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '98%',
    maxHeight: '98%',
    width: '98%',
    maxWidth: '98%'
  },
  container: {
    height: '86vh',
    maxHeight: '86vh',
    overflow: 'auto'
  },
  graphThumbnail: {
    height: '24%',
    maxHeight: '24%',
    width: '98%',
    maxWidth: '98%',
    margin: theme.spacing(1)
  },
  title: {
    marginTop: theme.spacing(1),
  },
  dialogPaper: {
    minWidth: '90vw',
    maxWidth: '90vw',
    minHeight: '95vh',
    maxHeight: '95vh'
  },
  graphContainer: {
    height: '75vh',
    width: '87vw'
  },
});


class GraphStorageArea extends Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      modalIdOpen: false,
      displaySavedGraph: undefined
    }
  }

  openModal() { this.setState({modalIsOpen: true}); }

  closeModal() { this.setState({modalIsOpen: false, displaySavedGraph: undefined}); }

  handleClick(event) {
    try {
      this.setState(
        {displaySavedGraph: this.props.savedGraphs[event.currentTarget.id]},
        () => this.openModal()
      );
    } catch (err) {
      alert('No saved graphs to display');
    }
  }

  render() {
    const {classes} = this.props;
    return(
      <div className={classes.root}>
        <Typography variant='h5' align='center' className={classes.title}>Graphs History</Typography>
        <Box className={classes.container}>
          <Grid container direction='column' spacing={1}>
            {this.props.savedGraphs.map((graph, index) => (
              <Grid
                item xs={12}
                id={index}
                key={index}
                className={classes.graphThumbnail}
                onClick={this.handleClick}>
                  {graph}
                </Grid>
              ))}
          </Grid>
        </Box>
        <Dialog
          aria-labelledby='dialog-title'
          open={this.state.modalIsOpen}
          onClose={this.closeModal}
          classes={{paper: classes.dialogPaper}}
        >
          <DialogTitle id='dialog-title' align='center'>Stored Query Graph Display</DialogTitle>
          <DialogContent dividers>
            {this.state.displaySavedGraph}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeModal} variant='contained' color='secondary'>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(GraphStorageArea);