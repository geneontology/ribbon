'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import RibbonBaseLabel from './RibbonBaseLabel';
import {getPrefixForId} from './../dataHelpers';

import Block from './Block';

export default class RibbonBase extends React.Component {


  renderEntityLabel(location) {
    if(this.props.entityLabel == "left" && location == "left"
    || this.props.entityLabel == "right" && location == "right") {
      return (
        <RibbonBaseLabel label={this.props.title} id={this.props.entity.subject}/>
      )
    }
    return(
      <div></div>
    )
  }

  render() {
    let blocks = this.props.blocks;
    let currentblock = this.props.currentblock;
    let currentEntity = this.props.currentEntity;

    return (
      <div className='ontology-ribbon__strip'> 
      {this.renderEntityLabel('left')}
      {
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
              onMouseLeave={() => this.props.onSlimLeave()}
              showSeparatorLabel={this.props.showSeparatorLabels}
              showSeparatorLabelPrefix={this.props.showSeparatorLabelPrefixes}
              showTitle={this.props.showBlockTitles}
              slimitem={slimitem}
            />
          );
        }) }
        {this.renderEntityLabel('right')}
      </div>
    );
  }
}

RibbonBase.propTypes = {
  entity: PropTypes.object,
  blocks: PropTypes.array.isRequired,
  config: PropTypes.object,
  currentblock: PropTypes.object,
  currentEntity: PropTypes.object,
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
  entityLabel: "right" // left | right | none
};
