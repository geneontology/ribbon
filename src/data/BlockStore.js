import React, { Component, PropTypes } from 'react'
//import {ReduceStore} from 'flux/utils';
import FluxReduceStore from './FluxReduceStore';
import axios from 'axios';
// import EventEmitter from 'EventEmitter';

import ActionType from './ActionType';
import RibbonDispatcher from './RibbonDispatcher';
import Ribbon from '../Ribbon';
//import SlimItem from './SlimItem';

import AGR_LIST from './agr';
import TCAG_LIST from './tcag';

// http://127.0.0.1:8888
const AGRLINK = 'https://api.monarchinitiative.org/api/bioentityset/slimmer/function?slim=GO:0003824&slim=GO:0004872&slim=GO:0005102&slim=GO:0005215&slim=GO:0005198&slim=GO:0008092&slim=GO:0003677&slim=GO:0003723&slim=GO:0001071&slim=GO:0036094&slim=GO:0046872&slim=GO:0030246&slim=GO:0008283&slim=GO:0071840&slim=GO:0051179&slim=GO:0032502&slim=GO:0000003&slim=GO:0002376&slim=GO:0050877&slim=GO:0050896&slim=GO:0023052&slim=GO:0010467&slim=GO:0019538&slim=GO:0006259&slim=GO:0044281&slim=GO:0050789&slim=GO:0005576&slim=GO:0005829&slim=GO:0005856&slim=GO:0005739&slim=GO:0005634&slim=GO:0005694&slim=GO:0016020&slim=GO:0071944&slim=GO:0030054&slim=GO:0042995&slim=GO:0032991&subject=';

const TCAGLINK = 'https://api.monarchinitiative.org/api/bioentityset/slimmer/function?&slim=GO:0007219&slim=GO:0035329&slim=GO:0006281&slim=GO:0000077&slim=GO:0048017&slim=GO:0016055&slim=GO:0006915&slim=GO:0022402&slim=GO:0016570&slim=GO:0034599&slim=GO:0007265&slim=GO:0007179&slim=GO:0030330&subject=';

const AGR_taxons = [
    'NCBITaxon:7227', // fly
    'NCBITaxon:7955', // zebrafish
    'NCBITaxon:4932', // yeast
    'NCBITaxon:6239', // worm
    'NCBITaxon:10116', //rat
    'NCBITaxon:10090', // mouse
    'NCBITaxon:9606' // human
];

const queryRGB = [0,96,96];
const orthoRGB = [255, 185, 36];

// var ribbon_data;

class RibbonStore extends FluxReduceStore {

  constructor() {
    super(RibbonDispatcher);
    console.log('In RibbonStore constructor');

    RibbonDispatcher.register(function(payload) {
      if (payload.type === ActionType.FETCH) {
          console.log('In RibbonStore callback');
      }
    });
  }

  getInitialState() {
    console.log('In RibbonStore getInitialState');
    return ({
      mode: '',
      subject: '',
    });
  }

  areEqual(s1, s2) {
    var same = (s1.subject === s2.subject && s1.mode === s2.mode);
    console.log(same +' for equality: '+s1.subject+'=='+s2.subject);
    return same;
  }

  success() {
    return (this._state.dataError !== null && this._state.dataError.length === 0);
  }

  getErrorMessage() {
    console.log('error message: '+this._state.dataError);
    return this._state.dataError;
  }

  getTitle() {
    console.log('title: '+this._state.title);
    return this._state.title;
  }

  getSlimList() {
    return this._state.slimlist;
  }

  /*
  Apparently this is what the dispatcher calls to deliver the data to the store
  */
  reduce(payload, action) {
    console.log('In RibbonStore reduce: '+payload.subject+' to '+action.value.subject);
    if (action.type === ActionType.FETCH) {
      var ribbon_data = ({
        mode: action.value.mode,
        subject: action.value.subject,
        title: action.value.subject
      });
      var orthoURL =  'https://api.monarchinitiative.org/api/bioentity/gene/' +
                      ribbon_data.subject +
                      '/homologs/?homology_type=O&fetch_objects=false';
      if (ribbon_data.mode !== null) {
        ribbon_data.slimlist = ribbon_data.mode === 'agr' ? AGR_LIST : TCAG_LIST;
      } else {
        // default
        ribbon_data.mode = 'agr';
        ribbon_data.slimlist = AGR_LIST;
      }
      console.log('creating promise');
      return fetchData(ribbon_data, orthoURL);
      /*
      fetchData(ribbon_data, orthoURL).then(function {
        return ribbon_data;
      });
      */
    }
    else {
      return payload;
    }
  }
}

function fetchData(ribbon_data, orthoURL) {
//  return new Promise(function() {
    // First get any orthologs for this gene
    axios.get(orthoURL)
    .then(function(results) {
      console.log('fetched orthologs');
      var goQueries = fetchOrthologs(results, ribbon_data);
      // Then run all the GO queries in a batch,
      // both the gene of interest and all the orthologs that were found        let orthologArray = goQueries.map(url => axios.get(url));
      let orthologArray = goQueries.map(url => axios.get(url));
      return axios.all(orthologArray);
    })
    .then(function(results) {
      console.log('fetched assocs');
      fetchSlimList(results, ribbon_data);
      return ribbon_data;
      // return the changed version
    })
    /*
    .then(function(results) {
      console.log('promise completed ');
      return ribbon_data;
    })
    */
    .catch(function(error) {
      fetchError(error, ribbon_data);
      return ribbon_data;
    })
  //});
}

function fetchOrthologs(results, ribbon_data) {
  var goLink = ribbon_data.mode === 'agr' ? AGRLINK : TCAGLINK;
  var queryTaxon = results.data.associations.length > 0 ?
    results.data.associations[0].subject.taxon.id :
    '';
  var goQueries = [];
  results.data.associations.forEach(function(ortholog_assoc) {
    // ignore paralogs, not expecting any but just in case
    if (ortholog_assoc.object.taxon.id !== queryTaxon) {
      var index = AGR_taxons.indexOf(ortholog_assoc.object.taxon.id);
      if (index >= 0) {
        goQueries.push(goLink + ortholog_assoc.object.id);
      }
    }
  });
  goQueries.push(goLink + ribbon_data.subject);
  console.log(goLink+ribbon_data.subject);
  return goQueries;
}

function fetchSlimList(results, ribbon_data) {
  var queryResponse = [];
  results.forEach(function(result) {
    if (result.data.length > 0) {
      /*
        Short term interim hack because of differences in resource naming
        e.g. FlyBase === FB
      */
      var subjectID = result.data[0].subject.replace('FlyBase', 'FB');
      if (subjectID === ribbon_data.subject) {
        ribbon_data.title = result.data[0].assocs[0].subject.label + ' (' +
                 result.data[0].assocs[0].subject.taxon.label + ')';
      }
      Array.prototype.push.apply(queryResponse, result.data);
    }
  });
  initSlimItems(ribbon_data, queryResponse);
  ribbon_data.dataError = '';
}

function fetchError(error, ribbon_data) {
  if(error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    ribbon_data.dataError = ('Unable to get data for ' +
                ribbon_data.subject +
                ' because ' +
                error.status);
  } else if (error.request) {
    console.log(error.request);
    ribbon_data.dataError = ('Unable to get data for ' +
                ribbon_data.subject +
                ' because ' +
                error.request);
  } else {
    console.log(error.message);
    ribbon_data.dataError = ('Unable to get data for ' +
                ribbon_data.subject +
                ' because ' +
                error.message);
  }
}

/* now need to gather all of the matching associations
  from each of the organisms
  because there may be a matching slim from more than
  one organism
*/
function initSlimItems(ribbon_data, queryResponse) {
  ribbon_data.slimlist.forEach(function(slimitem) {
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
        if (subjectID === ribbon_data.subject) {
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
    }
  });
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
  if( associations_count == 0 ) return "#fff";
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
