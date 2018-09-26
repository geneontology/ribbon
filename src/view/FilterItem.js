'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FilterItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentselected: props.selected
    };
  }


  render () {
    const {filter, selected} = this.props;

    let classes = ['ontology-ribbon__radio'];
    classes.push(selected ? "ontology-ribbon__radio-selected" : "ontology-ribbon__radio-unselected");

    return (
      <div className="ontology-ribbon__filter_row" key={filter} >
        <div
          className={classes.join(" ")}
          onClick = { () => this.props.filterHandler(this.props.filter, !this.props.selected) }
        />
        {filter}
      </div>
    );
  }

}

FilterItem.propTypes = {
  filter: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default FilterItem;
