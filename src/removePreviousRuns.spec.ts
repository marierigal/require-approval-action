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
    workflow_id: 1,
    event: 'event',
  };
  const pull_number = 1;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove previous runs', async () => {
    mockGithub.__setMockContext(1);
    mockGithub.__setMockRuns([
      mockGithub.__makeMockRun(1, 1),
      mockGithub.__makeMockRun(2, 1),
      mockGithub.__makeMockRun(3, 2),
    ]);

    await removePreviousRuns(token, params, pull_number);

    return expect(
      mockGithub.getOctokit('token').actions.listWorkflowRuns(params)
    ).resolves.toMatchSnapshot();
  });
});
