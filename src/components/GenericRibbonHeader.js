'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GenericRibbonHeaderCategory from './GenericRibbonHeaderCategory';
import { POSITION } from '../enums';

class GenericRibbonHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: props.categories,
      showItemAll : props.showItemAll,
      addSubjectLabelWidth : props.addSubjectLabelWidth,
      subjectLabelPosition : props.subjectLabelPosition,

      onEnter: props.onEnter,
      onLeave: props.onLeave,
      onClick: props.onClick
    }
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      categories: nextProps.categories,
      showItemAll : nextProps.showItemAll,
      addSubjectLabelWidth : nextProps.addSubjectLabelWidth,
      subjectLabelPosition : nextProps.subjectLabelPosition,

      onEnter: nextProps.onEnter,
      onLeave: nextProps.onLeave,
      onClick: nextProps.onClick
    });
  }

  render() {
    // console.log("Header: ", this.state.categories);
    return (
      <div className='ontology-ribbon__strip'>

        {/* { (this.state.showItemAll) ?
          <div style={{ display : 'inline-block',
                        padding: '0px 16px'
                      }} />
                                      : ''
        }       */}

        { (this.state.subjectLabelPosition == POSITION.LEFT && this.state.addSubjectLabelWidth) ?
          <div style={{ display : 'inline-block',
                        width: '180px',
                        padding: '0px 1px'
                      }} />
                                      : ''
        }      
      
        { (this.state.showItemAll) ?
            <GenericRibbonHeaderCategory category={ { groups : [ { id: "all", type: "All", label: "All annotations" } ] } } />
            : ''
        }

        {
          this.state.categories.map((category, index) => {
            return (
              <GenericRibbonHeaderCategory category={category} key={index} />
            )
          })
        }
      </div>
    )

  }

}

GenericRibbonHeader.propTypes = {
  categories: PropTypes.array.isRequired,
  showItemAll : PropTypes.bool,
  addSubjectLabelWidth : PropTypes.bool,
  subjectLabelPosition : PropTypes.number,

  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  onClick: PropTypes.func
}

GenericRibbonHeader.defaultProps = {
}

export default GenericRibbonHeader;