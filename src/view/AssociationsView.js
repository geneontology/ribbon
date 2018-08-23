'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import AssociationTerm from './AssociationTerm';
import AssociationEvidence from './AssociationEvidence';
import getKey from '../assocKey';

export default class AssociationsView extends React.Component {

  render() {
    const {blocks, config, currentblock, focalblock} = this.props;
    let assoc_list = [];
    blocks.forEach(function(slimitem) {
      if (slimitem.class_id === currentblock.class_id) {
        assoc_list = slimitem.uniqueAssocs;
      }
    });

    return (
      <div className={'ontology-ribbon__assoc'}>
        <div className='ontology-ribbon__header' style={{backgroundColor: config.heatColorArray}} >
          <div style={{fontWeight: 'bold', width: '50%'}}>
              Term
          </div>
          <div style={{fontWeight: 'bold', width: '10%'}}>
              Evidence
          </div>
          <div style={{fontWeight: 'bold', width: '20%'}}>
              Based on
          </div>
          <div style={{fontWeight: 'bold', width: '20%'}}>
              Reference
          </div>
        </div>
        {
          assoc_list.map((assoc, index) => {
            var bgcolor = (index % 2 === 0) ? config.evenRowColor : config.oddRowColor;

            let assocRowClassName = (focalblock !== undefined && focalblock.uniqueIDs.includes(getKey(assoc))) ?
              'ontology-ribbon__assoc-row ontology-ribbon-focalterm' :
              'ontology-ribbon__assoc-row';

            return (
              <div className={assocRowClassName} key={index} style={{backgroundColor: bgcolor}} >
                <div className='ontology-ribbon__term-column' key={'term'+index}>
                  <AssociationTerm assoc={assoc} config={config} row={index} />
                </div>
                <div className='ontology-ribbon__evidence-column' key={'evidence'+index}>
                  <AssociationEvidence assoc={assoc} row={index} />
                </div>
              </div>
            );
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
  focalblock: PropTypes.object,
};
