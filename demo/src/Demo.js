import React, { Component } from 'react';
import Ribbon, { RibbonDataProvider } from '../../src/';
import '../../src/index.css';
import history from './history';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

/*
static dataDependencies = [
  fetchHome
]
*/

/**
 * Specify how the URL gets decoded here. This is an object that takes the prop
 * name as a key, and a query param specifier as the value. The query param
 * specifier can have a `type`, indicating how to decode the value from the
 * URL, and a `queryParam` field that indicates which key in the query
 * parameters should be read (this defaults to the prop name if not provided).
 *
 * The queryParam value for `foo` here matches the one used in the changeFoo
 * action.
 */
const urlPropsQueryConfig = {
  db: { type: UrlQueryParamTypes.string },
  id: { type: UrlQueryParamTypes.string },
};

/**
 * We use the addUrlProps higher-order component to map URL query parameters
 * to props for Ribbon. In this case the mapping happens automatically by
 * first decoding the URL query parameters based on the urlPropsQueryConfig.
 */
const RibbonRoute = addUrlProps({ urlPropsQueryConfig })(RibbonDataProvider);

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
        <RibbonRoute>
        {({title, data, dataReceived, dataError}) => {
          return dataReceived ?
            <Ribbon title={title} data={data} /> : dataError
        }}
        </RibbonRoute>
      </div>
    );
  }
}

export default Demo;
