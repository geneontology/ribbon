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
        let label = evidence.label;

        // TODO: create a map for evidence types / ids

        label = label.replace(new RegExp(' ', 'g'), '-');
        return (
            <a href={`http://www.geneontology.org/page/${label}`}>
                {/*{go_node.evidence.id}*/}
                {evidence.type}
                {/*{go_node.evidence.label}*/}
            </a>
        )
    }

    render() {

        // {this.props.taxon_node}

        // console.log(this.props.taxon_node)
        return (
            <div>
                <div className='ontology-ribbon-assoc__row'>
                    <div className="ontology-ribbon-assoc__species">
                        <SpeciesLabel species={this.props.taxon_node.about.id}/>
                        {/*<a href={this.props.geneUrlFormatter(this.props.taxon_node)}>*/}
                            {/*{gene_node.about.label}*/}
                        {/*</a>*/}
                    </div>
                    <div className="ontology-ribbon-assoc__evidence-type">
                        Evidence
                    </div>
                    <div className="ontology-ribbon-assoc__evidence-with">
                        With
                    </div>
                </div>
                <div className='ontology-ribbon-assoc__row'
                     style={{backgroundColor: this.props.taxon_node.color}}
                >
                        {
                            this.props.taxon_node.children.map((gene_node) => {
                                console.log('children_node');
                                console.log(this.props.taxon_node.children);
                                console.log('gene_node');
                                console.log(gene_node);
                                return (
                                    [
                                        <dt className="ontology-ribbon-assoc__species">

                                        </dt>
                                        // <dt className="ontology-ribbon-assoc__gene" key={`${gene_node.about.id}_gene`}>
                                        //   <a href={this.props.geneUrlFormatter(gene_node.about.id)}>
                                        //     {gene_node.about.label}
                                        //   </a>
                                        // </dt>
                                        ,
                                        <div>
                                            {
                                                gene_node.children.map((go_node, index) => {
                                                    return (
                                                        <div className='ontology-ribbon-assoc__row'  key={index}>
                                                            <div className='ontology-ribbon-assoc__species'>
                                                                [
                                                                <a
                                                                    title={go_node.about.label}
                                                                    href={`http://amigo.geneontology.org/amigo/term/${go_node.about.id}`}
                                                                    rel="noopener noreferrer"
                                                                    target="_blank"
                                                                >
                                                                    {this.renderTerm(go_node)}
                                                                </a>
                                                                ]
                                                            </div>

                                                            <div className="ontology-ribbon-assoc__evidence-type">
                                                                [
                                                                {this.renderEvidenceLink(go_node.evidence)}
                                                                ]
                                                            </div>
                                                            <div className="ontology-ribbon-assoc__evidence-with">
                                                                [
                                                                {go_node.evidence.with &&
                                                                <a href={`https://google.com/?q=${go_node.evidence.with}`}>
                                                                    {go_node.evidence.with}
                                                                </a>
                                                                }
                                                                ]
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                                    </div>
                                    ]
                                )
                            })
                        }
                </div>

            </div>
        );

    }

}

AssociationsWithEvidenceRowView.propTypes = {
    taxon_node: PropTypes.object.isRequired,
    geneUrlFormatter: PropTypes.func,
};

export default AssociationsWithEvidenceRowView;
