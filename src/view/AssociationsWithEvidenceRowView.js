'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import amigo_gen from 'amigo2-instance-data'
import SpeciesLabel from "./SpeciesLabel";

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

    renderEvidenceType(label,id,type) {
        return (
            <a title={label} href={`http://www.evidenceontology.org/term/${id}`} style={{marginRight:8}}>
                {type}
            </a>
        );
    }

    generatedReferenceWithLink(publicationReference, subject) {

        let url = this.linker.url(publicationReference);
        return (
            <div>
                <a href={url}>
                    {publicationReference}
                    {
                        subject.split(':')[0] === publicationReference.split(':')[0] &&
                        <SpeciesLabel species={publicationReference} hideText={true}/>
                    }
                </a>
            </div>
        );

    }

    generatedEvidenceWithLink(evidenceWith, subject) {

        // if internal Gene link types
        // patching GO bug
        if (evidenceWith.match(/^(MGI:MGI).*/)) {
            return (
                <a href={`http://www.alliancegenome.org/gene/${evidenceWith.substr(4)}`}>
                    {evidenceWith.substr(4)}
                    {
                        subject.split(':')[0] === evidenceWith.split(':')[0] &&
                        <SpeciesLabel species={evidenceWith} hideText={true}/>
                    }
                </a>
            )
        }
        else if (evidenceWith.match(/^(RGD:|ZFIN:ZDB-GENE|WB:WBGene|MGI:|SGD:|HGNC:).*/)) {
            return (
                <a href={`http://www.alliancegenome.org/gene/${evidenceWith}`}>
                    {evidenceWith}
                    {
                        subject.split(':')[0] === evidenceWith.split(':')[0] &&
                        <SpeciesLabel species={evidenceWith} hideText={true}/>
                    }
                </a>
            )
        }
        // Allele
        if (evidenceWith.match(/^(WB:WBVar).*/)) {
            return (
                <a href={`http://www.wormbase.org/get?name=${evidenceWith.split(':')[1]}&class=Variation`}>
                    {evidenceWith}
                    {
                        subject.split(':')[0] === evidenceWith.split(':')[0] &&
                        <SpeciesLabel species={evidenceWith} hideText={true}/>
                    }
                </a>
            )
        }

        let url = this.linker.url(evidenceWith);
        return (
            <a href={url}>
                {evidenceWith}
            </a>
        );


    }

    render() {
        let taxon_result = this.props.taxon_node.children[0];
        const {inputIndex, slim, hoveredDomain, hoveredTermId} = this.props;
        let classDomainName = '';
        if (hoveredDomain && hoveredDomain.toLowerCase() === slim.domain) {
            classDomainName += ' ontology-ribbon-assoc__active'
        }
        return (
            <div>
                {
                    taxon_result.children.map((go_node) => {
                        let classTermIdName = 'ontology-ribbon-assoc__row';
                        if (hoveredTermId && hoveredTermId === slim.goid) {
                            classTermIdName += ' ontology-ribbon-assoc__active';
                        }
                        classTermIdName += classDomainName;
                        return (
                            <div className={classTermIdName} key={go_node.about.id}
                                 style={{backgroundColor: inputIndex % 2 === 0 ? 'rgb(223,235,235)' : 'white'}}
                            >
                                <div className='ontology-ribbon-assoc__gene2-content'>
                                    <a
                                        title={go_node.about.label}
                                        href={`http://amigo.geneontology.org/amigo/term/${go_node.about.id}`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {this.renderTerm(go_node)}
                                    </a>
                                    {go_node.evidence.qualifier && go_node.evidence.qualifier.map((q) => {
                                        // we exclude the NOT qualifier as it is handled separately
                                        if (q !== 'not') {
                                            return (
                                                <a title={q}
                                                   href={`http://geneontology.org/page/go-qualifiers`}
                                                   rel="noopener noreferrer"
                                                   target="_blank"
                                                   className='evidence-qualifier'
                                                >{q}</a>
                                            )
                                        }
                                    })}
                                </div>

                                <div className="ontology-ribbon-assoc__evidence-type">
                                    {go_node.evidence.id.map ( (e,index) => {
                                        return this.renderEvidenceType(go_node.evidence.label,go_node.evidence.id[index],go_node.evidence.type[index])
                                    })}
                                </div>
                                <div
                                    className="ontology-ribbon-assoc__evidence-with">
                                    {go_node.evidence.with &&
                                    go_node.evidence.with.map((e, index) => {
                                        return (
                                            <div key={index}>
                                                {this.generatedEvidenceWithLink(e, go_node.about.id)}
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
                                                {this.generatedReferenceWithLink(e, go_node.about.id)}
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
    inputIndex: PropTypes.any,
    slim: PropTypes.any,
    hoveredDomain: PropTypes.string,
    hoveredTermId: PropTypes.string,
};

export default AssociationsWithEvidenceRowView;
