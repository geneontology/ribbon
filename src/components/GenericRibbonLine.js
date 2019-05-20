'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GenericRibbonLine extends Component {

  constructor(props) {
    super(props);
    this.state = {
      subject : props.subject,

      onEnter: props.onEnter,
      onLeave: props.onLeave,
      onClick: props.onClick
    }
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  render() {
    return (
      <div>
        <li><a href={this.state.subject.id} target='blank'>{this.state.subject.label}</a></li>
      </div>
    )

  }

}

GenericRibbonLine.propTypes = {
  subject: PropTypes.object.isRequired,

  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  onClick: PropTypes.func
}

GenericRibbonLine.defaultProps = {
}

export default GenericRibbonLine;