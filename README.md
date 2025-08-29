# Salesforce 2GP Package Version Create Action

A GitHub Action for creating a new Second-Generation Package (2GP) version for a Salesforce package. This action automates the package version creation process in your CI/CD workflows.

## Features

- Authenticate with a Salesforce Dev Hub org
- Create a new package version with customizable options
- Poll for package creation status
- Update package aliases in the sfdx-project.json file
- Configurable timeout and polling intervals

## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `auth-url` | The URL of the Dev Hub org. This is used to create an auth file for the Dev Hub org. | Yes | |
| `packaging-directory` | The directory containing the Salesforce project. Typically `./ ` when the action runs in the same repository that contains the Salesforce project. When testing locally or running in a separate repository, this should match the path where the Salesforce project is checked out. | Yes | |
| `package` | ID (starts with 0Ho) or alias of the package to create a version of. | Yes | |
| `target-dev-hub` | Username or alias of the Dev Hub org. | Yes | |
| `installation-key-bypass` | Bypass the installation key requirement. If you bypass this requirement, anyone can install your package. | No | |
| `installation-key` | Installation key for the package version. Omit this flag if you specify `installation-key-bypass`. | No | |
| `skip-validation` | Skip validation during package version creation; you can't promote unvalidated package versions. | No | |
| `code-coverage` | Calculate and store the code coverage percentage by running the packaged Apex tests. | No | |
| `async-validation` | Return a new package version before completing package validations. | No | |
| `path` | Path to directory that contains the contents of the package. | No | |
| `version-name` | Name of the package version to be created. | No | |
| `version-description` | Description of the package version to be created. | No | |
| `version-number` | Version number in the format major.minor.patch.build. | No | |
| `timeout` | Maximum time in minutes to wait for package creation to complete. | No | 60 |
| `polling-interval` | Time in seconds between status check attempts. | No | 60 |

## Outputs

| Name | Description |
|------|-------------|
| `package-version-id` | The package version ID |
| `package-version-number` | The package version number |
| `package-report` | JSON representation of the package report |
| `message` | The message from the command execution |

## Example Workflow

```yaml
name: Create Salesforce Package Version

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  PACKAGING_DIRECTORY: ./
  PACKAGE_ID: MyPackage
  TARGET_DEV_HUB: DevHub

jobs:
  create-package-version:
    name: Create package version
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      # Example: If your Salesforce project is in a separate repository
      # - name: Checkout Salesforce project repository
      #   uses: actions/checkout@v4
      #   with:
      #     repository: your-username/your-salesforce-project
      #     token: ${{ secrets.GITHUB_TOKEN }}
      #     path: salesforce-project
      # Then set PACKAGING_DIRECTORY: ./salesforce-project

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Salesforce CLI
        run: npm install @salesforce/cli --global

      - name: Create package version
        uses: mathias-moreira/2gp-packaging-action
        id: create-package-version
        with:
          auth-url: ${{ secrets.AUTH_URL }}
          packaging-directory: ${{ env.PACKAGING_DIRECTORY }}
          package: ${{ env.PACKAGE_ID }}
          target-dev-hub: ${{ env.TARGET_DEV_HUB }}
          installation-key-bypass: true
          skip-validation: false
          code-coverage: true
          timeout: 60
          polling-interval: 30

      - name: Show package details
        run: |
          echo "Package Version ID: ${{ steps.create-package-version.outputs.package-version-id }}"
          echo "Package Version Number: ${{ steps.create-package-version.outputs.package-version-number }}"
```

## Local Development

This action can be developed and tested locally using [act](https://github.com/nektos/act), a tool for running GitHub Actions locally.

### Prerequisites

1. Install Docker (required by act)
2. Install act: `brew install act` (macOS) or follow the [installation instructions](https://github.com/nektos/act#installation)
3. Clone this repository

### Setup for Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the action:
   ```bash
   npm run build
   ```

3. Create a `.secrets` file in the root of the project with the following content:
   ```
   AUTH_URL=YOUR_AUTH_URL
   ACTION_PAT=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
   ```

4. Run the action locally:
   ```bash
   npm start
   ```

This will use the workflow defined in `.github/workflows/local-development.yml` to test the action locally.

### Testing with External Salesforce Projects

When testing locally, you might need to use a Salesforce project from a different repository. The local-development.yml workflow demonstrates this scenario:

```yaml
- name: Checkout Salesforce project repository
  uses: actions/checkout@v4
  with:
    repository: your-username/your-salesforce-project
    token: ${{ secrets.ACTION_PAT }}
    path: ${{ env.PACKAGING_DIRECTORY }}
```

In this case, the `packaging-directory` parameter should match the path where the external repository is checked out:

```yaml
- name: Create package version
  uses: mathias-moreira/2gp-packaging-action
  id: create-package-version
  with:
    auth-url: ${{ secrets.AUTH_URL }}
    packaging-directory: ${{ env.PACKAGING_DIRECTORY }}  # Set to "./your-salesforce-project"
    package: ${{ env.PACKAGE_ID }}
    target-dev-hub: ${{ env.TARGET_DEV_HUB }}
```

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Builds the action using Rollup, creating a bundled JavaScript file in the `dist` directory |
| `npm start` | Runs the action locally using act with the local development workflow |

## Salesforce CLI Commands

This action uses the following Salesforce CLI commands:

- `sf package version create`: Creates a new package version
- `sf package version create report`: Checks the status of a package version creation request

For more information about these commands, see the [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_package_commands.htm).

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

### Development Guidelines

- Follow the existing code style
- Add JSDoc comments for all functions
- Test your changes locally using act
- Update documentation as needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Additional Resources

- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Second-Generation Packages](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_dev2gp.htm)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
