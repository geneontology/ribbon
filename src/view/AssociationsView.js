import React, {Component} from 'react';
import PropTypes from 'prop-types';

import AssociationTerm from './AssociationTerm';
import AssociationEvidence from './AssociationEvidence';
import getKey from '../assocKey';

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

    render() {
      const {blocks, currentblock, focalblock} = this.props;
      let assoc_list = [];
      blocks.forEach(function(slimitem) {
        if (slimitem.class_id === currentblock.class_id) {
          assoc_list = slimitem.uniqueAssocs;
        }
      });

      // console.log(assoc_list);
      let assocCount = 0 ;

      for(let assoc of assoc_list){
          for(let ev of assoc.evidence_map){
              for(let code of ev){
                  if(code instanceof Array){
                      assocCount += code.length;
                  }
              }
          }
      }
      console.log('association count',assocCount);
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
              //var bgcolor = (index % 2 === 0) ? '#ffffff' : '#FFFAE4';
              var bgcolor = (index % 2 === 0) ? '#ffffff' : '#e0e8d8';

              let assocRowClassName = (focalblock !== undefined && focalblock.uniqueIDs.includes(getKey(assoc))) ?
                  'ontology-ribbon__assoc-row ontology-ribbon-focalterm' :
                  'ontology-ribbon__assoc-row';

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
