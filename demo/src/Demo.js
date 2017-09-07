import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import { GridLoader } from 'react-spinners';
import 'react-virtualized/styles.css';

import '../../src/index.css';
import Ribbon from '../../src/Ribbon';
import RibbonDataProvider from '../../src/RibbonDataProvider';
import history from './history';

/**
 * Specify how the URL gets decoded here. This is an object that takes the prop
 * name as a key, and a query param specifier as the value. The query param
 * specifier can have a `type`, indicating how to decode the value from the
 * URL, and a `queryParam` field that indicates which key in the query
 * parameters should be read (this defaults to the prop name if not provided).
 *
 */

const urlPropsQueryConfig = {
 subject: { type: UrlQueryParamTypes.string },
 slim: { type: UrlQueryParamTypes.string },
};

/**
 * Map from url query params to props. The values in `url` will still be encoded
 * as strings since we did not pass a `urlPropsQueryConfig` to addUrlProps.
 */
function mapUrlToProps(url, props) {
  return {
    subject: url.subject,
    slim: url.slim,
  };
}

class Demo extends Component {
  static propTypes = {
    subject: PropTypes.string,
    slim: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // force an update if the URL changes
    history.listen(() => this.forceUpdate());
  }

  render() {
    const {subject, slim} = this.props;
    return (
      <div id='demo'>
        <RibbonDataProvider subject={subject} slim={slim}>
        {
          ({title, data, dataError, dataReceived}) => (
            <div>
            {
              dataReceived ? <Ribbon title={title} slimlist={data} /> : null
            }
            {dataError ? dataError : null}
            {
              (!dataReceived && !dataError) ?
                <GridLoader className='spinner'
                  align='middle'
                  color='#699'
                  size={8}
                  margin={2}
                  loading={true}
                /> :
                null
            }
            </div>
          )
        }
        </RibbonDataProvider>
      </div>
    )
  }
}

/*
 * We use the addUrlProps higher-order component to map URL query parameters
 * to props for Demo. In this case the mapping happens automatically by
 * first decoding the URL query parameters based on the urlPropsQueryConfig.
 */
export default addUrlProps({ mapUrlToProps })(Demo);
