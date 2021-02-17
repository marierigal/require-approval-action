import * as github from '@actions/github';
import { MockGithub } from './__mocks__/types';
import { REVIEW_STATE } from './constants';
import { getLastReviews } from './getLastReviews';

jest.mock('@actions/github');

const mockGithub = (github as unknown) as MockGithub;

describe('getLastReviews', () => {
  const token = 'token';
  const params = {
    owner: 'owner',
    repo: 'repo',
    pull_number: 1,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return sorted reviews', () => {
    mockGithub.__setMockReviews([
      mockGithub.__makeMockReview(REVIEW_STATE.changesRequested, 1),
      mockGithub.__makeMockReview(REVIEW_STATE.commented, 1),
      mockGithub.__makeMockReview(REVIEW_STATE.changesRequested, 2),
      mockGithub.__makeMockReview(REVIEW_STATE.approved, 1),
      mockGithub.__makeMockReview(REVIEW_STATE.commented, 3),
    ]);

    return expect(getLastReviews(token, params)).resolves.toMatchSnapshot();
  });
});
