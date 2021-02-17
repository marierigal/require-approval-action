import * as github from '@actions/github';

import { MockGithub } from './__mocks__/types';
import { removePreviousRuns } from './removePreviousRuns';

jest.mock('@actions/github');

const mockGithub = (github as unknown) as MockGithub;

describe('removePreviousRuns', () => {
  const token = 'token';
  const params = {
    owner: 'owner',
    repo: 'repo',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove previous runs', async () => {
    mockGithub.__setMockContext(1);
    mockGithub.__setMockWorkflows([
      mockGithub.__makeMockWorkflow(1, 'workflow'),
    ]);
    mockGithub.__setMockRuns([
      mockGithub.__makeMockRun(1, 1),
      mockGithub.__makeMockRun(2, 1),
      mockGithub.__makeMockRun(3, 2),
    ]);

    await removePreviousRuns(token, params, 1, 'workflow', 'event');

    return expect(
      mockGithub
        .getOctokit('token')
        .actions.listWorkflowRuns({ ...params, workflow_id: 1 })
    ).resolves.toMatchSnapshot();
  });
});
