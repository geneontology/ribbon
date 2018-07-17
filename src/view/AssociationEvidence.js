'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import amigo_gen from 'amigo2-instance-data'
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import FaCaretRight from 'react-icons/lib/fa/caret-right';

class AssociationEvidence extends Component {

    constructor() {
      super();

      this.state = {
        expanded_withs: []
      };
      this.linker = (new amigo_gen()).linker;
      this.renderECOgroup = this.renderECOgroup.bind(this);
      this.renderECOgroups = this.renderECOgroups.bind(this);
      this.renderEvidenceRow = this.renderEvidenceRow.bind(this);
      this.onExpandCollapse = this.onExpandCollapse.bind(this);

      this.rollupIndex = 3 ;
    }

    onExpandCollapse(with_list) {
        let expanded_withs = this.state.expanded_withs;
        let index = expanded_withs.indexOf(with_list);
        if (index >= 0) {
          expanded_withs.splice(index, 1);
        } else {
          expanded_withs.push(with_list);
        }
        this.setState({
          expanded_withs: expanded_withs
        });
    }

    isExpanded(with_list) {
      return (this.state.expanded_withs.indexOf(with_list) >= 0);
    }

    renderWiths(eco_group, base_key) {
      let with_set = [];
      if (eco_group.evidence_with.length === 0) {
        with_set.push(<div className="ontology-ribbon__content" key={base_key+'.nowiths'}/>)
      } else {
        let with_max = eco_group.evidence_with.length - 1;
        eco_group.evidence_with.forEach((with_id, w_index) => {
          let suffix = (w_index < with_max) ? ', ' : '';
          let link = with_id.startsWith('MGI:MGI:') ? with_id.substr(4) : with_id;
          var url;
          if (with_id.match(/^(WB:WBVar).*/)) {
            url = `http://www.wormbase.org/get?name=${with_id.split(':')[1]}&class=Variation`;
          } else {
            url = this.linker.url(with_id);
          }

          if (with_max <= this.rollupIndex ||
              w_index < this.rollupIndex ||
              (this.isExpanded(eco_group.evidence_with) && w_index < with_max)) {
            with_set.push(<div className="ontology-ribbon__content"
                               key={base_key+'.'+w_index+'.with'}>
                            <a className='link' href={url}>{link}{suffix}</a>
                          </div>);

          } else if (w_index === with_max &&
                    this.isExpanded(eco_group.evidence_with)) {
              suffix = ' ';
              with_set.push(<div className="ontology-ribbon__content"
                                 key={base_key+'.'+w_index+'.with'}>
                              <a className='link'
                                onClick={ () => { this.onExpandCollapse(eco_group.evidence_with) }}
                                href={url}>
                                {link}
                              </a>{suffix}
                              <FaCaretUp
                                className='bright link'
                                onClick={() => {this.onExpandCollapse(eco_group.evidence_with)}}
                              />
                            </div>);
          } else if (w_index === this.rollupIndex && !this.isExpanded(eco_group.evidence_with)) {
            suffix = ' ... ';
            with_set.push(<div className="ontology-ribbon__content"
                              key={base_key+'.'+w_index+'.with'}>
                            <a className='link'
                              href={url}>
                              {link}
                            </a>
                &nbsp;
                            <a className='link' onClick={() => {this.onExpandCollapse(eco_group.evidence_with)}}>
                                {suffix}<FaCaretRight
                                    className='bright link'
                                />
                            </a>
                          </div>);
          }
        })
      }
      return with_set;
    }

  renderReferences(eco_group, base_key) {
    let ref_set = [];
    let ref_max = eco_group.evidence_refs.length - 1;

    eco_group.evidence_refs.forEach((ref, r_index) => {
      let url = this.linker.url(ref);
      let suffix = (r_index < ref_max) ? ', ' : '';
      ref_set.push( <div className="ontology-ribbon__content"
                        key={base_key+'.'+r_index+'.ref'}>
                      <a className='link' href={url}>
                        {ref}{suffix}
                      </a>
                    </div>);
      });
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
    eco_groups.forEach((eco_group, group_index) => {
      evi_row.push(this.renderECOgroup(eco_group, row, eco_index, group_index));
    })
    return evi_row;
  }

  renderQualifier (e_group, row, eco_index, group_index) {
    let quals = [];
    let q_set = e_group.evidence_qualifier;
    if (q_set !== undefined) {
      let qual_max = q_set.length - 1;
      q_set.forEach((q, index) => {
      // we exclude the NOT qualifier as it is handled separately
      let suffix = (index < qual_max) ? ', ' : '';
      if (q !== 'not') {
          quals.push(
            <a
              key={'q'+row+eco_index+group_index+index}
              title={q}
              href={`http://geneontology.org/page/go-qualifiers`}
              rel="noopener noreferrer"
              className='evidence-qualifier'>
              {q}{suffix}
            </a>
          );
        }
      })
    }
    return quals;
  }

  renderQualifiers(eco_groups, row, eco_index) {
    let quals = [];
    let base_key = row+'.'+eco_index+'.';
    eco_groups.forEach((e_group, group_index) => {
      quals.push( <div key={base_key+group_index}>
                    {this.renderQualifier(e_group, row, eco_index, group_index)}
                  </div>);
    })
    return quals;
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
          <div>
            <a
              key={row+'.'+eco_index+'.'+eco_id}
              title={eco_label} className='link'
              href={`http://www.evidenceontology.org/term/${eco_id}`}>{eco}
            </a>
          </div>
        {
          this.renderQualifiers(eco_groups, row, eco_index)
        }
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
