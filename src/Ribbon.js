'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';

import RibbonBase from './RibbonBase';
import AssociationsView from './view/AssociationsView';
import GeneAbout from './view/GeneAbout';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import { COLOR_BY, POSITION } from './enums';

export default class Ribbon extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentEntity: undefined,
      currentblock: undefined,
      fetching: false,
      focalblock: undefined,
      focalEntity: undefined,
      entityLabel: this.props.entityLabel,
      classLabels: this.props.classLabels,
      annotationLabels: this.props.annotationLabels,

      minColor: this.props.minColor,
      maxColor: this.props.maxColor,
      colorBy : this.props.colorBy,
      maxHeatLevels: this.props.maxHeatLevels,
      binaryColor: this.props.binaryColor,

      tableLabel: this.props.tableLabel,
      oddEvenColor: this.props.oddEvenColor,
      borderBottom: this.props.borderBottom

    };
  }

  componentDidMount() {
    // have to correct this
    // this.patchHGNC(this.props.subject, this.props.title);
  }

  handleSlimEnter (entity, block) {
    let self = this;
    self.setState({
      focalEntity: entity,
      focalblock: block
    });
  }

  handleSlimLeave () {
    let self = this;
    self.setState({
      focalEntity: undefined,
      focalblock: undefined
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

    return (
      <div>
        
        {
          this.props.entities.map((entity, index) => {
            return <RibbonBase 
              entity={entity}
              blocks={entity.blocks}
              title={entity.label}
              config={config}
              currentEntity={this.state.currentEntity}
              currentblock={this.state.currentblock}
              onSlimEnter={(entity, block) => this.handleSlimEnter(entity, block)}
              onSlimLeave={() => this.handleSlimLeave()}
              onSlimSelect={(entity, block) => this.handleSlimSelect(entity, block)}
              showBlockTitles={index === 0}
              key={entity.subject}
              entityLabel={this.state.entityLabel}
              classLabels={this.state.classLabels}
              annotationLabels={this.state.annotationLabels}

              minColor={this.state.minColor}
              maxColor={this.state.maxColor}
              colorBy={this.state.colorBy}
              maxHeatLevels={this.state.maxHeatLevels}
              binaryColor={this.state.binaryColor}
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
                tableLabel={this.state.tableLabel}
                oddEvenColor={this.state.oddEvenColor}
                borderBottom={this.state.borderBottom}
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
    
  entityLabel: PropTypes.number,
  minColor: PropTypes.array,
  maxColor: PropTypes.array,
  colorBy: PropTypes.number,
  maxHeatLevels: PropTypes.number,
  binaryColor: PropTypes.bool,

  tableLabel: PropTypes.string,
  oddEvenColor: PropTypes.bool,
  borderBottom: PropTypes.bool

};

Ribbon.defaultProps = {
  classLabels: ["class", "classes"],
  annotationLabels: ["annotation", "annotations"],

  entityLabel: POSITION.RIGHT,    // position the entity label (.NONE, .LEFT, .RIGHT)
  minColor: [255, 255, 255],
  maxColor: [24, 73, 180],
  colorBy: COLOR_BY.CLASS_COUNT,  // color defined by .CLASS_COUNT or .ANNOTATION_COUNT
  maxHeatLevels : 48,             // increase or decrease the displayed intensity
  binaryColor : false,            // continuous or binary color
  
  tableLabel: "GO Annotations",
  oddEvenColor: true,
  borderBottom: false

};
