import React, {Component} from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';

import RibbonBase from './RibbonBase';
import AssociationsView from './view/AssociationsView';
import SpeciesLabel from './view/SpeciesLabel';
import {FaClose,FaAngleDoubleDown} from 'react-icons/lib/fa';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import FaExternalLink from 'react-icons/lib/fa/external-link';



export default class Ribbon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTermId: undefined,
            currentDomain: undefined,
            fetching: false,
            showing: this.props.showing,
            hoveredTermId: undefined,
            hoveredDomain: undefined,
        }
    }

    handleDomainEnter = (domain) => {
        this.setState({
            hoveredDomain: domain,
            hoveredTermId: undefined,
        })
    };
    handleDomainLeave = (domain) => {
        this.setState({
            hoveredDomain: undefined,
            hoveredTermId: undefined,
        })
    };
    handleSlimEnter = (termId) => {
        this.setState({
            hoveredDomain: undefined,
            hoveredTermId: termId,
        })
    };
    handleSlimLeave = (termId) => {
        this.setState({
            hoveredDomain: undefined,
            hoveredTermId: undefined,
        })
    };

    handleDomainSelect = (domain) => {
        if (domain !== this.state.currentDomain) {
            this.setState({
                currentDomain: domain,
                showing: true,
                currentTermId: undefined,
            });
        }
        else {
            this.setState({
                currentDomain: undefined,
                currentTermId: undefined
            })
        }
    };

    handleSlimSelect = (termId) => {
        if (termId !== this.state.currentTermId) {
            this.setState({
                currentTermId: termId,
                showing: true,
                currentDomain: undefined
            });
        }
        else {
            this.setState({
                currentTermId: undefined,
                currentDomain: undefined
            })
        }
    };

    getTermLabel = (termId) => {
        return this.props.slimlist.reduce((termLabel, item) => {
            return termLabel || (termId === item.goid ? item.golabel : null);
        }, null);
    };

    renderMessage = () => {
        if (this.state.currentTermId) {
            const currentTermLabel = this.getTermLabel(this.state.currentTermId);
            return (
                <div>
                    Showing associations for {<strong><em>{currentTermLabel}</em></strong>} only.
                    <button
                        type="button"
                        className="btn ontology-ribbon-filtered-message__button"
                        onClick={() => this.handleSlimSelect(null)}
                    >
                        Show all
                    </button>
                </div>
            );
        }
        else if (this.state.currentDomain) {
            return (
                <div>
                    Showing associations for {<strong><em>{this.state.currentDomain}</em></strong>} only.
                    <button
                        type="button"
                        className="btn ontology-ribbon-filtered-message__button"
                        onClick={() => this.handleDomainSelect(null)}
                    >
                        Show all
                    </button>
                </div>
            );
        }
    };

    groupByDomain = (slimlist) => {
        const dataByGroups = slimlist.reduce((results, item) => {
            const group = item.domain;
            if (results[group]) {
                results[group].push(item);
            } else {
                results[group] = [item];
            }
            return results;
        }, {});

        return ['molecular function', 'biological process', 'cellular component'].map((groupName) => (
            {
                label: groupName.charAt(0).toUpperCase() + groupName.slice(1),
                data: dataByGroups[groupName]
            }
        ));
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

    /**
     * https://github.com/geneontology/go-site/issues/91
     * @param inputSubject
     * @returns {*}
     */
    static patchSubject(inputSubject){
        if(inputSubject.startsWith('MGI')){
            return 'MGI:'+inputSubject;
        }
        return inputSubject;
    }


    render() {
        const slimlist = this.props.slimlist;
        return (
            <div>
                <RibbonBase
                    currentTermId={this.state.currentTermId}
                    onSlimSelect={(termId) => this.handleSlimSelect(termId)}
                    onDomainSelect={(domain) => this.handleDomainSelect(domain)}
                    onSlimEnter={(termId) => this.handleSlimEnter(termId)}
                    onDomainEnter={(domain) => this.handleDomainEnter(domain)}
                    onSlimLeave={(termId) => this.handleSlimLeave(termId)}
                    onDomainLeave={(domain) => this.handleDomainLeave(domain)}
                    groups={
                        this.groupByDomain(slimlist).map((group) => ({
                            ...group,
                            data: group.data.map((item) => ({
                                color: item.color,
                                id: item.goid,
                                label: item.golabel,
                                count: (item.uniqueAssocs || []).length,
                            }))
                        }))
                    }
                />
                <div className='ontology-ribbon'>
                    {this.state.subject &&
                    <SpeciesLabel species={this.state.subject}/>
                    }
                    <div className='ontology-ribbon__caption'>
                        {!this.state.fetching && this.state.subject && this.state.title &&
                        <a
                            href={`http://amigo.geneontology.org/amigo/gene_product/` + Ribbon.patchSubject(this.state.subject)}
                            className='go-link'
                        >
                            See All {this.getLabel(this.state.title)} Annotations
                            <FaExternalLink style={{marginLeft:5}}/>

                        </a>
                        }
                        {!this.state.fetching && !this.state.subject && this.state.title &&
                        // no subject, so just provide a linkless title
                        <div>{this.state.title}</div>
                        }

                        {this.state.showing &&
                        <a onClick={() => this.setState({showing: false})}
                           className='ontology-ribbon__show-hide-assocs link'>
                            Hide associations
                            <div style={{paddingBottom: 10, marginBottom: 10, display: 'inline'}}>
                                <FaClose size={20}/>
                            </div>
                        </a>
                        }
                        {!this.state.showing &&
                        <a onClick={() => this.setState({showing: true})}
                           className='ontology-ribbon__show-hide-assocs'>
                            Show associations
                            <div style={{paddingBottom: 10, marginBottom: 10, display: 'inline'}}>
                                <FaAngleDoubleDown size={20}/>
                            </div>
                        </a>
                        }

                    </div>
                </div>
                <ReactCSSTransitionGroup transitionName='fade'
                                         transitionEnterTimeout={500}
                                         transitionLeaveTimeout={300}
                >
                    {this.state.showing &&
                    <div className='ontology-ribbon__assoc'>
                        {this.renderMessage()}
                        <AssociationsView
                            currentTermId={this.state.currentTermId}
                            currentDomain={this.state.currentDomain}
                            hoveredTermId={this.state.hoveredTermId}
                            hoveredDomain={this.state.hoveredDomain}
                            slimlist={slimlist}
                            geneUrlFormatter={this.props.geneUrlFormatter}
                        />
                    </div>
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }

    getLabel(title) {
        return title.indexOf(' ')>=0 ? title.split(' ')[0] : title ;
    }
}


Ribbon.propTypes = {
    geneUrlFormatter: PropTypes.func.isRequired,
    title: PropTypes.string,
    slimlist: PropTypes.array.isRequired,
    initialTermId: PropTypes.string,
    subject: PropTypes.string,
    showing: PropTypes.bool.isRequired,
};
