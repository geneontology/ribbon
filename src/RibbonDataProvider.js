import React, {Component} from 'react'
import PropTypes from 'prop-types';

import axios from 'axios';

import {unpackSlimItems} from './dataHelpers';

import AGR_LIST from './data/agr';
import TCAG_LIST from './data/tcag';
import FLY_LIST from './data/fly';
import JAX_LIST from './data/jax';
import POMBE_LIST from './data/pombe';

const GOLINK = 'https://api.monarchinitiative.org/api/';

export default class Ribbon extends React.Component {
    static propTypes = {
        subject: PropTypes.string.isRequired,
        slim: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
        };
        this.fetchData = this.fetchData.bind(this);
        this.setState = this.setState.bind(this);
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

    fetchData(slim, subject) {
        console.log('slim: ' + slim)
        let slimList = slim.toLowerCase() === 'tcag' ? TCAG_LIST :
            slim.toLowerCase() === 'fly' ? FLY_LIST :
                slim.toLowerCase() === 'agr' ? AGR_LIST :
                    slim.toLowerCase() === 'jax' ? JAX_LIST :
                        slim.toLowerCase() === 'pombe' ? POMBE_LIST :
                            AGR_LIST;
        let goLink = GOLINK + 'bioentityset/slimmer/function?';
        slimList.forEach(function (slimitem) {
            if (slimitem.separator === undefined) {
                goLink = goLink + '&slim=' + slimitem.goid;
            }
        });

        let title = subject;
        let dataError = null;
        let self = this;

        axios.get(goLink + '&subject=' + subject)
            .then(function (results) {
                console.log(results);
                let renderedData = {} ;
                for(let d of results.data){
                    let goid = d.assocs[0].object.id;
                    let golabel = d.assocs[0].object.label;

                    if(renderedData[goid]){
                        renderedData[goid].uniqueAssocs.push(d.assocs);
                    }
                    else{
                        renderedData[goid] = {
                            goid: goid,
                            golabel: golabel,
                            uniqueAssocs: d.assocs,
                            tree: [],
                            color: '#fff',
                        };
                    }
                }

                self.setState({
                    fetching: false,
                    title: subject,
                    dataError: null,
                    data: Object.values(renderedData)
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
    }

    handleSlimSelect = (termId) => {
        this.setState({
            currentTermId: termId
        });
    };

    render() {
        const {title, data, dataError, fetching} = this.state;
        return this.props.children({
            title,
            data,
            dataError,
            dataReceived: !fetching && !dataError,
        });
    }
}
