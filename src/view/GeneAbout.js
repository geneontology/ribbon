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
        console.log('link target',block);
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

    render() {
        const {subject, hideText, fetching, title, currentblock, ...iconProps} = this.props;
        let speciesName = taxonomyToSpecies[subject];
        speciesName = speciesName ? speciesName : getPrefixForId(subject);

        speciesName = speciesName ? speciesName : subject;

        let active_term = currentblock ? ' to ' + currentblock.class_label : null;

        let isValid = Object.values(taxonomyToSpecies).indexOf(speciesName) >= 0;
        if (isValid) {
            return (
                <div className='ontology-ribbon__about'>
                    {subject &&
                    <SpeciesIcon species={speciesName} hideText={hideText} {...iconProps}/>
                    }
                    <span>
              <span className='ontology-ribbon__about-text' style={{fontStyle: 'italic'}}>
                {!hideText && speciesName}
              </span>
                        {!fetching && subject && title &&
                        <span className='ontology-ribbon__about-text'>
                  <a href={this.getLinkTarget(subject,currentblock)}
                     className='go-link' style={{marginRight: '.5rem'}}
                     target='_blank'
                  >
                    {this.getLabel(title)}
                      <FaExternalLink size={18} style={{paddingLeft: 10, textDecoration: 'none'}}/>
                      {active_term}
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
            return <div></div>;
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
            + ' annotations at GO');
    }
}

GeneAbout.propTypes = {
    subject: PropTypes.string,
    fetching: PropTypes.bool,
    title: PropTypes.string,
    hideText: PropTypes.bool,
};
