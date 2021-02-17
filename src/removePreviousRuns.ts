import { getOctokit } from '@actions/github';
import { ListWorkflowRunsParams } from './types';

export async function removePreviousRuns(
  token: string,
  params: ListWorkflowRunsParams,
  pull_number: number
): Promise<void> {
  const octokit = getOctokit(token);

  const {
    data: { workflow_runs },
  } = await octokit.actions.listWorkflowRuns(params);

  const runs = workflow_runs.filter(
    run => run.pull_requests[0]?.number === pull_number
  );

  for (const run of runs) {
    await octokit.actions.deleteWorkflowRun({
      ...params,
      run_id: run.id,
    });
  }
}
