import React, { Component } from 'react';
import GraphComponent from '../components/Graphs/GraphComponent';
import {simpleGraphOptions, timeseriesGraphOptions} from '../common/graph-options';
import {createCapacityDataLists, createForecastDataList, createGenerationDataLists} from '../common/utils';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import withStyles from '@material-ui/core/styles/withStyles';


const styles = {
  dialogPaper: {
    minWidth: '90vw',
    maxWidth: '90vw',
    minHeight: '95vh',
    maxHeight: '95vh'
  },
  graphContainer: {
    height: '75vh',
    width: '87vw'
  }
};

class GraphModal extends Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSave = this.onSave.bind(this);
    this.state = {
      modalIsOpen: false,
      graph: undefined
    }
  }

  openModal() { this.setState({modalIsOpen: true}); }

  closeModal() { this.setState({modalIsOpen: false}); }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.displayData[0] !== undefined) {
      let graph = <div>No Data Passed to Graph</div>;
      let graphOptions = undefined;
      if (nextProps.renderOption === 'combination') {
        graph = <div>Combination graphs Not Yet Implemented</div>
      } else {
        if (nextProps.renderOption === 'Generation Capacity') {
          const {categories, series} = createCapacityDataLists(nextProps.displayData[0]);
          graphOptions = {...simpleGraphOptions(categories, series)};
        } else if (nextProps.renderOption === 'Actual Generation'){
          const {categories, series} = createGenerationDataLists(nextProps.displayData[0]);
          graphOptions = {...timeseriesGraphOptions('Actual Generation', categories, series)}
        } else if (nextProps.renderOption === 'Generation Forecast'){
          const {categories, series} = createForecastDataList(nextProps.displayData[0]);
          graphOptions = {...timeseriesGraphOptions('Generation Forecast', categories, series)}
        }
        graph = <GraphComponent graphOptions={graphOptions}/>;
      }
      this.setState(
        {graph: graph},
        () => this.openModal()
      );
    }
  }

  onSave(){ this.props.handleSaveGraph(this.state.graph); }

  render() {
    const {classes} = this.props;
    return (
      <Dialog
        aria-labelledby='dialog-title'
        open={this.state.modalIsOpen}
        onClose={this.closeModal}
        classes={{paper: classes.dialogPaper}}
      >
        <DialogTitle id='dialog-title' align='center'>Graph Display</DialogTitle>
        <DialogContent dividers>
          <div className={classes.graphContainer}>
            {this.state.graph}
          </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={this.onSave} variant='contained' color='primary'>Keep</Button>
            <Button onClick={this.closeModal} variant='contained' color='secondary'>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}


export default withStyles(styles)(GraphModal);