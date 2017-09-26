import React, { Component } from 'react'
import PropTypes from 'prop-types';

import Strip from './view/Strip';
import AssociationsView from './view/AssociationsView';

export default class Ribbon extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    slimlist: PropTypes.array.isRequired,
    initialTermId: PropTypes.string
  }

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
  }

  render() {
    const slimlist = this.props.slimlist;
    return(
      <div >
        <Strip
          onSlimSelect={(termId) => this.handleSlimSelect(termId)}
          slimlist={slimlist}
        />
        <div className='caption' >{this.props.title}</div>
        <AssociationsView
          currentTermId={this.state.currentTermId}
          slimlist={slimlist}
        />
      </div>
    );
  }
}
