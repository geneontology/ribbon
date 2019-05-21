'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GenericRibbonItem from './GenericRibbonItem';
import GenericRibbonSubjectLabel from './GenericRibbonSubjectLabel';
import { POSITION } from '../enums';

class GenericRibbonSubject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: props.categories,
      subject: props.subject,

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

  //   ontology-ribbon__block__tile--all
  render() {
    // console.log("Subject: ", this.state.subject);
    return (
      <div className='ontology-ribbon__strip'>

        { (this.state.subjectLabelPosition == POSITION.LEFT) ?
          <GenericRibbonSubjectLabel  subjectId={this.state.subject.id} 
                                      subjectLabel={this.state.subject.label}
                                      subjectBaseURL={this.state.subjectBaseURL} />
                                      : ''
        }      

        {
          this.state.categories.map((category, index) => {   
            return (
              <div  className='ontology-ribbon__item__category'
                    key={this.state.subject + "_" + category.id}>
              {
                category.groups.map((group, index) => {
                  return (
                    <GenericRibbonItem  subject={this.state.subject}
                                        group={group} 
                                        data={this.state.subject.groups[group.id]} 

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
        
        { (this.state.subjectLabelPosition == POSITION.RIGHT) ?
          <GenericRibbonSubjectLabel  subjectId={this.state.subject.id} 
                                      subjectLabel={this.state.subject.label}
                                      subjectBaseURL={this.state.subjectBaseURL} />
                                      : ''
        }
      </div>
    )

  }

}

GenericRibbonSubject.propTypes = {
  categories: PropTypes.array.isRequired,
  subject: PropTypes.object.isRequired,

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

