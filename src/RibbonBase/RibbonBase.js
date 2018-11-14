'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import SpeciesIcon from './../view/SpeciesIcon';
import {getPrefixForId} from './../dataHelpers';

import Block from './Block';

export default class RibbonBase extends React.Component {

  render() {
    let blocks = this.props.blocks;
    let currentblock = this.props.currentblock;
    let currentEntity = this.props.currentEntity;

    return (
      <div className='ontology-ribbon__strip'> {
        blocks.map((slimitem) => {
          let active = (currentblock !== undefined &&
                        slimitem.class_id === currentblock.class_id &&
                        currentEntity !== undefined &&
                        currentEntity === this.props.entity
                      );
          return (
            <Block
              config={this.props.config}
              isActive={active}
              key={slimitem.class_id}
              onClick={() => this.props.onSlimSelect(this.props.entity, slimitem)}
              onMouseEnter={() => this.props.onSlimEnter(this.props.entity, slimitem)}
              onMouseLeave={() => this.props.onSlimLeave(this.props.entity, slimitem)}
              showSeparatorLabel={this.props.showSeparatorLabels}
              showSeparatorLabelPrefix={this.props.showSeparatorLabelPrefixes}
              showTitle={this.props.showBlockTitles}
              slimitem={slimitem}
            />
          );
        }) }
        <a href={"http://amigo.geneontology.org/amigo/gene_product/" + this.props.entity.subject.replace("MGI:","MGI:MGI:")} className="ontology-ribbon__label ribbon-link" target="blank">
        <SpeciesIcon species={getPrefixForId(this.props.entity.subject)} />
        {this.props.title}
        </a>
      </div>
    );
  }
}

RibbonBase.propTypes = {
  blocks: PropTypes.array.isRequired,
  config: PropTypes.object,
  currentblock: PropTypes.object,
  onSlimEnter: PropTypes.func,
  onSlimLeave: PropTypes.func,
  onSlimSelect: PropTypes.func.isRequired,
  showBlockTitles: PropTypes.bool,
  showSeparatorLabelPrefixes: PropTypes.bool,
  showSeparatorLabels: PropTypes.bool,
};

RibbonBase.defaultProps = {
  showBlockTitles: true,
  showSeparatorLabelPrefixes: true,
  showSeparatorLabels: true,
};
