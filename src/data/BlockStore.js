import React, { Component, PropTypes } from 'react'
import {ReduceStore} from 'flux/utils';

import ActionType from '../event/ActionType';
import BlockDispatcher from '../event/BlockDispatcher';

var _blocks;

const queryRGB = [0, 96, 96];
const orthoRGB = [255, 185, 36];

class BlockStore extends ReduceStore {

  constructor() {
    super(BlockDispatcher);

    BlockDispatcher.register(function(payload) {
      if (payload.type === ActionType.TOGGLE) {
      }
    });
  }

  getInitialState() {
    _blocks = new Map();
    return _blocks;
  }

  /*
  Apparently this is what the dispatcher calls to deliver the data to the store
  */
  reduce(before, action) {
    if (action.type === ActionType.TOGGLE) {
      var slimitem = _blocks.get(action.value.goid);
      var after = new Map(_blocks);
      slimitem.visible = !slimitem.visible;
      return after;
    }
    else {
      return before;
    }
  }

  isVisible(goid) {
    var slimitem = _blocks.get(goid);
    var visible = slimitem.visible;
    if (typeof(visible) === 'undefined' || visible === null) {
      visible = false
    }
    return visible;
  }

  getSlimList() {
    var list = _blocks.values();
    return Array.from(list);
  }

  getSlimItem(goid) {
    return _blocks.get(goid);
  }
  /* now need to gather all of the matching associations
  from each of the organisms
  because there may be a matching slim from more than
  one organism
  */
  initSlimItems(queryResponse, subject, slimlist) {
    slimlist.forEach(function(slimitem) {
      var assocs = [];
      var color = orthoRGB;
      queryResponse.forEach(function(response) {
        if (response.slim === slimitem.goid) {
          Array.prototype.push.apply(assocs, response.assocs);
        }
      });
      slimitem.assocs = assocs;
      // set up uniques and color too
      slimitem.uniqueAssocs = [];
      if (slimitem.assocs.length > 0) {
        var hits = [];
        slimitem.uniqueAssocs = slimitem.assocs.filter(function(assocItem, index) {
          /*
          Short term interim hack because of differences in resource naming
          e.g. FlyBase (BioLink) === FB (AGR)
          */
          var subjectID = assocItem.subject.id.replace('FlyBase', 'FB');
          if (subjectID === subject) {
            color = queryRGB;
          }
          var label = assocItem.subject.id + ': ' + assocItem.object.label;
          if (!hits.includes(label)) {
            hits.push(label);
            return true;
          } else {
            return false;
          }
        });
        slimitem.uniqueAssocs.sort(sortAssociations);
        slimitem.color = heatColor(slimitem.uniqueAssocs.length, color, 8);
      } else {
        slimitem.color = "#fff";
      }
      slimitem.visible = false;
      _blocks.set(slimitem.goid, slimitem);
    });
  }
}

function sortAssociations (assoc_a, assoc_b) {
  if (assoc_a.subject.taxon.label < assoc_b.subject.taxon.label) {
    return -1;
  }
  if (assoc_a.subject.taxon.label > assoc_b.subject.taxon.label) {
    return 1;
  }
  if (assoc_a.subject.id < assoc_b.subject.id) {
    return -1;
  }
  if (assoc_a.subject.id > assoc_b.subject.id) {
    return 1;
  }
  if (assoc_a.object.label < assoc_b.object.label) {
    return -1;
  }
  if (assoc_a.object.label > assoc_b.object.label) {
    return 1;
  }
  console.log('non-unique list');
  // a must be equal to b
  return 0;
}

function heatColor(associations_count, rgb, heatLevels) {
  if( associations_count === 0 )
    return "#fff";
  let blockColor = [];     // [r,g,b]
  for ( var i=0; i<3; i++ ) {
    // logarithmic heatmap (with cutoff)
    if ( associations_count < heatLevels ) {
      // instead of just (256-rgb[i])/(Math.pow(2,associations_count)),
      // which divides space from 'white' (255) down to target color level in halves,
      // this starts at 3/4
      const heatCoef = 3 * (256 - rgb[i]) / (Math.pow(2,associations_count+1));
      blockColor[i] = Math.round( rgb[i] + heatCoef);
    }
    else {
      blockColor[i] = rgb[i];
    }
  }
  return 'rgb('+blockColor[0]+','+blockColor[1]+','+blockColor[2]+')';
}

export default new BlockStore();
