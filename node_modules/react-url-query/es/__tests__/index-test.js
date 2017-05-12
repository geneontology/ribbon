'use strict';

var _index = require('../index');

describe('index', function () {
  it('includes all expected functions without crashing', function () {
    expect(_index.configureUrlQuery).toBeDefined();
    expect(_index.Serialize).toBeDefined();
    expect(_index.encode).toBeDefined();
    expect(_index.decode).toBeDefined();
    expect(_index.replaceInUrlQuery).toBeDefined();
    expect(_index.replaceUrlQuery).toBeDefined();
    expect(_index.pushInUrlQuery).toBeDefined();
    expect(_index.pushUrlQuery).toBeDefined();
    expect(_index.multiReplaceInUrlQuery).toBeDefined();
    expect(_index.multiPushInUrlQuery).toBeDefined();
    expect(_index.UrlQueryParamTypes).toBeDefined();
    expect(_index.UrlUpdateTypes).toBeDefined();
    expect(_index.addUrlProps).toBeDefined();
    expect(_index.RouterToUrlQuery).toBeDefined();
    expect(_index.replaceInUrlQueryFromAction).toBeDefined();
    expect(_index.replaceUrlQueryFromAction).toBeDefined();
    expect(_index.pushInUrlQueryFromAction).toBeDefined();
    expect(_index.pushUrlQueryFromAction).toBeDefined();
    expect(_index.urlAction).toBeDefined();
    expect(_index.urlReplaceAction).toBeDefined();
    expect(_index.urlPushAction).toBeDefined();
    expect(_index.urlReplaceInAction).toBeDefined();
    expect(_index.urlPushInAction).toBeDefined();
    expect(_index.urlQueryMiddleware).toBeDefined();
    expect(_index.urlQueryReducer).toBeDefined();
    expect(_index.subquery).toBeDefined();
    expect(_index.subqueryOmit).toBeDefined();
  });
});