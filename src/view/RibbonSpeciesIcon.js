import React from 'react';
import PropTypes from 'prop-types';



const sizeToScale = {
  small: 0.4,
  medium: 0.7,
  large: 1,
};

const RibbonSpeciesIcon = ({species, theme, size}) => {
  const speciesClass = species.replace(' ', '-');
  const scale = sizeToScale[size];

  return (
    <span
      className={`ontology-ribbon__species-icon--${theme} ${speciesClass}`}
      title={species}
    />
  );
};

RibbonSpeciesIcon.defaultProps = {
  theme: 'agr',
  size: 'small',
};

RibbonSpeciesIcon.propTypes = {
  size: PropTypes.string,
  species: PropTypes.string.isRequired,
  theme: PropTypes.string,
};

export default RibbonSpeciesIcon;
