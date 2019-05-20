'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    return (
      <div className='ontology-ribbon__strip'>
        <h2>Categories</h2>
        {
          this.state.categories.map((category, index) => {
            return (
              <li key={index}>
                <a href={category.id} target='blank'>{category.label}</a>
              </li>
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