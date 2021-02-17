import * as core from '@actions/core';
import * as github from '@actions/github';
import { MockCore, MockGithub } from './__mocks__/types';

import { checkApprovals } from './checkApprovals';
import { REVIEW_STATE } from './constants';

jest.mock('@actions/core');
jest.mock('@actions/github');

const mockCore = (core as unknown) as MockCore;
const mockGithub = (github as unknown) as MockGithub;

describe('checkApprovals', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when the token is not defined', () => {
    mockCore.__setMockInputs({});

    return expect(checkApprovals()).rejects.toMatchSnapshot();
  });

  it('should skip execution when the event is not related to a pull request', () => {
    mockCore.__setMockInputs({ token: 'token' });
    mockGithub.__setMockContext();

    return expect(checkApprovals()).resolves.toBeFalsy();
  });

  it('should fail when requiredApprovals = NaN', () => {
    mockCore.__setMockInputs({ token: 'token', approvals: 'foo' });
    mockGithub.__setMockContext(1);

    return expect(checkApprovals()).rejects.toMatchSnapshot();
  });

  it('should success when requiredApprovals < 1', () => {
    mockCore.__setMockInputs({ token: 'token', approvals: '0' });
    mockGithub.__setMockContext(1);
    mockGithub.__setMockReviews([
      mockGithub.__makeMockReview(REVIEW_STATE.changesRequested, 1),
    ]);

    return expect(checkApprovals()).resolves.toEqual(core.ExitCode.Success);
  });

  it('should fail when rejectedReviews > 0', () => {
    mockCore.__setMockInputs({ token: 'token', approvals: '3' });
    mockGithub.__setMockContext(1);
    mockGithub.__setMockReviews([
      mockGithub.__makeMockReview(REVIEW_STATE.approved, 1),
      mockGithub.__makeMockReview(REVIEW_STATE.changesRequested, 1),
      mockGithub.__makeMockReview(REVIEW_STATE.approved, 2),
    ]);
    mockGithub.__setMockRuns([]);

    return expect(checkApprovals()).rejects.toMatchSnapshot();
  });

  it('should fail when requiredApprovals > approvedReviews', () => {
    mockCore.__setMockInputs({ token: 'token', approvals: '3' });
    mockGithub.__setMockContext(1);
    mockGithub.__setMockReviews([
      mockGithub.__makeMockReview(REVIEW_STATE.approved, 1),
      mockGithub.__makeMockReview(REVIEW_STATE.approved, 1),
      mockGithub.__makeMockReview(REVIEW_STATE.approved, 1),
      mockGithub.__makeMockReview(REVIEW_STATE.commented, 2),
    ]);

    return expect(checkApprovals()).rejects.toMatchSnapshot();
  });

  it('should success when requiredApprovals < approvedReviews', () => {
    mockCore.__setMockInputs({ token: 'token', approvals: '1' });
    mockGithub.__setMockContext(1);
    mockGithub.__setMockReviews([
      mockGithub.__makeMockReview(REVIEW_STATE.approved, 1),
      mockGithub.__makeMockReview(REVIEW_STATE.approved, 2),
    ]);

    return expect(checkApprovals()).resolves.toEqual(core.ExitCode.Success);
  });

  it('should success when requiredApprovals = approvedReviews', () => {
    mockCore.__setMockInputs({ token: 'token', approvals: '2' });
    mockGithub.__setMockContext(1);
    mockGithub.__setMockReviews([
      mockGithub.__makeMockReview(REVIEW_STATE.approved, 1),
      mockGithub.__makeMockReview(REVIEW_STATE.changesRequested, 1),
      mockGithub.__makeMockReview(REVIEW_STATE.approved, 1),
      mockGithub.__makeMockReview(REVIEW_STATE.approved, 2),
    ]);

    return expect(checkApprovals()).resolves.toEqual(core.ExitCode.Success);
  });
});
