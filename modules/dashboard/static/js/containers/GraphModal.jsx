import React, { Component } from 'react';
import Modal from 'react-modal';
import GraphComponent from '../components/Graphs/GraphComponent';
import {simpleGraphOptions, timeseriesGraphOptions} from '../common/graph-options';
import {createCapacityDataLists, createForecastDataList, createGenerationDataLists} from '../common/utils';
import '../../css/graph-modal.css';


export default class GraphModal extends Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSave = this.onSave.bind(this);
    this.state = {
      modalIsOpen: false,
      graph: undefined
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.displayData[0] !== undefined) {
      let graph = <div>No Data Passed to Graph</div>;
      let graphOptions = undefined;
      if (nextProps.renderOption === 'combination') {
        graph = <div>Combination graphs Not Yet Implemented</div>
      } else {
        if (nextProps.renderOption === 'capacity') {
          const {categories, series} = createCapacityDataLists(nextProps.displayData[0]);
          graphOptions = {...simpleGraphOptions(categories, series)};
        } else if (nextProps.renderOption === 'generation'){
          const {categories, series} = createGenerationDataLists(nextProps.displayData[0]);
          graphOptions = {...timeseriesGraphOptions('Generation', categories, series)}
        } else if (nextProps.renderOption === 'generation forecast'){
          const {categories, series} = createForecastDataList(nextProps.displayData[0]);
          graphOptions = {...timeseriesGraphOptions('Generation Forecast', categories, series)}
        }
        graph = <GraphComponent graphOptions={graphOptions}/>;
      }
      this.setState({graph: graph})
    }
    this.openModal();
  }

  onSave(){
    this.props.handleSaveGraph(this.state.graph);
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          ariaHideApp={false}
          contentLabel='Query Graph Representation'
        >
          <div>
            <button onClick={this.onSave}>Save</button>
            <button onClick={this.closeModal}>Close</button>
          </div>
          <div className='graphContainer'>
            {this.state.graph}
          </div>
        </Modal>
      </div>
    )
  }
}