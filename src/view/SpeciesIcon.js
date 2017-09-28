import React from 'react';
import PropTypes from 'prop-types';

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

const sizeToScale = {
  small: 0.4,
  medium: 0.7,
  large: 1,
};

const SpeciesIcon = ({species, theme, size}) => {
  const speciesName = taxonomyToSpecies[species] || species;
  const speciesClass = speciesName.replace(' ', '-');

  return (
    <span
      className={`ontology-ribbon-species-icon_${theme} ${speciesClass}`}
      style={{
        transform: `scale(${sizeToScale[size]})`,
        transformOrigin: '0 0',
      }}
      title={speciesClass}
    />
  );
};

SpeciesIcon.defaultProps = {
  theme: 'agr',
  size: 'small',
};

SpeciesIcon.propTypes = {
  size: PropTypes.string,
  species: PropTypes.string.isRequired,
  theme: PropTypes.string,
};

export default SpeciesIcon;
