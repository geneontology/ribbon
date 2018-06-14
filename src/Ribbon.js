import React, {Component} from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';

import RibbonBase from './RibbonBase';
import AssociationsView from './view/AssociationsView';
import GeneAbout from './view/GeneAbout';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Ribbon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTermId: undefined,
            fetching: false,
            hoveredTermId: undefined,
        }
    }

    handleSlimEnter = (termId) => {
        this.setState({
            hoveredTermId: termId,
        })
    };
    handleSlimLeave = (termId) => {
        this.setState({
            hoveredTermId: undefined,
        })
    };

    handleSlimSelect = (termId) => {
        if (termId !== this.state.currentTermId) {
            this.setState({
                currentTermId: termId,
            });
        }
        else {
            this.setState({
                currentTermId: undefined,
            })
        }
    };

    handle

    getTermLabel = (termId) => {
        return this.props.blocks.reduce((termLabel, item) => {
            return termLabel || (termId === item.class_id ? item.class_label : null);
        }, null);
    };

    componentDidMount() {
        this.fetchSubject(this.props.subject, this.props.title)
    }

    fetchSubject = (subject, title) => {
        let self = this;
        if (subject.startsWith('HGNC:')) {
            axios.get('https://mygene.info/v3/query?q='+subject+'&fields=uniprot')
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
                    currentTermId={this.state.currentTermId}
                    onSlimSelect={(termId) => this.handleSlimSelect(termId)}
                    onSlimEnter={(termId) => this.handleSlimEnter(termId)}
                    onSlimLeave={(termId) => this.handleSlimLeave(termId)}
                />

                {this.state.subject &&
                  <GeneAbout
                      subject={this.state.subject}
                      fetching={this.state.fetching}
                      title={this.state.title}
                  />
                }

                <ReactCSSTransitionGroup transitionName='fade'
                                         transitionEnterTimeout={500}
                                         transitionLeaveTimeout={300}
                >
                  {(this.state.showing || this.state.currentTermId !== undefined) &&
                      <AssociationsView
                          currentTermId={this.state.currentTermId}
                          hoveredTermId={this.state.hoveredTermId}
                          blocks={blocks}
                          geneUrlFormatter={this.props.geneUrlFormatter}
                      />
                  }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}


Ribbon.propTypes = {
    geneUrlFormatter: PropTypes.func.isRequired,
    title: PropTypes.string,
    blocks: PropTypes.array.isRequired,
    initialTermId: PropTypes.string,
    subject: PropTypes.string,
    showing: PropTypes.bool.isRequired,
};
