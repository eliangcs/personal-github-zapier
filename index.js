const authentication = require('./authentication');

const getPRs = require('./searches/pr');

const addAuth = (request, z, bundle) => {
  if (bundle.authData && bundle.authData.token) {
    request.headers.Authorization = `Bearer ${bundle.authData.token}`;
  }

  return request;
};

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  beforeRequest: [
    addAuth,
  ],

  authentication,

  searches: {
    [getPRs.key]: getPRs,
  },
};

module.exports = App;
