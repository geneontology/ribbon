'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GenericRibbonHeaderCategory from './GenericRibbonHeaderCategory';

class GenericRibbonHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: props.categories,

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
    // console.log("Header: ", this.state.categories);
    return (
      <div className='ontology-ribbon__strip'>
        {
          this.state.categories.map((category, index) => {
            return (
              <GenericRibbonHeaderCategory category={category} key={index} />
            )
          })
        }
      </div>
    )

  }

}

GenericRibbonHeader.propTypes = {
  categories: PropTypes.array.isRequired,

  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  onClick: PropTypes.func
}

GenericRibbonHeader.defaultProps = {
}

export default GenericRibbonHeader;