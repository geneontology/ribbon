'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import SpeciesIcon from './../view/SpeciesIcon';
import {getPrefixForId} from './../dataHelpers';

import Block from './Block';

export default class RibbonBaseLabel extends React.Component {

  render() {
    let blocks = this.props.blocks;
    let currentblock = this.props.currentblock;
    let currentEntity = this.props.currentEntity;

    return (
        <div className='ontology-ribbon__strip__label'>
            <a href={"http://amigo.geneontology.org/amigo/gene_product/" + this.props.entity.subject.replace("MGI:","MGI:MGI:")} className="ontology-ribbon__label ribbon-link" target="blank">
                <SpeciesIcon species={getPrefixForId(this.props.entity.subject)} />
                {this.props.title}
            </a>
        </div>
    )
}
}