import core from '@actions/core';

import { checkApprovals } from './checkApprovals';

checkApprovals()
  .then()
  .catch(error => {
    console.error(error);
    core.setFailed(error.message);
  });
