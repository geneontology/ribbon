import React, {Component} from 'react';
import PropTypes from 'prop-types';

import AssociationTerm from './AssociationTerm';
import AssociationEvidence from './AssociationEvidence';

export default class AssociationsView extends React.Component {

    static propTypes = {
        currentblock: PropTypes.object,
        focalblock: PropTypes.object,
        blocks: PropTypes.arrayOf(
            PropTypes.shape({
                class_id: PropTypes.string,
            })
        ),
    };

    getKeyForObject(assoc) {
      let not_in = (assoc.qualifier && assoc.qualifier.length > 0 && assoc.qualifier.includes('not'));
      return not_in ? 'neg::' + assoc.subject.id + '-' + assoc.object.id : assoc.subject.id + '-' + assoc.object.id;
    }

    render() {
      const {blocks, currentblock, focalblock, geneUrlFormatter} = this.props;
      let self = this;
      let assoc_list = [];
      blocks.forEach(function(slimitem) {
        if (slimitem.class_id === currentblock.class_id) {
          assoc_list = slimitem.uniqueAssocs;
        }
      });

      return (
        <div className={'ontology-ribbon__assoc'}>
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
              var bgcolor = (index % 2 === 0) ? '#ffffff' : '#FFFAE4';
              let assocRowClassName = (focalblock !== undefined && focalblock.uniqueIDs.includes(this.getKeyForObject(assoc))) ?
                  'ontology-ribbon__assoc-row ontology-ribbon-focalterm' :
                  'ontology-ribbon__assoc-row';
              //var bgcolor = (index % 2 === 0) ? '#EAF0EF' : '#FFFAE4';

              return (
                <div className={assocRowClassName} style={{backgroundColor: bgcolor}} key={index}>
                  <div className='ontology-ribbon__term-column' key={'term'+index}>
                    <AssociationTerm assoc={assoc} row={index}/>
                  </div>
                  <div className='ontology-ribbon__evidence-column' key={'evidence'+index}>
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
