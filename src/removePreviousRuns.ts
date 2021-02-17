import { getOctokit } from '@actions/github';

export async function removePreviousRuns(
  token: string,
  params: { owner: string; repo: string },
  pull_number: number,
  workflow_name: string,
  event_name: string
): Promise<void> {
  const octokit = getOctokit(token);

  const {
    data: { workflows },
  } = await octokit.actions.listRepoWorkflows(params);

  const workflow = workflows.find(workflow => workflow.name === workflow_name);
  if (!workflow) return;

  const {
    data: { workflow_runs },
  } = await octokit.actions.listWorkflowRuns({
    ...params,
    workflow_id: workflow.id,
    event: event_name,
  });

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
