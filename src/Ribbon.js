import React, { Component } from 'react'
import PropTypes from 'prop-types';

import Strip from './view/Strip';
import AssociationsView from './view/AssociationsView';

export default class Ribbon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTermId: undefined
    }
  }

  handleSlimSelect = (termId) => {
    if (termId !== this.state.currentTermId) {
      this.setState({
        currentTermId: termId
      });
    }
    else {
      this.setState({
        currentTermId: undefined
      })
    }
  };

  render() {
    const slimlist = this.props.slimlist;
    return(
      <div className="ontology-ribbon">
        <Strip
          currentTermId={this.state.currentTermId}
          onSlimSelect={(termId) => this.handleSlimSelect(termId)}
          slimlist={slimlist}
        />
        <div className='ontology-ribbon__caption' >{this.props.title}</div>
        <AssociationsView
          currentTermId={this.state.currentTermId}
          slimlist={slimlist}
          geneUrlFormatter={this.props.geneUrlFormatter}
        />
      </div>
    );
  }
}


Ribbon.propTypes = {
  geneUrlFormatter: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  slimlist: PropTypes.array.isRequired,
  initialTermId: PropTypes.string,
};
