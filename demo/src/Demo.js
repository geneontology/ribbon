import React, { Component, PropTypes } from 'react'
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import '../../src/index.css';
import Ribbon from '../../src/Ribbon';
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
function mapUrlToProps(url, props) {
  return {
    subject: url.subject,
    mode: url.mode,
  };
}

class Demo extends Component {
  static propTypes = {
    subject: PropTypes.string,
    mode: PropTypes.string,
    // change handlers are automatically generated and passed if a config is provided
    // and `addChangeHandlers` isn't false. They use `replaceIn` by default, just
    // updating that single query parameter and keeping the other existing ones.
    // onChangeFoo: PropTypes.func,
    // onChangeBar: PropTypes.func,
    // onChangeUrlQueryParams: PropTypes.func,
  }

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
      <div id='demo' >
        <h3>slim ribbon demo</h3>
        <Ribbon subject={subject} mode={mode} />
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
