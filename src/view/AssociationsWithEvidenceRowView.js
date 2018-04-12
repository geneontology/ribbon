'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import amigo_gen from 'amigo2-instance-data'

class AssociationsWithEvidenceRowView extends Component {

    constructor() {
        super();
        this.state = {
            expanded: false,
            duration: 500,
        };
        this.renderTerm = this.renderTerm.bind(this);
        this.linker = (new amigo_gen()).linker;
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

    renderEvidenceTypeLink(evidence) {
        return (
            <a title={evidence.label} href={`http://www.evidenceontology.org/term/${evidence.id}`}>
                {evidence.type}
            </a>
        )
    }

    generatedReferenceWithLink(publicationReference) {

        let url = this.linker.url(publicationReference)
        return (
            <a href={url}>
                {publicationReference}
            </a>
        );

    }

    generatedEvidenceWithLink(evidenceWith) {

        // if internal Gene link types
        if (evidenceWith.match(/^(RGD:|ZFIN:ZDB-GENE|WB:WBGene|MGI:|SGD:|GO:|HGNC:).*/)) {
            return (
                <a href={`http://www.alliancegenome.org/gene/${evidenceWith}`}>
                    {evidenceWith}
                </a>
            )
        }

        let url = this.linker.url(evidenceWith)
        return (
            <a href={url}>
                {evidenceWith}
            </a>
        );


    }

    render() {
        let taxon_result = this.props.taxon_node.children[0];
        return (
            <div>
                <div className='ontology-ribbon-assoc__row'>
                    <div className="ontology-ribbon-assoc__gene2 ontology-ribbon-evidence-header">
                    </div>
                    <div className="ontology-ribbon-assoc__evidence-type ontology-ribbon-evidence-header">
                        Evidence
                    </div>
                    <div className="ontology-ribbon-assoc__evidence-with ontology-ribbon-evidence-header">
                        With
                    </div>
                    <div className="ontology-ribbon-assoc__evidence-reference ontology-ribbon-evidence-header">
                        Reference
                    </div>
                </div>
                {
                    taxon_result.children.map((go_node) => {
                        return (
                            <div className='ontology-ribbon-assoc__row' key={go_node.about.id}
                                 style={{backgroundColor: this.props.taxon_node.color}}>
                                <div className='ontology-ribbon-assoc__gene2-content'>
                                    <a
                                        title={go_node.about.label}
                                        href={`http://amigo.geneontology.org/amigo/term/${go_node.about.id}`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {this.renderTerm(go_node)}
                                    </a>
                                </div>

                                <div className="ontology-ribbon-assoc__evidence-type">
                                    {this.renderEvidenceTypeLink(go_node.evidence)}
                                </div>
                                <div
                                    className="ontology-ribbon-assoc__evidence-with">
                                    {go_node.evidence.with &&
                                    go_node.evidence.with.map((e, index) => {
                                        return (
                                            <div key={index}>
                                                {this.generatedEvidenceWithLink(e)}
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                                <div
                                    className="ontology-ribbon-assoc__evidence-reference">
                                    {/*{go_node.reference}*/}
                                    {go_node.reference &&
                                    go_node.reference.map((e, index) => {
                                        return (
                                            <div key={index}>
                                                {this.generatedReferenceWithLink(e)}
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        );

    }

}

AssociationsWithEvidenceRowView.propTypes = {
    taxon_node: PropTypes.object.isRequired,
    geneUrlFormatter: PropTypes.func,
    key: PropTypes.any,
};

export default AssociationsWithEvidenceRowView;
