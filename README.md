# 📦 Salesforce CI Packager (2GP)

A powerful GitHub Action that simplifies and automates the creation of Second-Generation Packages (2GP) for Salesforce. Say goodbye to manual package creation and hello to streamlined CI/CD workflows!

![GitHub stars](https://img.shields.io/github/stars/mathias-moreira/salesforce-ci-packager?style=social)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Why Use This Action?

Creating and managing Salesforce 2GP packages can be time-consuming and error-prone. This action transforms your packaging experience:

- 🚀 **Accelerate Delivery** - Automate package creation in your CI/CD pipeline
- 🔄 **Ensure Consistency** - Standardize package versioning across your organization
- ⏱️ **Save Time** - Eliminate manual steps in your release process
- 📊 **Gain Visibility** - Track package creation status with detailed reporting
- 🔌 **Plug and Play** - Integrate seamlessly with your existing GitHub workflows
- 🛡️ **Reduce Errors** - Eliminate common mistakes in the packaging process

## 🛠️ Key Features

- 🔐 Authenticate with a Salesforce Dev Hub org
- 📦 Create a new package version with customizable options
- 🔄 Poll for package creation status
- ✏️ Update package aliases in the sfdx-project.json file
- ⚙️ Configurable timeout and polling intervals

## 📋 Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `auth-url` | The URL of the Dev Hub org. This is used to create an auth file for the Dev Hub org. | Yes | |
| `packaging-directory` | The directory containing the Salesforce project. | No | `./` |
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

## 📤 Outputs

| Name | Description |
|------|-------------|
| `package-version-id` | The package version ID |
| `package-version-number` | The package version number |
| `package-report` | JSON representation of the package report |
| `message` | The message from the command execution |

## 🚀 Quick Start

Add this workflow to your project in `.github/workflows/create-package.yml`:

```yaml
name: Create Salesforce Package Version

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  PACKAGE_ID: MyPackage
  TARGET_DEV_HUB: DevHub

jobs:
  create-package-version:
    name: Create package version
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Create package version
        uses: mathias-moreira/salesforce-ci-packager
        id: create-package-version
        with:
          auth-url: ${{ secrets.AUTH_URL }}
          package: ${{ env.PACKAGE_ID }}
          target-dev-hub: ${{ env.TARGET_DEV_HUB }}
          installation-key-bypass: true
          code-coverage: true

      - name: Show package details
        run: |
          echo "Package Version ID: ${{ steps.create-package-version.outputs.package-version-id }}"
          echo "Package Version Number: ${{ steps.create-package-version.outputs.package-version-number }}"
```

## 🔧 Under the Hood

This action uses the following Salesforce CLI commands:

- `sf package version create`: Creates a new package version
- `sf package version create report`: Checks the status of a package version creation request

For more information about these commands, see the [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_package_commands.htm).

## 👥 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on how to contribute to this project, including local development setup and testing.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📚 Additional Resources

- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Second-Generation Packages](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_dev2gp.htm)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

💡 **Tip:** Store your `auth-url` as a GitHub secret to keep your credentials secure!

⭐ If you find this action helpful, consider giving it a star on GitHub!