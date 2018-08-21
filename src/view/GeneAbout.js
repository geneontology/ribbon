'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import SpeciesIcon from './SpeciesIcon';

import FaExternalLink from 'react-icons/lib/fa/external-link';

const prefixToSpecies = {
  'HGNC': 'Homo sapiens',  // human
  'UniProtKB': 'Homo sapiens',  // human
  'MGI': 'Mus musculus',  // mouse
  'RGD': 'Rattus norvegicus',  // rat
  'ZFIN': 'Danio rerio',  // zebrafish
  'FB': 'Drosophila melanogaster',  // fly
  'WB': 'Caenorhabditis elegans',  // worm
  'SGD': 'Saccharomyces cerevisiae',  // yeast
};

const geneProductLink = 'http://amigo.geneontology.org/amigo/gene_product/';
const geneSearchLink = 'http://amigo.geneontology.org/amigo/search/annotation?q=*:*';

function getPrefixForId(inputId) {

  let idSplit = inputId.split(':');

  if (idSplit.length === 0)
    return null;

  return prefixToSpecies[idSplit[0]];

}

export default class GeneAbout extends React.Component {

  getLinkTarget(subject,block){
    let link = geneProductLink + this.patchSubject(subject);
    if(!block || block.class_id.indexOf('All')===0){
      return link ;
    }
    else
    if(block.class_label==='biological process'){
      link = geneSearchLink + '&fq=bioentity:"'+this.patchSubject(subject)+'"';
      link += '&fq=regulates_closure:"GO:0008150"';
      link += '&sfq=document_category:"annotation"';
      return link ;
    }
    else{
      let closureId = block.class_id ;
      if(block.class_label==='biological process'){
        closureId = 'GO:0008150';
      }
      else
      if(block.class_label==='molecular function'){
        closureId = 'GO:0003674';
      }
      else
      if(block.class_label==='cellular component'){
        closureId = 'GO:0005575';
      }

      // http://amigo.geneontology.org/amigo/search/annotation?q=*:*&fq=bioentity:%22RGD:620433%22&fq=regulates_closure_label:%22DNA%20binding%22&sfq=document_category:%22annotation%22
      link = geneSearchLink + '&fq=bioentity:"'+this.patchSubject(subject)+'"';
      link += '&fq=regulates_closure:"'+closureId+'"';
      link += '&sfq=document_category:"annotation"';
      return link ;
    }
  }

  /**
   * https://github.com/geneontology/go-site/issues/91
   * @param inputSubject
   * @returns {*}
   */
  patchSubject(inputSubject) {
    if (inputSubject.startsWith('MGI') && !inputSubject.startsWith('MGI:MGI:')) {
      return 'MGI:' + inputSubject;
    }
    return inputSubject;
  }

  getLabel(title) {
    return (
      (title.indexOf(' ') >= 0 ? title.split(' ')[0] : title)
    );
  }

  render() {
    const {subject, hideText, fetching, title, currentblock, ...iconProps} = this.props;

    let speciesName = getPrefixForId(subject);

    speciesName = speciesName ? speciesName : subject;

    let active_term = currentblock ? ' annotations to ' + currentblock.class_label + ' in GO' : null;

    let isValid = Object.values(prefixToSpecies).indexOf(speciesName) >= 0;
    if (isValid) {
      return (
        <div className='ontology-ribbon__about'>
          {subject &&
            <SpeciesIcon species={speciesName} {...iconProps} />
          }
          <span>
            <span className='ontology-ribbon__about-text' style={{fontStyle: 'italic'}}>
              {!hideText && speciesName}
            </span>
            {!fetching && subject && title &&
              <span className='ontology-ribbon__about-text'>
                <a
                  className='go-link'
                  href={this.getLinkTarget(subject,currentblock)}
                  rel='noopener noreferrer'
                  style={{marginRight: '.5rem'}}
                  target='_blank'
                >
                  {this.getLabel(title)}
                  {active_term}
                  <FaExternalLink size={18} style={{paddingLeft: 10, textDecoration: 'none'}} />
                </a>
              </span>
            }
          </span>
          {!fetching && !subject && title &&
          // no subject, so just provide a linkless title
              <span className='ontology-ribbon__about'>
                {title}
              </span>
          }
        </div>
      );
    }
    else {
      return <div />;
    }
  }
}

GeneAbout.propTypes = {
  currentblock: PropTypes.object,
  fetching: PropTypes.bool,
  hideText: PropTypes.bool,
  subject: PropTypes.string,
  title: PropTypes.string,
};
