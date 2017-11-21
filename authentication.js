const testAuth = (z, bundle) => {
  const request = z.request({
    method: 'POST',
    url: 'https://api.github.com/graphql',
    body: {
      query: `
query {
  viewer {
    login
  }
}
`
    },
  });

  return request
    .then((response) => {
      if (response.status === 401) {
        throw new Error('Invalid Token');
      }

      const username = z.JSON.parse(response.content).data.viewer.login;

      return { username };
    });
};

const auth = {
  type: 'custom',
  fields: [
    {
      key: 'token',
      type: 'password',
      label: 'Token',
      helpText: 'Your personal access token. You can [learn how to get one here](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/). You need `repo` and `user` scopes.',
      required: true,
    },
  ],
  test: testAuth,
  connectionLabel: '{{bundle.inputData.username}}',
};

module.exports = auth;
