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

    renderWiths(eco_group, base_key) {
      let with_set = [];
      var link;
      if (eco_group.evidence_with.length === 0) {
        with_set.push(<div className="ontology-ribbon__content" key={base_key+'.nowiths'}/>)
      } else {
        eco_group.evidence_with.forEach((with_id, w_index) => {
          if (with_id.match(/^(WB:WBVar).*/)) {
            with_set.push(<div className="ontology-ribbon__content" key={base_key+'.'+w_index+'.with'}><a href={`http://www.wormbase.org/get?name=${with_id.split(':')[1]}&class=Variation`}>{with_id}</a></div>);
          }
          else {
            link = with_id.startsWith('MGI:MGI:') ? with_id.substr(4) : with_id;
            let url = this.linker.url(with_id);
            with_set.push(<div className="ontology-ribbon__content" key={base_key+'.'+w_index+'.with'}><a className='link' href={url}>{link}</a></div>);
          }
        })
      }
      return with_set;
    }

  renderReferences(eco_group, base_key) {
    let ref_set = [];
    eco_group.evidence_refs.forEach((ref, r_index) => {
      let url = this.linker.url(ref);
      ref_set.push(<div className="ontology-ribbon__content" key={base_key+'.'+r_index+'.ref'}><a className='link' href={url}>{ref}</a></div>);
    })
    return ref_set;
  }

  renderECOgroup (eco_group, row, eco_index, group_index) {
    let base_key = row+'.'+eco_index+'.'+group_index;
    return (
      <div className='ontology-ribbon__eco-group-row' key={base_key+'.grouprow'}>
        <div className='ontology-ribbon__with-column' key={base_key+'.withs'}>{this.renderWiths(eco_group, base_key)}</div>
        <div className='ontology-ribbon__ref-column' key={base_key+'refs'}>{this.renderReferences(eco_group, base_key)}</div>
      </div>
    );
  }

  renderECOgroups (eco_groups, row, eco_index) {
    let evi_row = [];
    eco_groups.forEach((e_group, group_index) => {
      evi_row.push(this.renderECOgroup(e_group, row, eco_index, group_index));
    })
    return evi_row;
  }

  /*
    Key is one particular ECO code and there may be more than one set of
    evidence for that particular ECO code
  */
  renderEvidenceRow (eco_groups, row, eco_index) {
    let eco = eco_groups[0].evidence_type;
    let eco_id = eco_groups[0].evidence_id;
    let eco_label = eco_groups[0].evidence_label;
    return (
      <div className='ontology-ribbon__evidence-row' key={row+'.'+eco_index}>
        <div className='ontology-ribbon__eco'>
          <a key={row+'.'+eco_index+'.'+eco_id} title={eco_label} className='link' href={`http://www.evidenceontology.org/term/${eco_id}`}>{eco}</a>
        </div>
        <div className='ontology-ribbon__eco-group-column' key={row+'.'+eco_index+'.groups'}>{this.renderECOgroups(eco_groups, row, eco_index)}</div>
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

    e_map.forEach((eco_groups, eco_index) => {
      eco_elements.push(this.renderEvidenceRow(eco_groups, row, eco_index));
    })
    return eco_elements;
  }
}

AssociationEvidence.propTypes = {
    assoc: PropTypes.object.isRequired,
    row: PropTypes.number,
};

export default AssociationEvidence;
