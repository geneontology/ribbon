'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { COLOR_BY, POSITION } from '../enums';

import GenericRibbonHeader from './GenericRibbonHeader';
import GenericRibbonSubjects from './GenericRibbonSubjects';

class GenericRibbon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: props.categories,
            subjects: props.subjects,

            showItemAll : props.showItemAll,

            hideFirstSubjectLabel : props.hideFirstSubjectLabel,
            subjectUseTaxonIcon : props.subjectUseTaxonIcon,
            subjectLabelPosition: props.subjectLabelPosition,
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

    componentWillReceiveProps(nextProps){
        // console.log("GR::componentWillReceiveProps: " , nextProps);
        this.setState({
            categories: nextProps.categories,
            subjects: nextProps.subjects,

            showItemAll : nextProps.showItemAll,

            hideFirstSubjectLabel : nextProps.hideFirstSubjectLabel,
            subjectUseTaxonIcon : nextProps.subjectUseTaxonIcon,
            subjectLabelPosition: nextProps.subjectLabelPosition,
            subjectBaseURL : nextProps.subjectBaseURL,

            classLabels: nextProps.classLabels,
            annotationLabels: nextProps.annotationLabels,
            colorBy: nextProps.colorBy,
            binaryColor: nextProps.binaryColor,
            minColor: nextProps.minColor,
            maxColor: nextProps.maxColor,
            maxHeatLevel: nextProps.maxHeatLevel,
            isValid: nextProps.subjects.length > 0,

            subjectEnter : nextProps.subjectEnter,
            subjectLeave : nextProps.subjectLeave,
            subjectOver : nextProps.subjectOver,
            subjectClick : nextProps.subjectClick,

            itemEnter : nextProps.itemEnter,
            itemLeave : nextProps.itemLeave,
            itemOver : nextProps.itemOver,
            itemClick : nextProps.itemClick    
        });
        // console.log("GR::componentWillReceiveProps: (state)" , this.state);
    }


    render() {
        // console.log("GR::render:", this.state);
        return (
            <div>
                {this.state.isValid ?
                    this.renderRibbon() :
                    "Please provide at least one subject to display the ribbon"
                }
            </div>
        )
    }

    renderRibbon() {
        return (
            <div className='ontology-ribbon' style={{ display: 'block' }}>
                <GenericRibbonHeader    categories={this.state.categories}
                                        addSubjectLabelWidth={(!this.state.hideFirstSubjectLabel) || (this.state.hideFirstSubjectLabel && this.state.subjects.length > 1)}
                                        subjectLabelPosition={this.state.subjectLabelPosition} 
                                        showItemAll={this.state.showItemAll}
                                        />
                <GenericRibbonSubjects  categories={this.state.categories} 
                                        subjects={this.state.subjects} 

                                        showItemAll={this.state.showItemAll}
                                        classLabels={this.state.classLabels}
                                        annotationLabels={this.state.annotationLabels}

                                        colorBy={this.state.colorBy} 
                                        binaryColor={this.state.binaryColor} 
                                        minColor={this.state.minColor}
                                        maxColor={this.state.maxColor}
                                        maxHeatLevel={this.state.maxHeatLevel} 

                                        hideFirstSubjectLabel={this.state.hideFirstSubjectLabel}
                                        subjectUseTaxonIcon={this.state.subjectUseTaxonIcon}
                                        subjectLabelPosition={this.state.subjectLabelPosition}
                                        subjectBaseURL={this.state.subjectBaseURL}
                                        
                                        itemEnter={this.state.itemEnter}
                                        itemLeave={this.state.itemLeave}
                                        itemOver={this.state.itemOver}
                                        itemClick={this.state.itemClick} 
                                        />
            </div>
        )
    }

}

GenericRibbon.propTypes = {
    categories: PropTypes.array.isRequired,
    subjects: PropTypes.array.isRequired,

    showItemAll : PropTypes.bool,

    hideFirstSubjectLabel : PropTypes.bool,
    subjectUseTaxonIcon : PropTypes.bool,
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

GenericRibbon.defaultProps = {
    hideFirstSubjectLabel : false,
    subjectUseTaxonIcon : true,
    showItemAll : true,
    subjectLabelPosition: POSITION.RIGHT,
    classLabels: ["class", "classes"],
    annotationLabels: ["annotation", "annotations"],
    colorBy: COLOR_BY.CLASS_COUNT,
    binaryColor: false,
    minColor: [255, 255, 255],
    maxColor: [24, 73, 180],
    maxHeatLevel: 48,

    subjectBaseURL : "http://amigo.geneontology.org/amigo/gene_product/"
    // subjectBaseURL : "https://www.alliancegenome.org/gene/"

}

export default GenericRibbon;