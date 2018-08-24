'use strict';

import PHENO_LIST from './data/pheno';
import AGR_LIST from './data/agr';
import getGOLinkTarget from './customized/GOurl';
import getPhenoLinkTarget from './customized/HPOurl';

const BIOLINK = 'https://api.monarchinitiative.org/api/';


export function getConfig(mode) {
  let usemode = (typeof mode === 'undefined' || mode === null) ? 'agr' : mode;
  var config;
  if (usemode.toLowerCase() === 'pheno') {
    config = {
      'slimlist': PHENO_LIST,
      'bio_link': BIOLINK + 'bioentityset/slimmer/phenotype?',
      'annot_url': getPhenoLinkTarget,
      'heatColorArray': '#3f51b5',
      'heatLevels': 48,
      'oddRowColor': '#FFFAE4',
      'evenRowColor': '#EAF0EF',
      'termUrlFormatter': 'http://compbio.charite.de/hpoweb/showterm?id=',
    };
  }
  else {
    config = {
      'slimlist': AGR_LIST,
      'bio_link': BIOLINK + 'bioentityset/slimmer/function?',
      'annot_url': getGOLinkTarget,
      'heatColorArray': '#066464',
      'heatLevels': 48,
      'oddRowColor': '#ffffff',
      'evenRowColor': '#e0e8d8',
      'termUrlFormatter': 'http://amigo.geneontology.org/amigo/term/',
    };
  }
  return config;
}
