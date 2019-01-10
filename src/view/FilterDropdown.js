'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FaFilter from 'react-icons/lib/fa/filter'
import FaClose from 'react-icons/lib/fa/close'
import FilterItem from './FilterItem';

import { Manager, Reference, Popper } from 'react-popper';

class FilterDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
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

    // used to show an ordered list of filters
    const orderedArray = Array.from(filters.keys());
    orderedArray.sort();

    orderedArray.forEach(filter => {
      menu.push(
        <FilterItem key={count++} filters={filters} filter={filter} selected={filters.get(filter)} filterHandler={this.props.filterHandler} />
      );
    })

    return ({ref, style, placement}) => (
      <div className='ontology-ribbon__filter__list' ref={ref} style={style} data-placement={placement}>
        <span className="checkbox" onClick={() => this.props.filterHandler("all", true)}>All</span>
        <span className="checkbox" style={{margin: ".5rem 0px"}} onClick={() => this.props.filterHandler("all", false)}>Clear</span>
        {menu}
      </div>
    );
  }

  render() {
    const menu = this.buildMenu();

    const arrow = ({ref}) => (
      <span ref={ref}>
        {
          this.state.isOpen ?
            (<FaClose className='closeable link' onClick={() => { this.handleMouseDown(); }} />) :
            (<FaFilter className='bright link' onClick={() => { this.handleMouseDown(); }} />)
        }
      </span>
    );

    const modifiers = {
      hide: { enabled: false },
      preventOverflow: { enabled: false },
      flip: { enabled: false }
    };

    const pop = <Popper modifiers={modifiers} placement='bottom' positionFixed={true}>{menu}</Popper>;

    return (
      <div style={{ fontWeight: 'bold', width: '10%' }} >
        <Manager>
          Evidence &nbsp; <Reference>{arrow}</Reference>
          {this.state.isOpen && pop}
        </Manager>
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
