'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import SpeciesIcon from './../view/SpeciesIcon';
import { getPrefixForId } from './../dataHelpers';

import Block from './Block';

export default class RibbonBaseLabel extends React.Component {

    render() {
        return (
            <div className={this.props.displayContents ? 'ontology-ribbon__strip__label' : ''}>
                <a href={"http://amigo.geneontology.org/amigo/gene_product/" + this.props.id.replace("MGI:", "MGI:MGI:")} className="ontology-ribbon__label ribbon-link" target="blank">
                    <SpeciesIcon species={getPrefixForId(this.props.id)} />
                    {this.props.label}
                </a>
            </div>
        )
    }
}

RibbonBaseLabel.propTypes = {
    displayContents: PropTypes.bool
}
RibbonBaseLabel.defaultProps = {
    displayContents : true
}