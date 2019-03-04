'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import RibbonSpeciesIcon from './RibbonSpeciesIcon';
import FaExternalLink from 'react-icons/lib/fa/external-link';

import {getPrefixForId} from './../dataHelpers';

export default class GeneAbout extends React.Component {

  getLabel(title) {
    return (
      (title.indexOf(' ') >= 0 ? title.split(' ')[0] : title)
    );
  }

  render() {
    const {subject, protein_id, annot_url, hideText, fetching, title, currentblock, ...iconProps} = this.props;

    let speciesName = getPrefixForId(subject);
    // prepend MGI for the doublet form for linking out to AmiGO
    let subject_id = (subject.startsWith('MGI') && !subject.startsWith('MGI:MGI:')) ?
      'MGI:' + subject :
      subject;

    speciesName = speciesName ? speciesName : subject;

      let active_term = currentblock ? ' ' + currentblock.class_label : null;

    let isValid = Object.values(prefixToSpecies).indexOf(speciesName) >= 0;
    if (isValid) {
      return (
        <div className='ontology-ribbon__about'>
          {subject &&
            <RibbonSpeciesIcon species={speciesName} {...iconProps} />
          }
          <span>
            <span className='ontology-ribbon__about-text' style={{fontStyle: 'italic'}}>
              {!hideText && speciesName}
            </span>
            {!fetching && subject && title &&
              <span className='ontology-ribbon__about-text'>
                <a
                  className='ribbon-link'
                  href={annot_url(subject_id, protein_id, currentblock)}
                  rel='noopener noreferrer'
                  style={{marginRight: '.5rem'}}
                  target='_blank'
                >
                  {this.getLabel(title)}
                  {active_term ? active_term.toLowerCase() : ''}
                  <FaExternalLink size={18} style={{paddingLeft: 10, textDecoration: 'none', boxSizing: 'content-box'}} />
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
  annot_url: PropTypes.func,
  currentblock: PropTypes.object,
  fetching: PropTypes.bool,
  hideText: PropTypes.bool,
  protein_id: PropTypes.string,
  subject: PropTypes.string,
  title: PropTypes.string,
};
