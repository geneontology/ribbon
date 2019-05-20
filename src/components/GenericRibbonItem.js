'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

class GenericRibbonItem extends Component {

  constructor(props) {
    this.state = {
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
      </div>
    )
  }

}

GenericRibbonItem.propTypes = {
}

GenericRibbonItem.defaultProps = {
}

export default GenericRibbonItem;