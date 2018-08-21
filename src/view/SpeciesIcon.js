import React from 'react';
import PropTypes from 'prop-types';



const sizeToScale = {
  small: 0.4,
  medium: 0.7,
  large: 1,
};

const SpeciesIcon = ({species, theme, size}) => {
  const speciesClass = species.replace(' ', '-');
  const scale = sizeToScale[size];

  return (
    <span
      className={`ontology-ribbon-species-icon_${theme} ${speciesClass}`}
      style={{
        height: 90 * scale,
        width: 80 * scale,
        margin: '2px',
        padding: 5,
      }}
      title={species}
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
