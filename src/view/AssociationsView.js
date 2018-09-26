'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import FilterDropdown from './FilterDropdown';

import AssociationTerm from './AssociationTerm';
import AssociationEvidence from './AssociationEvidence';
import getKey from '../assocKey';

export default class AssociationsView extends React.Component {

  state = {
    filters: this.props.eco_list
  }

  /**
   * function passed to the FilterDropdown component to handle clicks on FilterItem components
   */
  filterHandler = (filter, selected) => {
    if (filter == "all") {
      var temp = new Map(this.state.filters);
      temp.forEach((val, key) => {
        temp.set(key, selected);
      });      
      this.setState({ filters: temp });
    } else {
      var temp = new Map(this.state.filters);
      temp.set(filter, selected);
      this.setState({ filters: temp });
    }
  }

  render() {
    const { blocks, config, currentblock, eco_list, focalblock } = this.props;
    let assoc_list = [];
    blocks.forEach(function (slimitem) {
      if (slimitem.class_id === currentblock.class_id) {
        assoc_list = slimitem.uniqueAssocs;
      }
    });

    var shown = 0;

    return (
      <div className={'ontology-ribbon__assoc'}>
        <div className='ontology-ribbon__header' style={{ backgroundColor: config.annot_color }} >
          <div style={{ fontWeight: 'bold', width: '50%' }}>
              Term
          </div>
          <FilterDropdown filters={this.state.filters} filterHandler={this.filterHandler} counts = {this.state.counts} />
          <div style={{ fontWeight: 'bold', width: '20%' }}>
              Based on
          </div>
          <div style={{ fontWeight: 'bold', width: '20%' }}>
              Reference
          </div>
        </div>
        {
          assoc_list.map((assoc, index) => {
            var bgcolor = (shown % 2 === 0) ? config.evenRowColor : config.oddRowColor;

            var row_style;
            if (focalblock !== undefined && focalblock.uniqueIDs.includes(getKey(assoc))) {
              row_style = {
                backgroundColor: bgcolor,
                borderLeftStyle: 'solid',
                borderLeftWidth: 'thick',
                borderLeftColor: config.highlightColor,
                fontStyle: 'italic'
              };
            } else {
              row_style = {
                backgroundColor: bgcolor
              };
            }

            let e_map = assoc.evidence_map;
            let e_types = [];
            let temp;
            e_map.forEach((val, key) => {
              temp = val.map(elt => { return elt.evidence_type });
              temp.forEach(elt => {
                e_types.push(elt);
              });
            });
//            console.log("types: " , e_types);

            let found = false;
            e_types.forEach(type => {
              if(this.state.filters.get(type)) {
                found = true;
              }
            })

            if (found) {
              shown++;            
            return (
              <div className={'ontology-ribbon__assoc-row'} key={index} style={row_style} >
                <div className='ontology-ribbon__term-column' key={'term' + index}>
                  <AssociationTerm assoc={assoc} config={config} row={index} />
                </div>
                <div className='ontology-ribbon__evidence-column' key={'evidence' + index}>
                    <AssociationEvidence assoc={assoc} filters={this.state.filters} row={index} />
                </div>
              </div>
            );
          } else {
            return null;
          }
          })
        }
      </div>
    );
  }
}

AssociationsView.propTypes = {
  blocks: PropTypes.arrayOf(
    PropTypes.shape({
      class_id: PropTypes.string,
    })
  ),
  config: PropTypes.object,
  currentblock: PropTypes.object,
  eco_list: PropTypes.object,
  focalblock: PropTypes.object,
};
