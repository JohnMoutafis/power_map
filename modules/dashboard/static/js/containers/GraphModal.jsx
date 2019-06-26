import React, { Component } from 'react';
import Modal from 'react-modal';
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
    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          ariaHideApp={false}
          contentLabel='Query Graph Representation'
        >
          {/*<p>{this.props.displayData}</p>*/}
          <h1>HEY</h1>
          <button onClick={this.closeModal}>Close</button>
        </Modal>
      </div>
    )
  }
}