'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import SpeciesLabel from './SpeciesLabel';

class AssociationsWithEvidenceRowView extends React.Component {

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
                color: 'gray',
            };
            return <del style={styles}><span>{go_node.about.label}</span></del>;
        }
        else {
            return go_node.about.label;
        }
    }

    renderEvidenceLink(evidence) {
        let label = evidence.label ;

        // TODO: create a map for evidence types / ids

        label = label.replace(new RegExp(' ','g'),'-');
        return (
            <a href={`http://www.geneontology.org/page/${label}`}>
                {/*{go_node.evidence.id}*/}
                {evidence.type}
                {/*{go_node.evidence.label}*/}
            </a>
        )
    }

    render() {

        return (
            <div
                className='ontology-ribbon-assoc__row'
            >
                {/*<div className="ontology-ribbon-assoc__species">*/}
                {/*<SpeciesLabel species={this.props.taxon_node.about.id} />*/}
                {/*</div>*/}
                <dl
                    className="ontology-ribbon-assoc__species-content"
                    style={{backgroundColor: this.props.taxon_node.color}}
                >
                    {
                        this.props.taxon_node.children.map((gene_node) => {
                            return (
                                [
                                    <dt>
                                    </dt>
                                    // <dt className="ontology-ribbon-assoc__gene" key={`${gene_node.about.id}_gene`}>
                                    //   <a href={this.props.geneUrlFormatter(gene_node.about.id)}>
                                    //     {gene_node.about.label}
                                    //   </a>
                                    // </dt>
                                    ,
                                    <dd className="ontology-ribbon-assoc__gene-content"
                                        key={`${gene_node.about.id}_gene-content`}>
                                        <ul className="ontology-ribbon-assoc__gene-association-list">
                                            {
                                                gene_node.children.map((go_node, index) => {
                                                    return (
                                                        <li className="ontology-ribbon-assoc__gene-association-item"
                                                            key={index}>
                                                            <div className='ontology-ribbon-assoc__go'>
                                                                <a
                                                                    title={go_node.about.label}
                                                                    href={`http://amigo.geneontology.org/amigo/term/${go_node.about.id}`}
                                                                    rel="noopener noreferrer"
                                                                    target="_blank"
                                                                >
                                                                    {this.renderTerm(go_node)}
                                                                </a>

                                                                {this.renderEvidenceLink(go_node.evidence)}


                                                                {go_node.evidence.with &&
                                                                <a href={`https://google.com/?q=${go_node.evidence.with}`}>
                                                                    {go_node.evidence.with}
                                                                </a>
                                                                }

                                                                {/*{go_node.publications}*/}
                                                                {/*evidence: {*/}
                                                                {/*id: assoc.evidence,*/}
                                                                {/*type: assoc.evidence_type,*/}
                                                                {/*label: assoc.evidence_label,*/}
                                                                {/*with: assoc.evidence_with,*/}
                                                                {/*},*/}
                                                                {/*publications: assoc.publications*/}
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

AssociationsWithEvidenceRowView.propTypes = {
    taxon_node: PropTypes.object.isRequired,
    geneUrlFormatter: PropTypes.func,
};

export default AssociationsWithEvidenceRowView;
