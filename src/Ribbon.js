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
        }
    }

    handleSlimEnter = (block) => {
        this.setState({
            focalblock: block,
        })
    };
    handleSlimLeave = (block) => {
        this.setState({
            focalblock: undefined,
        })
    };

    handleSlimSelect = (block) => {
        if (block !== this.state.currentblock) {
            this.setState({
                currentblock: block,
            });
        }
        else {
            this.setState({
                currentblock: undefined,
            })
        }
    };

    componentDidMount() {
        this.fetchSubject(this.props.subject, this.props.title)
    }

    fetchSubject = (subject, title) => {
        let self = this;
        if (subject.startsWith('HGNC:')) {
            axios.get('https://mygene.info/v3/query?q=' + subject + '&fields=uniprot')
                .then(function (results) {
                    let result = results.data.hits[0].uniprot['Swiss-Prot'];
                    self.setState({
                        fetching: false,
                        title: title,
                        subject: 'UniProtKB:' + result,
                    })
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
            })
        }
        else {
            this.setState({
                fetching: false,
                title: title,
                subject: subject,
            })
        }
    };

    render() {
        const blocks = this.props.blocks;
        return (
            <div>
                <RibbonBase
                    blocks={blocks}
                    currentblock={this.state.currentblock}
                    onSlimSelect={(block) => this.handleSlimSelect(block)}
                    onSlimEnter={(block) => this.handleSlimEnter(block)}
                    onSlimLeave={(block) => this.handleSlimLeave(block)}
                />

                {this.state.subject &&
                <GeneAbout
                    subject={this.state.subject}
                    fetching={this.state.fetching}
                    title={this.state.title}
                    currentblock={this.state.currentblock}
                />
                }

                <TransitionGroup>
                    {(this.state.showing || this.state.currentblock !== undefined) ?
                        <CSSTransition
                            classNames="fade"
                            timeout={{enter: 500, exit: 300}}
                        >
                            <AssociationsView
                                currentblock={this.state.currentblock}
                                focalblock={this.state.focalblock}
                                blocks={blocks}
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
    geneUrlFormatter: PropTypes.func.isRequired,
    title: PropTypes.string,
    blocks: PropTypes.array.isRequired,
    initialblock: PropTypes.string,
    subject: PropTypes.string,
    showing: PropTypes.bool.isRequired,
};
