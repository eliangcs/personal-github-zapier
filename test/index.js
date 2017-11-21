const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('Github', () => {
  zapier.tools.env.inject();

  it('should pass authentication', () => {
    const bundle = {
      authData: {
        token: process.env.TOKEN,
      },
    };

    return appTester(App.authentication.test, bundle)
      .then((result) => {
        result.username.should.eql(process.env.USERNAME);
      });
  });

  it('should fail authentication', () => {
    const bundle = {
      authData: {
        token: 'FAKE',
      },
    };

    return appTester(App.authentication.test, bundle)
      .then((result) => {
        should(false).eql(true);
      })
      .catch((error) => {
        error.name.should.eql('Error');
        error.message.should.containEql('Invalid Token');
      });
  });

  it('should return something from the search', () => {
    const bundle = {
      authData: {
        token: process.env.TOKEN,
      },
      inputData: {
        username: process.env.USERNAME,
      },
    };

    return appTester(App.searches.pr.operation.perform, bundle)
      .then((results) => {
        console.log(results[0]);
        results.should.be.an.Array();
        results.length.should.eql(1);
        results[0].should.have.property('openText');
        results[0].should.have.property('closedText');
      });
  });

});
