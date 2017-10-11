import React from 'react';
import PropTypes from 'prop-types';

import SpeciesIcon from './SpeciesIcon';

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

const SpeciesLabel = (props) => {
  const {species, ...iconProps} = props;
  const speciesName = taxonomyToSpecies[species] || species;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <SpeciesIcon
        species={speciesName}
        {...iconProps}
      />
      {speciesName}
    </div>
  );
};

SpeciesLabel.propTypes = {
  species: PropTypes.string,
};

export default SpeciesLabel;
