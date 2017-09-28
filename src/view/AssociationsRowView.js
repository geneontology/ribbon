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
    this.whenToggleClicked = this.whenToggleClicked.bind(this);
  }

  whenToggleClicked () {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  getTaxonImage(taxid) {
    var image_url = taxa.get(taxid);
    if (image_url === 'undefined' || image_url === null) {
      image_url = 'https://image.freepik.com/free-icon/text-box-without-text_318-33104.jpg';
    }
    return image_url;
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
                <dt className="ontology-ribbon-assoc__gene">
                  <a href={`http://dev.alliancegenome.org/gene/${gene_node.about.id}`}>
                    {gene_node.about.label}
                  </a>
                </dt>,
                <dd className="ontology-ribbon-assoc__gene-content">
                  <ul className="ontology-ribbon-assoc__gene-association-list">
                    {
                      gene_node.children.map((go_node) => {
                        return (
                          <li className="ontology-ribbon-assoc__gene-association-item">
                            <div className='ontology-ribbon-assoc__go'>
                              <a
                                title={go_node.about.label}
                                href={`http://amigo.geneontology.org/amigo/term/${go_node.about.id}`}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                {go_node.about.label}
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
};

export default AssociationsRowView;
