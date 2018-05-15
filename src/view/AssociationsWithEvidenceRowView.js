'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import amigo_gen from 'amigo2-instance-data'
import SpeciesLabel from "./SpeciesLabel";
import FaCaretDown from 'react-icons/lib/fa/caret-down';

class AssociationsWithEvidenceRowView extends Component {

    constructor() {
        super();
        this.state = {
            expanded: false,
            duration: 500,
            showReferences:[],
            showEvidences:[],
        };
        this.renderTerm = this.renderTerm.bind(this);
        this.linker = (new amigo_gen()).linker;
        this.rollupAmount = 3 ;
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

    showReferenceForRow(rowKey) {
        return this.state.showReferences.indexOf(rowKey)>=0  ;
    }

    showReferences = (rowKey) =>  {
        let rows = this.state.showReferences;
        rows.push(rowKey);
        this.setState({
            showReferences : rows ,
        })
    };

    showEvidenceForRow(rowKey) {
        return this.state.showEvidences.indexOf(rowKey)>=0  ;
    }

    showEvidences = (rowKey) =>  {
        let rows = this.state.showEvidences;
        rows.push(rowKey);
        this.setState({
            showEvidences : rows ,
        })
    };

    generatedEvidenceWithLink(evidenceWith, subject) {

        // if internal Gene link types
        // else if (evidenceWith.match(/^(RGD:|ZFIN:ZDB-GENE|WB:WBGene|MGI:|SGD:|HGNC:).*/)) {
        //     return (
        //         <a href={`http://www.alliancegenome.org/gene/${evidenceWith}`}>
        //             {evidenceWith}
        //             {
        //                 subject.split(':')[0] === evidenceWith.split(':')[0] &&
        //                 <SpeciesLabel species={evidenceWith} hideText={true}/>
        //             }
        //         </a>
        //     )
        // }
        // // Allele


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

        let link = evidenceWith ;
        // path for MGI from GO
        if(link.startsWith('MGI:MGI:')){
            link = link.substr(4);
        }

        let url = this.linker.url(evidenceWith);
        return (
            <a href={url}>
                {link}
            </a>
        );


    }
    patchSubject(inputSubject){
        if(inputSubject.startsWith('MGI')){
            return 'MGI:'+inputSubject;
        }
        return inputSubject;
    }

    render() {
        let taxon_result = this.props.taxon_node.children[0];
        console.log(taxon_result)
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
                        if (inputIndex % 2 === 0) {
                            classTermIdName += ' ontology-ribbon-assoc__green';
                        }
                        else {
                            classTermIdName += ' ontology-ribbon-assoc__white';
                        }
                        classTermIdName += classDomainName;
                        let rowKey = go_node.about.id + go_node.negated;
                        return (
                            <div className={classTermIdName} key={rowKey}>
                                <div className='ontology-ribbon-assoc__gene2-content'>
                                    {go_node.evidence.qualifier && go_node.evidence.qualifier.map((q, index) => {
                                        // we exclude the NOT qualifier as it is handled separately
                                        if (q !== 'not') {
                                            return (
                                                <a key={index}
                                                   title={q}
                                                   href={`http://geneontology.org/page/go-qualifiers`}
                                                   rel="noopener noreferrer"
                                                   target="_blank"
                                                   className='evidence-qualifier'
                                                >{q}</a>
                                            )
                                        }
                                    })}
                                    <a
                                        title={go_node.about.label}
                                        href={`http://amigo.geneontology.org/amigo/gene_product/${this.patchSubject(taxon_result.about.id)}?term=${go_node.about.id}`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {this.renderTerm(go_node)}
                                    </a>
                                </div>

                                <div className="ontology-ribbon-assoc__evidence-type">
                                    {go_node.evidence.id.map((e, index) => {
                                        return (
                                            <a key={rowKey + index}
                                               title={go_node.evidence.label}
                                               href={`http://www.evidenceontology.org/term/${go_node.evidence.id[index]}`}
                                               style={{marginRight: 8}}>
                                                {go_node.evidence.type[index]}
                                            </a>
                                        )
                                    })}
                                </div>
                                <div
                                    className="ontology-ribbon-assoc__evidence-with">
                                    {go_node.evidence.with &&
                                    go_node.evidence.with.map((e, index) => {
                                        if (index < this.rollupAmount || this.showEvidenceForRow(rowKey)) {
                                            return (
                                                <div key={index}>
                                                    {this.generatedEvidenceWithLink(e, go_node.about.id)}
                                                </div>
                                            )
                                        }
                                        if (index === this.rollupAmount && !this.showEvidenceForRow(rowKey)) {
                                            return (
                                                <a key={index} onClick={ () => { this.showEvidences(rowKey) }}
                                                   className='link'
                                                >
                                                    Show {go_node.evidence.with.length-this.rollupAmount} more
                                                    <FaCaretDown/>
                                                </a>
                                            )
                                        }

                                    })
                                    }
                                </div>
                                <div
                                    className="ontology-ribbon-assoc__evidence-reference">

                                    {go_node.reference &&
                                    go_node.reference.map((e, index) => {
                                        if (index < this.rollupAmount || this.showReferenceForRow(rowKey)) {
                                            return (
                                                <div key={index}>
                                                    {this.generatedReferenceWithLink(e, go_node.about.id)}
                                                </div>
                                            )
                                        }
                                        else
                                        if (index === this.rollupAmount && !this.showReferenceForRow(rowKey)) {
                                            return (
                                            <a key={index} onClick={ () => { this.showReferences(rowKey) }}
                                             className='link'
                                            >
                                                Show {go_node.reference.length-this.rollupAmount} more
                                                <FaCaretDown/>
                                            </a>
                                            )
                                        }
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
    inputIndex: PropTypes.any,
    slim: PropTypes.any,
    hoveredDomain: PropTypes.string,
    hoveredTermId: PropTypes.string,
};

export default AssociationsWithEvidenceRowView;
