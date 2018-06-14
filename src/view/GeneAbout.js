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

const taxonomyToSpecies = {
    'NCBITaxon:9606': 'Homo sapiens',  // human
    'NCBITaxon:10090': 'Mus musculus',  // mouse
    'NCBITaxon:10116': 'Rattus norvegicus',  // rat
    'NCBITaxon:7955': 'Danio rerio',  // zebrafish
    'NCBITaxon:7227': 'Drosophila melanogaster',  // fly
    'NCBITaxon:6239': 'Caenorhabditis elegans',  // worm
    'NCBITaxon:4932': 'Saccharomyces cerevisiae',  // yeast
    'NCBITaxon:559292': 'Saccharomyces cerevisiae S288C',  // also yeast
};

function getPrefixForId(inputId) {

    let idSplit = inputId.split(':');

    if (idSplit.length === 0)
      return null;

    return prefixToSpecies[idSplit[0]];

}

export default class GeneAbout extends React.Component {

  render () {
    const {subject, hideText, fetching, title, ...iconProps} = this.props;
    let speciesName = taxonomyToSpecies[subject];
    speciesName = speciesName ? speciesName : getPrefixForId(subject);

    speciesName = speciesName ? speciesName : subject;

    let isValid = Object.values(taxonomyToSpecies).indexOf(speciesName) >= 0;
    if (isValid) {
        return (
          <div className='ontology-ribbon__about'>
            {subject &&
              <SpeciesIcon species={speciesName} hideText={hideText} {...iconProps}/>
            }
            <div  className='ontology-ribbon__about' style={{
                  margin: '2px',
                  padding: '5px',
                  textAlign: 'center',
                }}>
              {!hideText && <i>{speciesName}</i>}
            </div>

            {!fetching && subject && title &&
              <div  className='ontology-ribbon__about'
                    style={{
                      margin: '2px',
                      padding: '5px',
                      textAlign: 'center',
                      marginBottom: '10px',
                      textDecoration: 'none',
                    }}
              >
                <a href={`http://amigo.geneontology.org/amigo/gene_product/` +
                          this.patchSubject(subject)}
                    className='go-link'>
                  {this.getLabel(title)}
                  <FaExternalLink style={{marginLeft: 5, textDecoration: 'none'}}/>
                </a>
              </div>
            }
            {!fetching && !subject && title &&
              // no subject, so just provide a linkless title
              <div  className='ontology-ribbon__about' style={{
                    margin: '2px',
                    padding: '5px',
                    textAlign: 'center',
                  }}>
                {title}
              </div>
            }
            </div>
        );
    }
    else {
        return <div></div>;
    }
  }

  /**
   * https://github.com/geneontology/go-site/issues/91
   * @param inputSubject
   * @returns {*}
   */
  patchSubject(inputSubject){
      if(inputSubject.startsWith('MGI') && !inputSubject.startsWith('MGI:MGI:')){
          return 'MGI:'+inputSubject;
      }
      return inputSubject;
  }

  getLabel(title) {
      return (
        (title.indexOf(' ')>=0 ? title.split(' ')[0] : title)
        + ' annotations at GO');
  }
}

GeneAbout.propTypes = {
    subject: PropTypes.string,
    fetching: PropTypes.bool,
    title: PropTypes.string,
    hideText: PropTypes.bool,
};
