import React from 'react';
import PropTypes from 'prop-types';

class Block extends React.Component {

    render() {
        const {color, label, count} = this.props;
        const tileHoverString = (count > 0) ?
            count + ' associations ' :
            'No associations to ' + label;
        const blockTitleClass = `ontology-ribbon__block ${
            count > 0 ? 'ontology-ribbon__block_match' : ''
            } ${
            this.props.isActive ? 'ontology-ribbon__block_active' : ''
            }`;
        return (
            <div className={blockTitleClass}>
                <div className="ontology-ribbon__block-title" onClick={this.props.onClick}>{label}</div>
                <div className="ontology-ribbon__block-tile"
                     title={tileHoverString}
                     onClick={this.props.onClick}
                     onMouseEnter={this.props.onMouseEnter}
                     onMouseLeave={this.props.onMouseLeave}
                     style={{backgroundColor: color}}>
                    {
                        this.props.isActive ? <span>&#10005;</span> : null
                    }
                </div>
            </div>
        );
    }
}

Block.propTypes = {
    label: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    color: PropTypes.string,
    isActive: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
};

export default Block;
