'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import RibbonBaseLabel from './RibbonBaseLabel';
import {getPrefixForId} from './../dataHelpers';

import Block from './Block';
import { COLOR_BY, POSITION } from '../enums';


export default class RibbonBase extends React.Component {

  renderEntityLabel(location) {
    if(this.props.entityLabel == POSITION.LEFT && location == POSITION.LEFT
    || this.props.entityLabel == POSITION.RIGHT && location == POSITION.RIGHT) {
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
      {this.renderEntityLabel(POSITION.LEFT)}
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
              classLabels={this.props.classLabels}
              annotationLabels={this.props.annotationLabels}

              minColor={this.props.minColor}
              maxColor={this.props.maxColor}
              colorBy={this.props.colorBy}
              maxHeatLevels={this.props.maxHeatLevels}
              binaryColor={this.props.binaryColor}
              disabled={slimitem.disabled}
            />
          );
        }) }
        {this.renderEntityLabel(POSITION.RIGHT)}
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
    
  entityLabel: PropTypes.number,
  minColor: PropTypes.array,
  maxColor: PropTypes.array,
  colorBy: PropTypes.number,
  maxHeatLevels: PropTypes.number,
  binaryColor: PropTypes.bool,

};

RibbonBase.defaultProps = {
  showBlockTitles: true,
  showSeparatorLabelPrefixes: true,
  showSeparatorLabels: true,
  entityLabel: POSITION.RIGHT,    // position the entity label (.NONE, .LEFT, .RIGHT)
  classLabels: ["class", "classes"],
  annotationLabels: ["annotation", "annotations"],

  minColor: [255, 255, 255],
  maxColor: [24, 73, 180],
  colorBy: COLOR_BY.CLASS_COUNT,  // color defined by .CLASS_COUNT or .ANNOTATION_COUNT
  maxHeatLevels : 48,             // increase or decrease the displayed intensity
  binaryColor : false,            // continuous or binary color

};
