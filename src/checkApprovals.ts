import { ExitCode, getInput } from '@actions/core';
import { context } from '@actions/github';
import { getLastReviews } from './getLastReviews';
import { removePreviousRuns } from './removePreviousRuns';

export async function checkApprovals() {
  // Get token from input
  const token = getInput('token');
  if (!token) throw new Error('Github token not found');

  // Only run on `pull_request` events
  if (!context.payload.pull_request) return;

  // Get pull number
  const pull_number = context.payload.pull_request.number;

  // Set base octokit params
  const octokitParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
  };

  // Remove previous runs triggered by the `pull_request` event
  if (context.eventName === 'pull_request_review') {
    await removePreviousRuns(
      token,
      {
        ...octokitParams,
        workflow_id: context.workflow,
        event: 'pull_request',
      },
      pull_number
    );
  }

  // Remove previous runs triggered by the `pull_request_review` event
  if (context.eventName === 'pull_request') {
    await removePreviousRuns(
      token,
      {
        ...octokitParams,
        workflow_id: context.workflow,
        event: 'pull_request_review',
      },
      pull_number
    );
  }

  // Get approvals from input
  const requiredApprovals = parseInt(getInput('approvals'), 10) ?? 1;
  if (isNaN(requiredApprovals))
    throw new Error('Approvals input must be a number');
  if (requiredApprovals < 1) return ExitCode.Success;

  // Get PR reviews
  const lastReviews = await getLastReviews(token, {
    ...octokitParams,
    pull_number,
  });
  const approvedReviews = lastReviews.approved.length;
  const rejectedReviews = lastReviews.changesRequested.length;

  if (rejectedReviews) {
    throw new Error(`This pull request has ${rejectedReviews} request changes`);
  }

  if (requiredApprovals > approvedReviews) {
    throw new Error(`Missing ${requiredApprovals - approvedReviews} approvals`);
  }

  return ExitCode.Success;
}
