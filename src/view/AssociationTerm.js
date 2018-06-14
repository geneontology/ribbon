'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import amigo_gen from 'amigo2-instance-data'
import AssociationEvidence from "./AssociationEvidence";
import FaCaretDown from 'react-icons/lib/fa/caret-down';

class AssociationTerm extends Component {

    constructor() {
        super();
        this.linker = (new amigo_gen()).linker;
        this.renderTerm = this.renderTerm.bind(this);
    }


    renderTerm(assoc) {
      if (assoc.negated === true) {
          var styles = {
              color: 'gray',
          };
          return <del style={styles}><span>{assoc.object.label}</span></del>;
      }
      else {
          return assoc.object.label;
      }
    }

    patchSubject(inputSubject){
        if(inputSubject.startsWith('MGI')){
            return 'MGI:'+inputSubject;
        }
        return inputSubject;
    }

    render() {
        const {assoc, row, hoveredTermId} = this.props;
        let rowDivClass = 'ontology-ribbon-assoc__row';
        let self = this;

        return (
            <div className='ontology-ribbon__content'>
              {assoc.evidence.qualifier && assoc.evidence.qualifier.map((q, index) => {
                // we exclude the NOT qualifier as it is handled separately
                if (q !== 'not') {
                  return (
                    <a key={row+'Q'+index}
                         title={q}
                         href={`http://geneontology.org/page/go-qualifiers`}
                         rel="noopener noreferrer"
                         target="_blank"
                         className='evidence-qualifier'>
                       {q}
                    </a>
                  )
                }
              })}
              <a
                title={assoc.object.id}
                href={`http://amigo.geneontology.org/amigo/term/${self.patchSubject(assoc.object.id)}`}
                rel="noopener noreferrer"
                target="_blank">
                  {self.renderTerm(assoc)}
              </a>
            </div>
        );
    }
}

AssociationTerm.propTypes = {
    assoc: PropTypes.object.isRequired,
    geneUrlFormatter: PropTypes.func,
    row: PropTypes.number,
    hoveredTermId: PropTypes.string,
};

export default AssociationTerm;
