'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import FilterDropdown from './FilterDropdown';

import AssociationTerm from './AssociationTerm';
import AssociationEvidence from './AssociationEvidence';
import getKey from '../assocKey';

import variables from '../sass/_variables.scss';


export default class AssociationsView extends React.Component {

  state = {
    filters: this.props.filters
  }

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
    const { blocks, config, currentblock, filters, focalblock } = this.props;
    let assoc_list = [];
    blocks.forEach(function (slimitem) {
      if (slimitem.class_id === currentblock.class_id) {
        assoc_list = slimitem.uniqueAssocs;
      }
    });

    var shown = 0;

    return (
      <div className={'ontology-ribbon__assoc'}>
        <div className={'ontology-ribbon__headline ' + (this.props.borderBottom ? 'ontology-ribbon__headline--border-bottom' : '') }>{this.props.tableLabel}</div>
        <div className={'ontology-ribbon__header ' + (this.props.borderBottom ? 'ontology-ribbon__header--border-bottom' : '') } >
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
            var row_style;
            let focus = false;
            if(focalblock && focalblock.uniqueIDs) {
              focus = focalblock.uniqueIDs.includes(getKey(assoc));
            }
            if (focus) {
              row_style = {
                borderLeftStyle: 'solid',
                borderLeftWidth: 'thick',
                borderLeftColor: variables.secondary_color,
                fontStyle: 'italic'
              };
            } else {
              row_style = {
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

            let found = false;
            e_types.forEach(type => {
              if(this.state.filters.get(type)) {
                found = true;
              }
            })

            if (found) {
              shown++;
            return (
              <div className={'ontology-ribbon__assoc__row' + (this.props.oddEvenColor ? 
                                                                  (shown %2 == 0 ? ' ontology-ribbon__assoc__row--even' : ' ontology-ribbon__assoc__row--odd') 
                                                                  : ''
                                                              ) + 
                                                              (this.props.borderBottom ?
                                                                  ' ontology-ribbon__assoc__row--border-bottom'
                                                                  : ''
                                                              )
                              } 
                                                              key={index}  style={row_style} >
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
  filters: PropTypes.object,
  focalblock: PropTypes.object,
  tableLabel: PropTypes.string,
  oddEvenColor: PropTypes.bool,
  borderBottom: PropTypes.bool
};

AssociationsView.defaultProps = {
  tableLabel: "GO Annotations",
  oddEvenColor: false,
  borderBottom: true
}