import { REVIEW_STATE } from '../constants';
import {
  DeleteWorkflowRunParams,
  ListReviewsParams,
  ListWorkflowRunsParams,
} from '../types';

export interface MockCore {
  __setMockInputs: (inputs: Record<string, string>) => void;
  getInput: (name: string) => string | undefined;
}

export interface MockGithub {
  __setMockContext: (pull_number?: number) => MockContext;
  __makeMockReview: (state: REVIEW_STATE, userId: number) => MockReview;
  __setMockReviews: (reviews: MockReview[]) => void;
  __makeMockRun: (runId: number, pull_number: number) => MockRun;
  __setMockRuns: (runs: MockRun[]) => void;
  context: MockContext;
  getOctokit: (token: string) => MockOctokit;
}

export interface MockOctokit {
  pulls: {
    listReviews: (params: ListReviewsParams) => Promise<{ data: MockReview[] }>;
  };
  actions: {
    listWorkflowRuns: (
      params: ListWorkflowRunsParams
    ) => Promise<{ data: { workflow_runs: MockRun[] } }>;
    deleteWorkflowRun: (params: DeleteWorkflowRunParams) => Promise<void>;
  };
}

export interface MockContext {
  eventName: string;
  workflow_id: number;
  repo: {
    owner: string;
    repo: string;
  };
  payload: {
    pull_request?: { number: number };
  };
}

export interface MockReview {
  user: { id: number };
  state: REVIEW_STATE;
}

export interface MockRun {
  id: number;
  pull_requests: { number: number }[];
}
