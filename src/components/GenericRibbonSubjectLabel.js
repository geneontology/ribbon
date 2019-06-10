'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import RibbonSpeciesIcon from '../view/RibbonSpeciesIcon'

class GenericRibbonSubjectLabel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      subjectId : props.subjectId,
      subjectLabel : props.subjectLabel,
      subjectTaxon : props.subjectTaxon,
      subjectBaseURL : props.subjectBaseURL,
      useTaxonIcon : props.useTaxonIcon,
      hide : props.hide,
      newTab : props.newTab
    }
  }
  
  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  getSubjectID() {
    if(this.state.subjectBaseURL.includes("amigo.geneontology.org")) {
      return this.state.subjectId.replace("MGI:", "MGI:MGI:");
    }
    return this.state.subjectId;
  }

  render() {
    return (
      <div  className={!this.state.hide ? 'ontology-ribbon__item__subject' : ''}
            title={this.state.subjectLabel + ((this.state.subjectTaxon) ? " (" + this.state.subjectTaxon + ")" : "") }
            >
            {
            (this.state.subjectBaseURL) ?
              <a href={ this.state.subjectBaseURL + this.getSubjectID()} className="ontology-ribbon__label ribbon-link" target={this.state.newTab ? '_blank' : '_self'}>
                  { this.state.useTaxonIcon ?   <span><RibbonSpeciesIcon species={this.getPrefixForId(this.state.subjectId)} /> {this.state.subjectLabel}</span>
                                            :   this.state.subjectLabel + "(" + this.species3LCode(this.state.subjectTaxon) + ")" }                  
              </a> :
              <span>
                  { this.state.useTaxonIcon ?   <span><RibbonSpeciesIcon species={this.getPrefixForId(this.state.subjectId)} /> {this.state.subjectLabel}</span>
                                            :   this.state.subjectLabel + "(" + this.species3LCode(this.state.subjectTaxon) + ")" }                  
              </span>
            }
      </div>
    )
  }

  species3LCode(species) {
    console.log('receive: ', species);
    var split = species.split("\s");
    return split[0].charAt(0) + split[1].substring(1, 3);
  }


  prefixToSpecies = {
    'HGNC': 'Homo sapiens',  // human
    'UniProtKB': 'Homo sapiens',  // human
    'MGI': 'Mus musculus',  // mouse
    'RGD': 'Rattus norvegicus',  // rat
    'ZFIN': 'Danio rerio',  // zebrafish
    'FB': 'Drosophila melanogaster',  // fly
    'FlyBase': 'Drosophila melanogaster',  // fly
    'WB': 'Caenorhabditis elegans',  // worm
    'SGD': 'Saccharomyces cerevisiae',  // yeast
  };
    
  getPrefixForId(inputId) {
    let idSplit = inputId.split(':');
    if (idSplit.length === 0)
      return null;
    return this.prefixToSpecies[idSplit[0]];
  }

}

GenericRibbonSubjectLabel.propTypes = {
  subjectId : PropTypes.string.isRequired,
  subjectLabel : PropTypes.string.isRequired,
  subjectBaseURL : PropTypes.string,
  subjectTaxon : PropTypes.string,
  useTaxonIcon : PropTypes.bool,
  hide : PropTypes.bool,
  newTab : PropTypes.bool
}

GenericRibbonSubjectLabel.defaultProps = {
  hide : false,
  newTab : PropTypes.bool
}

export default GenericRibbonSubjectLabel;