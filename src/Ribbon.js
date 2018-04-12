import React, {Component} from 'react'
import PropTypes from 'prop-types';

import RibbonBase from './RibbonBase';
import AssociationsView from './view/AssociationsView';

export default class Ribbon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTermId: undefined
        }
    }

    handleSlimSelect = (termId) => {
        if (termId !== this.state.currentTermId) {
            this.setState({
                currentTermId: termId
            });
        }
        else {
            this.setState({
                currentTermId: undefined
            })
        }
    }

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
    }

    render() {
        const slimlist = this.props.slimlist;
        // console.log('slimlist');
        // console.log(slimlist);
        return (
            <div>
                <RibbonBase
                    currentTermId={this.state.currentTermId}
                    onSlimSelect={(termId) => this.handleSlimSelect(termId)}
                    groups={this.groupByDomain(slimlist)}
                />
                {this.props.subject && this.props.title &&
                <div className='ontology-ribbon__caption'>
                    {this.props.subject.startsWith('HGNC:') &&
                        this.props.title}
                    {!this.props.subject.startsWith('HGNC:') &&
                    <a href={`http://amigo.geneontology.org/amigo/gene_product/` + this.props.subject}>
                        {this.props.title}
                    </a>
                    }
                </div>
                }
                {/*{this.props.title &&*/}
                {/*<div className='ontology-ribbon__caption'>{this.props.title}</div>*/}
                {/*}*/}
                <AssociationsView
                    currentTermId={this.state.currentTermId}
                    slimlist={slimlist}
                    geneUrlFormatter={this.props.geneUrlFormatter}
                />
            </div>
        );
    }
}


Ribbon.propTypes = {
    geneUrlFormatter: PropTypes.func.isRequired,
    title: PropTypes.string,
    slimlist: PropTypes.array.isRequired,
    initialTermId: PropTypes.string,
    subject: PropTypes.string,
};
