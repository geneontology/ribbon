import React from 'react';
import PropTypes from 'prop-types';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import { GridLoader } from 'react-spinners';

import '../../src/index.css';
import Ribbon, { RibbonDataProvider } from '../../src/index';
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
  mode: { type: UrlQueryParamTypes.string },
};

/**
 * Map from url query params to props. The values in `url` will still be encoded
 * as strings since we did not pass a `urlPropsQueryConfig` to addUrlProps.
 */
function mapUrlToProps(url) {
  return {
    subject: url.subject,
    mode: url.mode,
  };
}

class Demo extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // force an update if the URL changes
    history.listen(() => this.forceUpdate());
  }

  render() {
    const {subject, mode} = this.props;

    return (
      <div id='demo'>
        <div style={{border: '1px solid black', width: '600px', height: '100%', position: 'relative', overflowX: 'auto', overflowY: 'hidden'}}>
          <div style={{minWidth: '800px'}}>
            <RibbonDataProvider mode={mode} subject={subject} >
              {
                ({blocks, config, dataError, dataReceived, eco_list, title}) => (
                  <div>
                    {
                      dataReceived ?
                        <Ribbon
                          blocks={blocks}
                          config={config}
                          eco_list={eco_list}
                          showing={true}
                          subject={subject}
                          title={title}
                        /> :
                        null
                    }
                    {dataError ? dataError : null}
                    {
                      (!dataReceived && !dataError) ?
                        <GridLoader
                          align='middle'
                          className='spinner'
                          color='#699'
                          loading={true}
                          margin={2}
                          size={8}
                        /> :
                        null
                    }
                  </div>
                )
              }
            </RibbonDataProvider>
          </div>
        </div>

      </div>
    );
  }
}

Demo.propTypes = {
  mode: PropTypes.string,
  subject: PropTypes.string,
};

/*
 * We use the addUrlProps higher-order component to map URL query parameters
 * to props for Demo. In this case the mapping happens automatically by
 * first decoding the URL query parameters based on the urlPropsQueryConfig.
 */
export default addUrlProps({ mapUrlToProps })(Demo);
