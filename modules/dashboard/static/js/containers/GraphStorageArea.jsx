import React, { Component } from 'react';
import '../../css/saved-graphs.css';


export default class GraphStorageArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedGraphs: <div> </div>
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.savedGraphs !== this.props.savedGraphs){
      const graphRender = nextProps.savedGraphs.map(function (graph, index) {
        return (<div className={'graph-thumbnail'} key={index}>{graph}</div>);
      });
      this.setState({savedGraphs: graphRender});
    }
  }

  render() {
    return(
      <div>
        <h3>Saved Graphs</h3>
        {this.state.savedGraphs}
      </div>
    )
  }
}