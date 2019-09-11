import React, { Component } from 'react';
import Modal from 'react-modal';
import '../../css/saved-graphs.css';


export default class GraphStorageArea extends Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      savedGraphsArea: <div> </div>,
      displaySavedGraph: undefined,
      modalIdOpen: false
    }
  }

  openModal() { this.setState({modalIsOpen: true}); }

  afterOpenModal() {}

  closeModal() {
    this.setState({modalIsOpen: false, displaySavedGraph: undefined});
  }

  handleClick(event) {
    try {
      console.log(this.props.savedGraphs[event.currentTarget.id]);
      this.setState(
        {displaySavedGraph: this.props.savedGraphs[event.currentTarget.id]},
        () => this.openModal()
      );
    } catch (err) {
      alert('No saved graphs to display');
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.savedGraphs !== this.props.savedGraphs){
      const graphRender = nextProps.savedGraphs.map((graph, index) => {
        return <div id={index} className={'graph-thumbnail'} key={index} onClick={this.handleClick}>{graph}</div>;
      });
      this.setState({savedGraphsArea: graphRender});
    }
  }


  render() {
    return(
      <div>
        <h3>Graphs History</h3>
        {this.state.savedGraphsArea}
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          ariaHideApp={false}
          contentLabel='Stored Query Graph'
        >
          <div>
            <button onClick={this.closeModal}>Close</button>
          </div>
          <div className='graphContainer'>
            {this.state.displaySavedGraph}
          </div>
        </Modal>
      </div>
    )
  }
}