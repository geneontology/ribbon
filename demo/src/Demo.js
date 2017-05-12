import React, { Component } from 'react';
import Ribbon from './Ribbon';
import history from './history';

/*
static dataDependencies = [
  fetchHome
]
*/

class Demo extends Component {
  componentDidMount() {
    // force an update if the URL changes
    history.listen(() => this.forceUpdate());
    //const { dispatch } = this.props
    //dispatch(fetchHome())
  }

  render() {
    return (
      <div>
        <h3>slim ribbon demo</h3>
        <Ribbon />
      </div>
    );
  }
}

export default Demo;
