'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import amigo_gen from 'amigo2-instance-data';

class AssociationTerm extends React.Component {

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

  render() {
    const {assoc, config} = this.props;
    let self = this;
    let query = config.termUrlFormatter + assoc.object.id;
    return (
      <div className='ontology-ribbon__content'>
        <a
          className='go-link'
          href={query}
          rel="noopener noreferrer"
          target='_blank'
          title={assoc.object.id}
        >
          {self.renderTerm(assoc)}
        </a>
      </div>
    );
  }
}

AssociationTerm.propTypes = {
  assoc: PropTypes.object.isRequired,
  config: PropTypes.object,
  row: PropTypes.number,
};

export default AssociationTerm;
