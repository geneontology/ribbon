import React from 'react';
import PropTypes from 'prop-types';

import SpeciesIcon from './SpeciesIcon';

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

    if (idSplit.length !== 2) return null;

    return prefixToSpecies[idSplit[0]];

}

const SpeciesLabel = (props) => {
    const {species,hideText, ...iconProps} = props;
    let speciesName = taxonomyToSpecies[species];
    speciesName = speciesName ? speciesName : getPrefixForId(species);
    speciesName = speciesName ? speciesName : species;

    let isValid = Object.values(taxonomyToSpecies).indexOf(speciesName) >= 0;

    if (isValid) {
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
                {!hideText &&
                <i>{speciesName}</i>
                }
            </div>
        );
    }
    else {
        return <div></div>;
    }
};

SpeciesLabel.propTypes = {
    species: PropTypes.string,
    hideText: PropTypes.bool,
};

export default SpeciesLabel;
