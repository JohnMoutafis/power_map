import React, { Component } from 'react';
import Modal from 'react-modal';
import CapacityGraph from '../components/Graphs/CapacityGraph';
import GenerationGraph from '../components/Graphs/GenerationGraph';
import ForecastGraph from '../components/Graphs/ForecastGraph';
import '../../css/graph-modal.css';


export default class GraphModal extends Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      modalIsOpen: false
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
    this.openModal()
  }

  render() {
    let graph;
    if (this.props.renderOption === 'capacity'){
      graph = <CapacityGraph graphData={this.props.displayData}/>
    } else if (this.props.renderOption === 'generation'){
      graph = <GenerationGraph graphData={this.props.displayData}/>
    } else if (this.props.renderOption === 'generation forecast'){
      graph = <ForecastGraph graphData={this.props.displayData}/>;
    } else if (this.props.renderOption === 'combination') {
      graph = <h1>Combination Graphs Not Yet Implemented</h1>
    }

    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          ariaHideApp={false}
          contentLabel='Query Graph Representation'
        >
          <div className='graphContainer'>
            {graph}
          </div>
          <button onClick={this.closeModal}>Close</button>
        </Modal>
      </div>
    )
  }
}