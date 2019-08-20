'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { COLOR_BY, POSITION } from '../enums';

import GenericRibbonHeader from './GenericRibbonHeader';
import GenericRibbonSubjects from './GenericRibbonSubjects';

class GenericRibbonTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns : props.columns,
            rows: props.rows
        }
    }

    render() {
        if(!this.state.columns || !this.state.rows) {
            return("");
        }

        drawHeader();
        drawRows();
    }

    drawHeader() {

    }

    drawRows() {

    }
    
}    
    
GenericRibbonTable.propTypes = {
    columns: PropTypes.object,
    rows: PropTypes.object
};
