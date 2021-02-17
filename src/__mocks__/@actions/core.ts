import { MockCore } from '../types';

const core = jest.createMockFromModule<MockCore>('@actions/core');

let mockInputs: Record<string, string> = {
  token: 'token',
  approvals: '3',
};

function __setMockInputs(inputs: Record<string, string>): void {
  mockInputs = inputs;
}

function getInput(name: string): string | undefined {
  return mockInputs[name];
}

core.__setMockInputs = __setMockInputs;
core.getInput = getInput;

module.exports = core;
