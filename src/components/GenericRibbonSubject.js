'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GenericRibbonItem from './GenericRibbonItem';
import GenericRibbonSubjectLabel from './GenericRibbonSubjectLabel';
import { POSITION, SELECTION } from '../enums';

class GenericRibbonSubject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: props.categories,
      subject: props.subject,

      selected : props.selected,
      selectionMode : props.selectionMode,

      showItemAll : props.showItemAll,

      hideLabel: props.hideLabel,
      newTab : props.newTab,
      useTaxonIcon : props.useTaxonIcon,
      subjectLabelPosition: props.subjectLabelPosition,
      subjectBaseURL : props.subjectBaseURL,

      classLabels: props.classLabels,
      annotationLabels: props.annotationLabels,
      colorBy: props.colorBy,
      binaryColor: props.binaryColor,
      minColor: props.minColor,
      maxColor: props.maxColor,
      maxHeatLevel: props.maxHeatLevel,

      itemEnter : props.itemEnter,
      itemLeave : props.itemLeave,
      itemOver : props.itemOver,
      itemClick : props.itemClick
    }
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      categories: nextProps.categories,
      subject: nextProps.subject,

      selected : nextProps.selected,
      selectionMode : nextProps.selectionMode,

      showItemAll : nextProps.showItemAll,

      hideLabel: nextProps.hideLabel,
      newTab : nextProps.newTab,
      useTaxonIcon : nextProps.useTaxonIcon,
      subjectLabelPosition: nextProps.subjectLabelPosition,
      subjectBaseURL : nextProps.subjectBaseURL,

      classLabels: nextProps.classLabels,
      annotationLabels: nextProps.annotationLabels,
      colorBy: nextProps.colorBy,
      binaryColor: nextProps.binaryColor,
      minColor: nextProps.minColor,
      maxColor: nextProps.maxColor,
      maxHeatLevel: nextProps.maxHeatLevel,

      itemEnter : nextProps.itemEnter,
      itemLeave : nextProps.itemLeave,
      itemOver : nextProps.itemOver,
      itemClick : nextProps.itemClick
    });
  }


  render() {
    // console.log("GRS: ", this.state);
    // console.log('subject: ', this.state.subject);
    // console.log("GRS(" + this.state.subject.id + ")::render (state): ", this.state);
    return (
      <div className='ontology-ribbon__strip'>

        { (this.state.subjectLabelPosition == POSITION.LEFT && !this.state.hideLabel) &&
          (this.props.subjectLabel ?
            <div className='ontology-ribbon__item__subject'>{this.props.subjectLabel(this.state.subject)}</div> :
            <GenericRibbonSubjectLabel subjectId={this.state.subject.id}
                                       subjectLabel={this.state.subject.label}
                                       subjectTaxon={this.state.subject.taxon_label}
                                       subjectBaseURL={this.state.subjectBaseURL}
                                       useTaxonIcon={this.state.useTaxonIcon}
                                       newTab={this.state.newTab}
            />
          )
        }

        { (this.state.showItemAll) ?
          <div  className='ontology-ribbon__item__category'>
          <GenericRibbonItem          subject={this.state.subject}
                                      group={
                                        {
                                          "id" : "all",
                                          "label" : "All annotations",
                                          "description" : "Show all annotations",
                                          "type" : "GlobalAll"
                                        }
                                      }
                                      data={
                                        {
                                          "ALL": {
                                            "nb_classes" : this.state.subject.nb_classes,
                                            "nb_annotations": this.state.subject.nb_annotations
                                          }
                                        }
                                      }

                                      isSelected={
                                        (this.state.selected && this.state.selected.subject && this.state.selected.group)
                                            ? (this.state.selectionMode == SELECTION.CELL && this.state.selected.subject.id == this.state.subject.id && this.state.selected.group.id == "all")
                                              || 
                                              (this.state.selectionMode == SELECTION.COLUMN && this.state.selected.group.id == "all")
                                            : false
                                      }


                                      classLabels={this.state.classLabels}
                                      annotationLabels={this.state.annotationLabels}
                                      colorBy={this.state.colorBy}
                                      binaryColor={this.state.binaryColor}
                                      minColor={this.state.minColor}
                                      maxColor={this.state.maxColor}
                                      maxHeatLevel={this.state.maxHeatLevel}

                                      itemEnter={this.state.itemEnter}
                                      itemLeave={this.state.itemLeave}
                                      itemOver={this.state.itemOver}
                                      itemClick={this.state.itemClick}

                                      />
                                      </div>
                                      : ''
        }

        {
          this.state.categories.map((category) => {
            return (
              <div  className='ontology-ribbon__item__category'
                    key={this.state.subject + "_" + category.id}>
              {
                category.groups.map((group, index) => {
                  return (
                    <GenericRibbonItem  subject={this.state.subject}
                                        group={group}
                                        data={this.state.subject.groups[group.id + (group.type == "Other" ? "-other" : "")]}

                                        isSelected={
                                          (this.state.selected && this.state.selected.subject && this.state.selected.group)
                                              ? 
                                              (this.state.selectionMode == SELECTION.CELL && this.state.selected.subject.id == this.state.subject.id && this.state.selected.group.id == group.id && this.state.selected.group.type == group.type)
                                              ||
                                              (this.state.selectionMode == SELECTION.COLUMN && this.state.selected.group.id == group.id && this.state.selected.group.type == group.type)
                                              : false
                                        }

                                        classLabels={this.state.classLabels}
                                        annotationLabels={this.state.annotationLabels}
                                        colorBy={this.state.colorBy}
                                        binaryColor={this.state.binaryColor}
                                        minColor={this.state.minColor}
                                        maxColor={this.state.maxColor}
                                        maxHeatLevel={this.state.maxHeatLevel}

                                        itemEnter={this.state.itemEnter}
                                        itemLeave={this.state.itemLeave}
                                        itemOver={this.state.itemOver}
                                        itemClick={this.state.itemClick}

                                        key={this.state.subject + "_" + category.id + "_" + group.id + "_" + index} />
                  )
                })
              }
              </div>
            )

          })

        }

        { (this.state.subjectLabelPosition == POSITION.RIGHT && !this.state.hideLabel) &&
          (this.props.subjectLabel ?
            <div className='ontology-ribbon__item__subject'>{this.props.subjectLabel(this.state.subject)}</div> :
            <GenericRibbonSubjectLabel  subjectId={this.state.subject.id}
                                        subjectLabel={this.state.subject.label}
                                        subjectTaxon={this.state.subject.taxon_label}
                                        subjectBaseURL={this.state.subjectBaseURL}
                                        useTaxonIcon={this.state.useTaxonIcon}
                                        newTab={this.state.newTab}
                                        />
          )
        }
      </div>
    )

  }

}

GenericRibbonSubject.propTypes = {
  categories: PropTypes.array.isRequired,
  subject: PropTypes.object.isRequired,

  showItemAll : PropTypes.bool,
  selected : PropTypes.object,
  selectionMode : PropTypes.number,

  hideLabel: PropTypes.bool,
  newTab : PropTypes.bool,
  useTaxonIcon : PropTypes.bool,
  subjectLabel : PropTypes.func,
  subjectLabelPosition: PropTypes.number,
  subjectBaseURL : PropTypes.string,

  classLabels: PropTypes.array,
  annotationLabels: PropTypes.array,
  colorBy: PropTypes.number,
  binaryColor: PropTypes.bool,
  minColor: PropTypes.array,
  maxColor: PropTypes.array,
  maxHeatLevel: PropTypes.number,

  itemEnter : PropTypes.func,
  itemLeave : PropTypes.func,
  itemOver : PropTypes.func,
  itemClick : PropTypes.func
}

GenericRibbonSubject.defaultProps = {
}

export default GenericRibbonSubject;

