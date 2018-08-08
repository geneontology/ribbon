import React, {Component} from 'react'
import PropTypes from 'prop-types';

import axios from 'axios';

import {unpackSlimItems} from './dataHelpers';

import PHENO_LIST from './data/pheno';
import AGR_LIST from './data/agr';

const GOLINK = 'https://api.monarchinitiative.org/api/';

const defaultHeatColorArray = [63, 81, 181];
const defaultHeatLevels = 48;

export default class RibbonDataProvider extends React.Component {
    static propTypes = {
        subject: PropTypes.string.isRequired,
        slim: PropTypes.string,
        heatColorArray: PropTypes.array,
        heatLevels: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
        };
    }

    componentDidMount() {
        const {subject, slim} = this.props;
        let useslim = (typeof slim === "undefined" || slim === null)
            ? 'agr' : slim;
        this.setState({
            fetching: true,
        });
        this.fetchData(useslim, subject);
    }

    fetchData = (slim, subject) => {
        let slimlist = slim.toLowerCase() === 'pheno' ?
            PHENO_LIST :
            AGR_LIST;
        let goLink = slim.toLowerCase() === 'pheno' ?
            GOLINK + 'bioentityset/slimmer/phenotype?' :
            GOLINK + 'bioentityset/slimmer/function?';
        let title = subject;
        let dataError = null;
        let self = this;
        let {heatColorArray, heatLevels} = this.props;
        heatColorArray = heatColorArray ? heatColorArray : defaultHeatColorArray;
        heatLevels = heatLevels ? heatLevels : defaultHeatLevels;

        /*
          Build up the query string by adding all the GO ids
        */
        slimlist.forEach(function (slimitem) {
            if (slimitem.separator === undefined) {
                goLink = goLink + '&slim=' + slimitem.class_id;
            }
        });


        console.log('Query is ' + goLink + '&subject=' + subject);
        axios.get(goLink + '&subject=' + subject)
            .then(function (results) {
                const {title, blocks} = unpackSlimItems([results], subject, slimlist, heatColorArray, heatLevels);
                self.setState({
                    fetching: false,
                    title: title,
                    blocks: blocks,
                    subject: subject,
                    dataError: null,
                });
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    dataError = ('Unable to get data for ' +
                        subject +
                        ' because ' +
                        error.status);
                } else if (error.request) {
                    console.log(error.request);
                    dataError = ('Unable to get data for ' +
                        subject +
                        ' because ' +
                        error.request);
                } else {
                    console.log(error.message);
                    dataError = ('Unable to get data for ' +
                        subject +
                        ' because ' +
                        error.message);
                }
                self.setState({
                    fetching: false,
                    title: title,
                    dataError: dataError
                });
            });
    };

    render() {
        const {title, blocks, dataError, fetching} = this.state;
        let self = this;
        return this.props.children({
            title,
            blocks,
            dataError,
            dataReceived: !fetching && !dataError,
        });
    }
}
