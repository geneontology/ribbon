'use strict';

import PHENO_LIST from './data/pheno';
import EXPRESSION_LIST from './data/expression';
import AGR_LIST from './data/agr';
import getGOLinkTarget from './customized/GOurl';
import getPhenoLinkTarget from './customized/HPOurl';

// const BIOLINK = 'https://api.monarchinitiative.org/api/';
const BIOLINK = 'http://localhost:5000/api/';


export function getConfig(mode) {
  let usemode = (typeof mode === 'undefined' || mode === null) ? 'agr' : mode;
  var config;
  if (usemode.toLowerCase() === 'pheno') {
    config = {
      'annot_color': '#3f51b5',
      'annot_url': getPhenoLinkTarget,
      'bio_link': BIOLINK + 'bioentityset/slimmer/phenotype?',
      'heatLevels': 48,
      'highlightColor': '#8BC34A',
      'slimlist': PHENO_LIST,
      'termUrlFormatter': 'http://compbio.charite.de/hpoweb/showterm?id=',
    };
  }
  else if (usemode.toLowerCase() === 'expression') {
    config = {
      'annot_color': '#3f51b5',
      'annot_url': getPhenoLinkTarget,
      'bio_link': BIOLINK + 'bioentityset/slimmer/expression?',
      'heatLevels': 48,
      'highlightColor': '#8BC34A',
      'slimlist': EXPRESSION_LIST,
      'termUrlFormatter': 'http://compbio.charite.de/hpoweb/showterm?id=',
    };
  }
  else {
    config = {
      'annot_color': '#066464',
      'annot_url': getGOLinkTarget,
      'bio_link': BIOLINK + 'bioentityset/slimmer/function?',
      'heatLevels': 48,
      'highlightColor': '#8BC34A',
      'slimlist': AGR_LIST,
      'termUrlFormatter': 'http://amigo.geneontology.org/amigo/term/',
    };
  }
  return config;
}
