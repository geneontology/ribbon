'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';

import RibbonBase from './RibbonBase';
import AssociationsView from './view/AssociationsView';
import GeneAbout from './view/GeneAbout';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

export default class Ribbon extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentEntity: undefined,
      currentblock: undefined,
      fetching: false,
      focalblock: undefined,
    };
  }

  componentDidMount() {
    // have to correct this
    // this.patchHGNC(this.props.subject, this.props.title);
  }

  handleSlimEnter (block) {
    let self = this;
    self.setState({
      focalblock: block,
    });
  }

  handleSlimLeave () {
    let self = this;
    self.setState({
      focalblock: undefined,
    });
  }

  handleSlimSelect (entity, block) {
    let self = this;
    if (block !== this.state.currentblock) {
      self.setState({
        currentblock: block,
        currentEntity: entity
      });
    } else {
      self.setState({
        currentblock: undefined,
        currentEntity: undefined
      });
    }
  }

  patchHGNC (subject, title) {
    let self = this;
    if (subject.startsWith('HGNC:')) {
      axios.get('https://mygene.info/v3/query?q=' + subject + '&fields=uniprot')
        .then(function (results) {
          let result = results.data.hits[0].uniprot['Swiss-Prot'];
          self.setState({
            fetching: false,
            title: title,
            protein_id: 'UniProtKB:' + result,
            subject: subject,
          });
        }).catch(function (error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            console.log('Unable to get data for ' + subject + ' because ' + error.status);
          } else if (error.request) {
            console.log(error.request);
            console.log('Unable to get data for ' + subject + ' because ' + error.request);
          } else {
            console.log(error.message);
            console.log('Unable to get data for ' + subject + ' because ' + error.message);
          }
          self.setState({
            fetching: false,
            title: title,
            subject: undefined
          });
        });
    }
    else {
      self.setState({
        fetching: false,
        title: title,
        protein_id: undefined,
        subject: subject,
      });
    }
  }

  render() {
    const config = this.props.config;

    // Building the filters Map for ALL entities
    const filters = new Map();
    for(let entity of this.props.entities) {
      for(let [filter, value] of entity.filters) {
        if(!filters.has(filter)) {
          filters.set(filter, true);
        }
      }
    }
    console.log("all filters: ", filters);

    return (
      <div>
        
        {
          this.props.entities.map((entity, index) => {
            return <RibbonBase 
              entity={entity}
              blocks={entity.blocks}
              title={entity.title}
              config={config}
              currentEntity={this.state.currentEntity}
              currentblock={this.state.currentblock}
              onSlimEnter={(block) => this.handleSlimEnter(block)}
              onSlimLeave={() => this.handleSlimLeave()}
              onSlimSelect={(entity, block) => this.handleSlimSelect(entity, block)}
              showBlockTitles={index === 0}
              key={entity.subject}
          />
          })
        }

        {
          this.state.subject &&
          <GeneAbout
            annot_url={this.props.config.annot_url}
            currentblock={this.state.currentblock}
            fetching={this.state.fetching}
            protein_id={this.state.protein_id}
            subject={this.state.subject}
            title={this.state.title}
          />
        }

        <TransitionGroup>
          {(this.state.showing || this.state.currentblock !== undefined) ?
            <CSSTransition
              classNames="fade"
              timeout={{enter: 500, exit: 300}}
            >
              <AssociationsView
                blocks={this.state.currentEntity.blocks}
                config={config}
                currentblock={this.state.currentblock}
                filters={filters}
                focalblock={this.state.focalblock}
              />
            </CSSTransition> :
            null
          }
        </TransitionGroup>

      </div>
    );
  }
}

Ribbon.propTypes = {
  entities : PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  showing: PropTypes.bool.isRequired,
};
