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
    this.fetchSubject(this.props.subject, this.props.title);
  }

  handleSlimEnter (block) {
    this.setState({
      focalblock: block,
    });
  }

  handleSlimLeave () {
    this.setState({
      focalblock: undefined,
    });
  }

  handleSlimSelect (block) {
    if (block !== this.state.currentblock) {
      this.setState({
        currentblock: block,
      });
    }
    else {
      this.setState({
        currentblock: undefined,
      });
    }
  }

  fetchSubject (subject, title) {
    let self = this;
    if (subject.startsWith('HGNC:')) {
      axios.get('https://mygene.info/v3/query?q=' + subject + '&fields=uniprot')
        .then(function (results) {
          let result = results.data.hits[0].uniprot['Swiss-Prot'];
          self.setState({
            fetching: false,
            title: title,
            subject: 'UniProtKB:' + result,
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
      this.setState({
        fetching: false,
        title: title,
        subject: subject,
      });
    }
  }

  render() {
    const blocks = this.props.blocks;
    return (
      <div>
        <RibbonBase
          blocks={blocks}
          currentblock={this.state.currentblock}
          onSlimEnter={(block) => this.handleSlimEnter(block)}
          onSlimLeave={() => this.handleSlimLeave()}
          onSlimSelect={(block) => this.handleSlimSelect(block)}
        />

        {this.state.subject &&
        <GeneAbout
          currentblock={this.state.currentblock}
          fetching={this.state.fetching}
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
                currentblock={this.state.currentblock}
                focalblock={this.state.focalblock}
                geneUrlFormatter={this.props.geneUrlFormatter}
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
  geneUrlFormatter: PropTypes.func.isRequired,
  initialblock: PropTypes.string,
  showing: PropTypes.bool.isRequired,
  subject: PropTypes.string,
  title: PropTypes.string,
};
