'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import RibbonSpeciesIcon from '../view/RibbonSpeciesIcon'

class GenericRibbonSubjectLabel extends Component {


  constructor(props) {
    super(props);
    this.state = {
      subjectId : props.subjectId,
      show : props.show
    }
  }
  
  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  render() {
    return (
      <div  className={!this.props.hide ? 'ontology-ribbon__item__category' : ''}
            
              >
          <a href={"http://amigo.geneontology.org/amigo/gene_product/" + this.props.subjectId.replace("MGI:", "MGI:MGI:")} className="ontology-ribbon__label ribbon-link" target="blank"

              >
              <RibbonSpeciesIcon species={this.getPrefixForId(this.props.subjectId)} />
              {this.props.subjectLabel}
          </a>
      </div>
    )
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
  hide : PropTypes.bool
}

GenericRibbonSubjectLabel.defaultProps = {
  hide : false
}

export default GenericRibbonSubjectLabel;