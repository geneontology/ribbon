import React, { Component, PropTypes } from 'react'
import {ReduceStore} from 'flux/utils';

import ActionType from '../event/ActionType';
import BlockDispatcher from '../event/BlockDispatcher';

var _blocks;

const queryRGB = [0, 96, 96];
const orthoRGB = [255, 185, 36];

class RibbonStore extends ReduceStore {

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

  getSlimList() {
    var list = _blocks.values();
    return Array.from(list);
  }

  getSlimItem(goid) {
    return _blocks.get(goid);
  }

  initSlimItems(results, subject, slimlist) {
    var title = subject;
    var queryResponse = [];
    var others = [];
    var allGOids = [];
    results.forEach(function(result) {
      if (result.data.length > 0) {
        // merge these assocs into the overall response to this query
        Array.prototype.push.apply(queryResponse, result.data);
      }
    });
    /*
    bulk of the annotations initialized first
    */
    slimlist.forEach(function(slimitem) {
      if (slimitem.golabel.includes('other')) {
        others.push(slimitem);
      }
      var assocs = [];
      queryResponse.forEach(function(response) {
        if (response.slim === slimitem.goid) {
          // skip noninformative annotations like protein binding
          for (var i = response.assocs.length - 1; i >= 0; i--) {
            var assoc = response.assocs[i];
            if (assoc.object.id === 'GO:0005515' ||
                assoc.object.id === 'GO:0003674' ||
                assoc.object.id === 'GO:0008150' ||
                assoc.object.id === 'GO:0005575') {
              response.assocs.splice(i, 1);
            }
          }
          // these are all the assocs under this slim class
          Array.prototype.push.apply(assocs, response.assocs);
          /*
          keep track of which associations are found for slim classes
          so that (after this loop) these can be removed from "other"'s list
          */
          if (!slimitem.golabel.includes('other')) {
            assocs.forEach(function(assoc) {
              allGOids.push(assoc.object.id);
            })
          }
        }
      });
      // set up uniques and color too
      var color = orthoRGB;
      slimitem.uniqueAssocs = [];
      if (assocs.length > 0) {
        var hits = [];
        slimitem.uniqueAssocs = assocs.filter(function(assocItem, index) {
          /*
            Short term interim hack because of differences in resource naming
            e.g. FlyBase === FB
          */
          var subjectID = assocItem.subject.id.replace('FlyBase', 'FB');
          assocItem.subject.id = subjectID;
          if (subjectID === subject) {
            title = assocItem.subject.label + ' (' +
                    assocItem.subject.taxon.label + ')';
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
        slimitem.uniqueAssocs = subjectFirst(subject, slimitem.uniqueAssocs);
        slimitem.color = heatColor(slimitem.uniqueAssocs.length, color, 48);
      } else {
        slimitem.color = "#fff";
      }
      slimitem.visible = false;
      _blocks.set(slimitem.goid, slimitem);
    });
    others.forEach(function(otherItem) {
      for (var i = otherItem.uniqueAssocs.length - 1; i >= 0; i--) {
        var checkAssoc = otherItem.uniqueAssocs[i];
        if (allGOids.indexOf(checkAssoc.object.id) >= 0) {
          otherItem.uniqueAssocs.splice(i, 1);
        }
      }
      /*
        Need to update the color
      */
      if (otherItem.uniqueAssocs.length > 0) {
        var color = orthoRGB;
        otherItem.uniqueAssocs.forEach(function(otherAssoc) {
          if (otherAssoc.subject.id === subject) {
            color = queryRGB;
          }
        })
        otherItem.color = heatColor(otherItem.uniqueAssocs.length, color, 48);
      } else {
        otherItem.color = "#fff";
      }
    });
    return title;
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

function subjectFirst(subject, uniqueAssocs) {
  var subjectAssocs = [];
  for (var i = uniqueAssocs.length -1; i >= 0; i--) {
    var assoc = uniqueAssocs[i];
    if (assoc.subject.id === subject) {
      // remove this from current list
      uniqueAssocs.splice(i, 1);
      // add it to the top of the revised list
      subjectAssocs.splice(0, 0, assoc);
      assoc.color = '#c0d8d8';
    } else {
      assoc.color = '#ffeec9';
    }
  }
  // now collect the remaining associations to orthologs
  return subjectAssocs.concat(uniqueAssocs);
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

export default new RibbonStore();
