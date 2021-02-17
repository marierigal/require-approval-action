import core from '@actions/core';

import { checkApprovals } from './checkApprovals';

checkApprovals()
  .then()
  .catch(error => core.setFailed(error.message));
