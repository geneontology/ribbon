import React from 'react'
import PropTypes from 'prop-types';

import Block from './Block';

export default class RibbonBase extends React.Component {

    render() {

        return (
            <div className="ontology-ribbon">
                {
                    this.props.groups.map((group) => {
                        return (
                            <div key={group.label} className='ontology-ribbon__strip'>
                                {
                                    group.data.map((slimitem) => {
                                        return (
                                            <Block
                                                {...slimitem}
                                                key={slimitem.id}
                                                onClick={() => this.props.onSlimSelect(slimitem.id)}
                                                onMouseEnter={() => this.props.handleSlimEnter(slimitem.id)}
                                                onMouseLeave={() => this.props.handleSlimLeave(slimitem.id)}
                                                isActive={slimitem.id === this.props.currentTermId}
                                            />
                                        );
                                    })
                                }
                                <span className='ontology-ribbon__strip-label'
                                      onClick={() => this.props.onDomainSelect(group.label)}
                                      onMouseEnter={() => this.props.handleDomainEnter(group.label)}
                                      onMouseLeave={() => this.props.handleDomainLeave(group.label)}
                                >{group.label}</span>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

RibbonBase.defaultProps = {
    groups: [],
};

RibbonBase.propTypes = {
    currentTermId: PropTypes.string,
    groups: PropTypes.arrayOf(PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
        })),
    })),
    onSlimSelect: PropTypes.func.isRequired,
    handleSlimEnter: PropTypes.func,
    handleSlimLeave: PropTypes.func,
    handleDomainEnter: PropTypes.func,
    handleDomainLeave: PropTypes.func,
    omDomainSelect: PropTypes.func,
};
