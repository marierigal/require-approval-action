import { RestEndpointMethodTypes } from '@octokit/rest';

export type ListReviewsParams = RestEndpointMethodTypes['pulls']['listReviews']['parameters'];
export type Review = RestEndpointMethodTypes['pulls']['getReview']['response']['data'];
export type SortedReviews = { approved: Review[]; changesRequested: Review[] };

export type ListWorkflowRunsParams = RestEndpointMethodTypes['actions']['listWorkflowRuns']['parameters'];
export type DeleteWorkflowRunParams = RestEndpointMethodTypes['actions']['deleteWorkflowRun']['parameters'];
export type Run = RestEndpointMethodTypes['actions']['getWorkflowRun']['response']['data'];
