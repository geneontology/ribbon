import React, {Component} from 'react';
import PropTypes from 'prop-types';

import AssociationTerm from './AssociationTerm';
import AssociationEvidence from './AssociationEvidence';

export default class AssociationsView extends React.Component {

    static propTypes = {
        currentTermId: PropTypes.string,
        hoveredTermId: PropTypes.string,
        blocks: PropTypes.arrayOf(
            PropTypes.shape({
                class_id: PropTypes.string,
            })
        ),
    };

    render() {
      const {blocks, currentTermId, hoveredTermId, geneUrlFormatter} = this.props;
      let self = this;
      let assoc_list = [];
      blocks.forEach(function(slimitem) {
        if (slimitem.class_id === currentTermId) {
          assoc_list = slimitem.uniqueAssocs;
        }
      });

      let assocTableClassName = (hoveredTermId && hoveredTermId === currentTermId) ?
          'ontology-ribbon__assoc ontology-ribbon-assoc__active' :
          'ontology-ribbon__assoc';

      return (
        <div className={assocTableClassName}>
          <div className='ontology-ribbon__header'>
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
              var bgcolor = (index % 2 === 0) ? '#D7DADB' : '#ffffff';

              return (
                <div className='ontology-ribbon__assoc-row' style={{backgroundColor: bgcolor}} key={index}>
                    <div className='ontology-ribbon__term-column'>
                      <AssociationTerm assoc={assoc} row={index}/>
                    </div>
                    <div className='ontology-ribbon__evidence-column'>
                      <AssociationEvidence assoc={assoc} row={index}/>
                    </div>
                </div>
              );
            })
          }
        </div>
      )
    }
}
