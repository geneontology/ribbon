import React, { Component, PropTypes } from 'react'
import {ReduceStore} from 'flux/utils';

import ActionType from '../event/ActionType';
import BlockDispatcher from '../event/BlockDispatcher';

var _blocks;

const queryRGB = [0, 96, 96];
const orthoRGB = [255, 185, 36];

class RibbonStore extends ReduceStore {

  constructor() {
    // super(BlockDispatcher);
    //
    // BlockDispatcher.register(function(payload) {
    //   if (payload.type === ActionType.TOGGLE) {
    //   }
    // });
  }

  getInitialState() {
  }

  // /*
  // Apparently this is what the dispatcher calls to deliver the data to the store
  // */
  // reduce(before, action) {
  //   if (action.type === ActionType.TOGGLE) {
  //     var slimitem = _blocks.get(action.value.goid);
  //     _blocks.forEach(function (goclass, goid) {
  //       // only one at a time can be visible
  //       if (goid !== action.value.goid && goclass.visible) {
  //         goclass.visible = false;
  //       }
  //     });
  //     slimitem.visible = !slimitem.visible;
  //     var after = new Map(_blocks);
  //     return after;
  //   }
  //   else {
  //     return before;
  //   }
  // }
  //
  // isVisible(goid) {
  //   var slimitem = _blocks.get(goid);
  //   var visible = slimitem.visible;
  //   if (typeof(visible) === 'undefined' || visible === null) {
  //     visible = false
  //   }
  //   return visible;
  // }

}



export default new RibbonStore();
