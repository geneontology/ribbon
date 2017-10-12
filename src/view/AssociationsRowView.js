'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import taxa from '../data/taxa';
import SpeciesLabel from './SpeciesLabel';

class AssociationsRowView extends React.Component {

  constructor() {
    super();
    this.state = {
      expanded: false,
      duration: 500,
    }
    this.renderTerm = this.renderTerm.bind(this);
  }

  renderTerm(go_node) {
    if (go_node.negated === true) {
      var styles = {
	       color:'gray',
      };
      return <del style={styles}><span>{go_node.about.label}</span></del>;
    }
    else {
      return go_node.about.label;
    }
  }

  render() {

    return (
      <div
        className='ontology-ribbon-assoc__row'
      >
        <div className="ontology-ribbon-assoc__species">
          <SpeciesLabel species={this.props.taxon_node.about.id} />
        </div>
        <dl
          className="ontology-ribbon-assoc__species-content"
          style={{backgroundColor: this.props.taxon_node.color}}
        >
        {
          this.props.taxon_node.children.map((gene_node) => {
            return (
              [
                <dt className="ontology-ribbon-assoc__gene" key={`${gene_node.about.id}_gene`}>
                  <a href={this.props.geneUrlFormatter(gene_node.about.id)}>
                    {gene_node.about.label}
                  </a>
                </dt>,
                <dd className="ontology-ribbon-assoc__gene-content" key={`${gene_node.about.id}_gene-content`}>
                  <ul className="ontology-ribbon-assoc__gene-association-list">
                    {
                      gene_node.children.map((go_node) => {
                        return (
                          <li className="ontology-ribbon-assoc__gene-association-item" key={go_node.about.id}>
                            <div className='ontology-ribbon-assoc__go'>
                              <a
                                title={go_node.about.label}
                                href={`http://amigo.geneontology.org/amigo/term/${go_node.about.id}`}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                {this.renderTerm(go_node)}
                              </a>
                            </div>
                          </li>
                        )
                      })
                    }
                  </ul>
                </dd>
              ]
            )
          })
        }
        </dl>

      </div>
    );

  }
}
AssociationsRowView.propTypes = {
  taxon_node: PropTypes.object.isRequired,
  geneUrlFormatter: PropTypes.func,
};

export default AssociationsRowView;
