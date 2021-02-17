import { REVIEW_STATE } from '../../constants';
import { DeleteWorkflowRunParams } from '../../types';
import {
  MockContext,
  MockGithub,
  MockOctokit,
  MockReview,
  MockRun,
  MockWorkflow,
} from '../types';

const github = jest.createMockFromModule<MockGithub>('@actions/github');

const context: MockContext = {
  eventName: 'pull_request_review',
  workflow: 'workflow',
  repo: {
    owner: 'owner',
    repo: 'repo',
  },
  payload: {},
};
let mockReviews: MockReview[] = [];
let mockWorkflows: MockWorkflow[] = [];
let mockRuns: MockRun[] = [];

function __setMockContext(pull_number?: number): MockContext {
  if (pull_number) {
    context.payload = {
      pull_request: { number: pull_number },
    };
  }

  return context;
}

function __makeMockReview(state: REVIEW_STATE, userId: number): MockReview {
  return {
    user: { id: userId },
    state: state,
  };
}

function __setMockReviews(reviews: MockReview[]): void {
  mockReviews = reviews;
}

function __makeMockWorkflow(id: number, name: string): MockWorkflow {
  return { id, name };
}

function __setMockWorkflows(workflows: MockWorkflow[]): void {
  mockWorkflows = workflows;
}

function __makeMockRun(runId: number, pull_number: number): MockRun {
  return {
    id: runId,
    pull_requests: [{ number: pull_number }],
  };
}

function __setMockRuns(runs: MockRun[]): void {
  mockRuns = runs;
}

function listReviews(): Promise<{ data: MockReview[] }> {
  return new Promise(resolve => resolve({ data: mockReviews }));
}

function listRepoWorkflows(): Promise<{ data: { workflows: MockWorkflow[] } }> {
  return new Promise(resolve =>
    resolve({
      data: { workflows: mockWorkflows },
    })
  );
}

function listWorkflowRuns(): Promise<{ data: { workflow_runs: MockRun[] } }> {
  return new Promise(resolve =>
    resolve({
      data: { workflow_runs: mockRuns },
    })
  );
}

function deleteWorkflowRun({ run_id }: DeleteWorkflowRunParams): Promise<void> {
  return new Promise(resolve => {
    mockRuns = mockRuns.filter(run => run.id !== run_id);
    resolve();
  });
}

function getOctokit(): MockOctokit {
  return {
    pulls: {
      listReviews,
    },
    actions: {
      listRepoWorkflows,
      listWorkflowRuns,
      deleteWorkflowRun,
    },
  };
}

github.__setMockContext = __setMockContext;
github.__makeMockReview = __makeMockReview;
github.__setMockReviews = __setMockReviews;
github.__makeMockWorkflow = __makeMockWorkflow;
github.__setMockWorkflows = __setMockWorkflows;
github.__makeMockRun = __makeMockRun;
github.__setMockRuns = __setMockRuns;
github.context = context;
github.getOctokit = getOctokit;

module.exports = github;
