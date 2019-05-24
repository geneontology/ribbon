'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GenericRibbonHeaderCategory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      category: props.category,

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

  //   ontology-ribbon__block__tile--all
  render() {
    // console.log("Category: ", this.state.category);
    return (
        <div className='ontology-ribbon__category'>
        {
          this.state.category.groups.map((group, index) => {
            return (
              <div className='ontology-ribbon__block' key={index}>
                <div  className='ontology-ribbon__block__title'
                      style={this.labelStyle(group)}
                      title={group.description ? group.description : null}
                      >
                        {group.label}
                </div>
                <div  className='ontology-ribbon__block__tile--empty'
                      style={this.itemStyle(group)}></div>
              </div>
            )
          })
        }
        </div>
    )
  }

  labelStyle(group) {
    var labelStyle = { }    
    if (group.type == "All") {
      labelStyle['fontWeight'] = 'bold'
    } else if(group.type == "Other") {
      labelStyle['fontWeight'] = 'bold'
    }
    return labelStyle;
  }

  itemStyle(group) {
    var itemStyle = { }    
    if (group.type == "All") {
      itemStyle['marginRight'] = '2px';
    } else if(group.type == "Other") {
      itemStyle['marginLeft'] = '2px';
    }
    return itemStyle;
  }
  


}

GenericRibbonHeaderCategory.propTypes = {
  category: PropTypes.object.isRequired,

  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  onClick: PropTypes.func
}

GenericRibbonHeaderCategory.defaultProps = {
}

export default GenericRibbonHeaderCategory;