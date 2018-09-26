'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FaFilter from 'react-icons/lib/fa/filter'
import FaClose from 'react-icons/lib/fa/close'
import FilterItem from './FilterItem';

class FilterDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpen ? props.isOpen : false
    };
  }

  handleMouseDown() {
    let self = this;
    let closing = this.state.isOpen;
    if (closing) {
      // broadcast the current selection to filter
      this.props.fireChangeEvent;
    }
    self.setState({
      isOpen: !this.state.isOpen
    });
  }

  buildMenu() {
    let menu = [];
    let count = 0;

    const filters = this.props.filters;
    filters.forEach((selected, filter) => {
      menu.push(
        <FilterItem key={count++} filters={filters} filter={filter} selected={selected} filterHandler={this.props.filterHandler} />
      );
    })
    return (
      <div>
        <span className="checkbox" onClick={() => this.props.filterHandler("all", true)}>All</span>
        <span className="checkbox" style={{margin: ".5rem 0px"}} onClick={() => this.props.filterHandler("all", false)}>Clear</span>
        {menu}
      </div>
    );
  }

  render() {
    const menu = this.state.isOpen ?
      (<div className='ontology-ribbon__filter_list'>
        {this.buildMenu()}
      </div>) :
      null;

    const arrow = this.state.isOpen ?
      (<FaClose className='closeable link' onClick={() => { this.handleMouseDown(); }} />) :
      (<FaFilter className='bright link' onClick={() => { this.handleMouseDown(); }} />);

    return (
      <div style={{ fontWeight: 'bold', width: '10%' }} >
        Evidence &nbsp;
        {arrow}
        {menu}
      </div>
    );
  }
}

FilterDropdown.propTypes = {
  filters: PropTypes.object.isRequired,
  // counts: PropTypes.object.isRequired,
  fireChangeEvent: PropTypes.func,
};

export default FilterDropdown;
