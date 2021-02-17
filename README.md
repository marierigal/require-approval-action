# Require Approve Action

![Release](https://github.com/marierigal/require-approve-action/workflows/Release/badge.svg)
![@latest](https://img.shields.io/github/package-json/v/marierigal/require-approve-action?label=%40latest)

GitHub Action to check if the PR has been approved.

## Inputs

### `approvals`

Number of minimum approvals required, default to `1`.

### `token` (required)

GitHub token to check the pull request.

## Example

```yaml
name: Require Approvals

on:
  - pull_request
  - pull_request_review

jobs:
  check_approvals:
    runs-on: ubuntu-latest
    
    steps:
      - name: Check approvals
        uses: marierigal/require-approve-action@v1
        with:
          approvals: 2
          token: ${{ secrets.GITHUB_TOKEN }}
```

## License

[MIT](LICENSE.md)
