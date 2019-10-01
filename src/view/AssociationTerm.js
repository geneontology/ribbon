'use strict';

import React from 'react';
import PropTypes from 'prop-types';

class AssociationTerm extends React.Component {

  constructor(props) {
    super(props);
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
    let query = this.props.termURL + assoc.object.id;
    let target = "_self";
    if(this.props.termInNewPage) {
      target = "_blank";
    }
    // console.log("object:" , assoc.object);
    return (
      <div className='ontology-ribbon__content'>
        <a
          className='ribbon-link'
          href={query}
          rel="noopener noreferrer"
          target={target}
          title={assoc.object.label + " (" + assoc.object.id + ")"}
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
  termURL : PropTypes.string,
  termInNewPage : PropTypes.bool
};

export default AssociationTerm;
