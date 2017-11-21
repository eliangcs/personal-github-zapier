const moment = require('moment');

const getPRs = (z, bundle) => {
  const pastMonday = moment().startOf('isoWeek');
  const limit = bundle.inputData.limit || 30;

  const request = z.request({
    method: 'POST',
    url: 'https://api.github.com/graphql',
    body: {
      query: `
query {
  ClosedPRs:search(query:"is:closed is:pr assignee:${bundle.inputData.username} archived:false" type:ISSUE first:${limit}) {
    nodes {
      ...pullRequestFields
    }
  }
  OpenPRs:search(query:"is:open is:pr assignee:${bundle.inputData.username} archived:false" type:ISSUE first:${limit}) {
    nodes {
      ...pullRequestFields
    }
  }
}

fragment pullRequestFields on PullRequest {
  title
  url
  updatedAt
}
`,
    },
  });

  return request
    .then((response) => {
      const result = z.JSON.parse(response.content);

      const closed = [];
      const open = [];

      // Extract and parse into line breaks in markdown
      result.data.ClosedPRs.nodes.forEach((pullRequest) => {
        const pullRequestDate = moment(pullRequest.updatedAt, 'YYYY-MM-DD[T]HH:mm:ss[Z]');

        // If before past monday, skip.
        if (pullRequestDate.diff(pastMonday) < 0) {
          return;
        }

        const markdown = `- [${pullRequest.title}](${pullRequest.url})`;
        closed.push(markdown);
      });

      result.data.OpenPRs.nodes.forEach((pullRequest) => {
        const pullRequestDate = moment(pullRequest.updatedAt, 'YYYY-MM-DD[T]HH:mm:ss[Z]');

        const markdown = `- [${pullRequest.title}](${pullRequest.url})`;
        open.push(markdown);
      });

      return [{
        closedText: closed.join('\n'),
        openText: open.join('\n'),
      }];
    });
};

module.exports = {
  key: 'pr',
  noun: 'PR',

  display: {
    label: 'Get PRs',
    description: 'Gets assigned PRs closed and still open this current (work) week.',
    important: true,
  },

  operation: {
    perform: getPRs,

    inputFields: [
      {
        key: 'username',
        label: 'Assignee Username',
        helpText: 'If you do not choose your own username, you will only see that user\'s public PRs.',
        required: true,
      },
      {
        key: 'limit',
        label: 'Number of PRs to fetch',
        helpText: 'It\'s a good idea to keep this at least 2-3x your average number of weekly closed/open PRs.',
        default: '30',
        required: false,
      },
    ],

    sample: {
      closedText: `- [Sample 1](https://github.com/zapier/zapier-platform-cli/pull/1)
- [Sample 2](https://github.com/zapier/zapier-platform-cli/pull/2)`,
      openText: `- [Sample 3](https://github.com/zapier/zapier-platform-cli/pull/3)
- [Sample 4](https://github.com/zapier/zapier-platform-cli/pull/4)`
    },

    outputFields: [
      {key: 'closedText', label: 'Closed PRs Text'},
      {key: 'openText', label: 'Open PRs Text'},
    ],
  },
};
