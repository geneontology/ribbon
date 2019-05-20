'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { COLOR_BY, POSITION } from '../enums';

import GenericRibbonHeader from './GenericRibbonHeader';
import GenericRibbonLine from './GenericRibbonLine';

class GenericRibbon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: props.categories,
            subjects: props.subjects,
            entityLabelPosition: props.entityLabelPosition,
            classLabels: props.classLabels,
            annotationLabels: props.annotationLabels,
            colorBy: props.colorBy,
            binaryColor: props.binaryColor,
            minColor: props.minColor,
            maxColor: props.maxColor,
            maxHeatLevel: props.maxHeatLevel,
            isValid: props.subjects.length > 0,

            entityEnter : null,
            entityLeave : null,
            entityClick : null,

            blockEnter : null,
            blockLeave : null,
            blockClick : null            
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
        console.log("GENERIC RIBBON: ", this.state);
        return (
            <div>
                {this.state.isValid ?
                    this.renderRibbon() :
                    "An error occured, please check you provided a valid subject (" + this.state.subjects + ")"
                }
            </div>
        )
    }

    renderRibbon() {

        var subjects = this.state.subjects.map((subject, index) => {
            return (
                <GenericRibbonLine subject={subject} key={index} />
            )
        });


        return (
            <div>
                <GenericRibbonHeader categories={this.state.categories}/>

                <h2>Subjects</h2>
                {subjects}
            </div>
        )
    }

}

GenericRibbon.propTypes = {
    categories: PropTypes.array.isRequired,
    subjects: PropTypes.array.isRequired,

    entityLabelPosition: PropTypes.number,
    classLabels: PropTypes.array,
    annotationLabels: PropTypes.array,
    colorBy: PropTypes.number,
    binaryColor: PropTypes.bool,
    minColor: PropTypes.array,
    maxColor: PropTypes.array,
    maxHeatLevel: PropTypes.number,

    entityEnter : PropTypes.func,
    entityLeave : PropTypes.func,
    entityClick : PropTypes.func,
    
    blockEnter : PropTypes.func,
    blockLeave : PropTypes.func,
    blockClick : PropTypes.func    
}

GenericRibbon.defaultProps = {
    entityLabelPosition: POSITION.RIGHT,
    classLabels: ["class", "classes"],
    annotationLabels: ["annotation", "annotations"],
    colorBy: COLOR_BY.CLASS_COUNT,
    binaryColor: false,
    minColor: [255, 255, 255],
    maxColor: [24, 73, 180],
    maxHeatLevel: 48
}

export default GenericRibbon;