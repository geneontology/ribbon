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
      currentblock: undefined,
      fetching: false,
      focalblock: undefined,
    };
  }

  componentDidMount() {
    this.patchHGNC(this.props.subject, this.props.title);
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

  handleSlimSelect (block) {
    let self = this;
    if (block !== this.state.currentblock) {
      self.setState({
        currentblock: block,
      });
    }
    else {
      self.setState({
        currentblock: undefined,
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
    const blocks = this.props.blocks;
    const config = this.props.config;
    const eco_list = this.props.eco_list;
    return (
      <div>
        <RibbonBase
          blocks={blocks}
          config={config}
          currentblock={this.state.currentblock}
          onSlimEnter={(block) => this.handleSlimEnter(block)}
          onSlimLeave={() => this.handleSlimLeave()}
          onSlimSelect={(block) => this.handleSlimSelect(block)}
        />

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
                blocks={blocks}
                config={config}
                currentblock={this.state.currentblock}
                eco_list={eco_list}
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
  blocks: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  eco_list: PropTypes.object,
  showing: PropTypes.bool.isRequired,
  subject: PropTypes.string,
  title: PropTypes.string,
};
