'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GenericRibbonSubject from './GenericRibbonSubject';

class GenericRibbonSubjects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories : props.categories,
            subjects: props.subjects,

            showItemAll : props.showItemAll,

            subjectLabelPosition : props.subjectLabelPosition,
            subjectBaseURL : props.subjectBaseURL,

            classLabels: props.classLabels,
            annotationLabels: props.annotationLabels,
            colorBy: props.colorBy,
            binaryColor: props.binaryColor,
            minColor: props.minColor,
            maxColor: props.maxColor,
            maxHeatLevel: props.maxHeatLevel,
            isValid: props.subjects.length > 0,

            subjectEnter : props.subjectEnter,
            subjectLeave : props.subjectLeave,
            subjectOver : props.subjectOver,
            subjectClick : props.subjectClick,

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

    render() {
        console.log("GRSS::render (state): ", this.state);
        return (
            <div className='ontology-ribbon__subjects'>
                {
                    this.state.subjects.map((subject, index) => {
                        return (
                            <GenericRibbonSubject   categories={this.state.categories} 
                                                    subject={subject} 

                                                    showItemAll={this.state.showItemAll}
                                                    classLabels={this.state.classLabels}
                                                    annotationLabels={this.state.annotationLabels}
            
                                                    colorBy={this.state.colorBy} 
                                                    binaryColor={this.state.binaryColor} 
                                                    minColor={this.state.minColor}
                                                    maxColor={this.state.maxColor}
                                                    maxHeatLevel={this.state.maxHeatLevel}    

                                                    subjectLabelPosition={this.state.subjectLabelPosition}
                                                    subjectBaseURL={this.state.subjectBaseURL}
                                                    
                                                    itemEnter={this.state.itemEnter}
                                                    itemLeave={this.state.itemLeave}
                                                    itemOver={this.state.itemOver}
                                                    itemClick={this.state.itemClick}

                                                    key={"subject_" + index} />
                        )
                    })
                }
            </div>
        )

    }

}

GenericRibbonSubjects.propTypes = {
    categories: PropTypes.array.isRequired,
    subjects: PropTypes.array.isRequired,

    showItemAll : PropTypes.bool,

    subjectLabelPosition: PropTypes.number,
    subjectBaseURL : PropTypes.string,

    classLabels: PropTypes.array,
    annotationLabels: PropTypes.array,
    colorBy: PropTypes.number,
    binaryColor: PropTypes.bool,
    minColor: PropTypes.array,
    maxColor: PropTypes.array,
    maxHeatLevel: PropTypes.number,

    subjectEnter : PropTypes.func,
    subjectLeave : PropTypes.func,
    subjectOver : PropTypes.func,
    subjectClick : PropTypes.func,
    
    itemEnter : PropTypes.func,
    itemLeave : PropTypes.func,
    itemOver : PropTypes.func,
    itemClick : PropTypes.func    
}

GenericRibbonSubjects.defaultProps = {
}

export default GenericRibbonSubjects;
