'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import amigo_gen from 'amigo2-instance-data'
import FaCaretDown from 'react-icons/lib/fa/caret-down';

class AssociationEvidence extends Component {

    constructor() {
        super();

        this.linker = (new amigo_gen()).linker;
        this.renderECOgroup = this.renderECOgroup.bind(this);
        this.renderECOgroups = this.renderECOgroups.bind(this);
        this.renderEvidenceRow = this.renderEvidenceRow.bind(this);

        this.rollupAmount = 3 ;
    }

    renderWiths(eco_group) {
      let with_set = [];
      var link;
      if (eco_group.evidence_with.length === 0) {
        with_set.push(<div className="ontology-ribbon__content"/>)
      } else {
        let hidden_cnt = eco_group.evidence_with.length - this.rollupAmount;
        eco_group.evidence_with.forEach((with_id, w_index) => {
          if (with_id.match(/^(WB:WBVar).*/)) {
            with_set.push(<div className="ontology-ribbon__content" key={w_index}><a href={`http://www.wormbase.org/get?name=${with_id.split(':')[1]}&class=Variation`}>{with_id}</a></div>);
          }
          else {
            link = with_id.startsWith('MGI:MGI:') ? with_id.substr(4) : with_id;
            let url = this.linker.url(with_id);
            with_set.push(<div className="ontology-ribbon__content" key={w_index}><a href={url}>{link}</a></div>);
          }
        })
      }
      return with_set;
    }

  renderReferences(eco_group) {
    let ref_set = [];
    eco_group.evidence_refs.forEach((ref, r_index) => {
      let url = this.linker.url(ref);
      ref_set.push(<div className="ontology-ribbon__content" key={r_index}><a href={url}>{ref}</a></div>);
    })
    return ref_set;
  }

  renderECOcode(eco_group) {
    let eco = eco_group.evidence_type;
    let eco_id = eco_group.evidence_id;
    let eco_label = eco_group.evidence_label;
    return (<div className='ontology-ribbon__content'><a key={eco_id} title={eco_label} href={`http://www.evidenceontology.org/term/${eco_id}`}>{eco}</a></div>);
  }

  renderECOgroup (eco_group, cnt) {
    return (
      <div className='ontology-ribbon__eco-group-row' key={'evi'+cnt}>
        <div className='ontology-ribbon__with-column' key={'w'+cnt}>{this.renderWiths(eco_group)}</div>
        <div className='ontology-ribbon__ref-column' key={'r'+cnt}>{this.renderReferences(eco_group)}</div>
      </div>
    );
  }

  renderECOgroups (eco_groups) {
    let evi_row = [];
    eco_groups.forEach((e_group, cnt) => {
      evi_row.push(this.renderECOgroup(e_group, cnt));
    })
    return evi_row;
  }

  /*
    Key is one particular ECO code and there may be more than one set of
    evidence for that particular ECO code
  */
  renderEvidenceRow (eco_groups, key) {
    return (
      <div className='ontology-ribbon__evidence-row' key={key}>
        <div className='ontology-ribbon__eco-column' key={'eco'+key}>{this.renderECOcode(eco_groups[0])}</div>
        <div className='ontology-ribbon__eco-group-column' key={'wr'+key}>{this.renderECOgroups(eco_groups)}</div>
      </div>
    )
  }

  /*
    For each association there are multiple types of evidence, each type (ECO code) gets a row
  */
  render() {
    const {assoc, row} = this.props;
    var e_map = assoc.evidence_map;
    let eco_elements = [];

    e_map.forEach((eco_groups, key) => {
      eco_elements.push(this.renderEvidenceRow(eco_groups, key));
    })
    return eco_elements;
  }
}

AssociationEvidence.propTypes = {
    assoc: PropTypes.object.isRequired,
    row: PropTypes.number,
};

export default AssociationEvidence;
