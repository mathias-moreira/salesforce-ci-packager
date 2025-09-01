# 🚀 Contributing to Salesforce CI Packager (2GP)

Thank you for your interest in contributing to the Salesforce CI Packager (2GP)! We're excited to welcome you to our community. This document provides friendly guidelines to help you contribute effectively.

## 🤝 Contribution Process

To maintain quality and consistency in our codebase, we follow these guidelines:

- 🔒 All changes go through pull requests (no direct pushes to the main repository)
- 👀 All pull requests are carefully reviewed by the repository owner
- 🔄 This process ensures code quality and project stability

## 🌟 How to Contribute

We welcome your contributions! Here's how you can help make this project better:

1. 🍴 **Fork the repository** to your own GitHub account
   - Go to the [salesforce-ci-packager repository](https://github.com/mathias-moreira/salesforce-ci-packager)
   - Click the "Fork" button in the top-right corner
   - Select your GitHub account as the destination

2. 📋 **Clone your fork** to your local machine: 
   ```bash
   git clone https://github.com/YOUR-USERNAME/salesforce-ci-packager.git
   cd salesforce-ci-packager
   ```

3. 🔄 **Add the original repository as an upstream remote**:
   ```bash
   git remote add upstream https://github.com/mathias-moreira/salesforce-ci-packager.git
   ```

4. 🌿 **Create a feature branch**: 
   ```bash
   git checkout -b feature/my-new-feature
   ```

5. ✏️ **Make your changes** and test them thoroughly

6. 💾 **Commit your changes** with descriptive messages: 
   ```bash
   git commit -am 'Add some feature'
   ```

7. 📤 **Push to your fork**: 
   ```bash
   git push origin feature/my-new-feature
   ```

8. 🔗 **Create a pull request**:
   - Go to your fork on GitHub
   - Click the "Compare & pull request" button for your branch
   - Set the base repository to `mathias-moreira/salesforce-ci-packager` and the base branch to `master`
   - Add a descriptive title and details about your changes
   - Click "Create pull request"

9. ⏳ **Wait for review** - we'll review your PR and might suggest some changes

10. 🔁 **Address any feedback** if requested

Remember that all pull requests are reviewed to ensure they align with the project's goals and standards.

## 📝 Pull Request Guidelines

When submitting a pull request, please:

- 📄 Clearly describe what the PR does and why it's needed
- 🔗 Include any relevant issue numbers (e.g., `fixes #123`, `closes #456`)
- 🎯 Keep changes focused on a single purpose
- 📚 Update documentation as needed

## 💻 Development Guidelines

- 🧩 Follow the existing code style
- 📋 Add JSDoc comments for all functions
- 🧪 Test your changes locally using act
- 📖 Update documentation as needed

## 📝 Commit Message Guidelines

We follow the [semantic-release](https://github.com/semantic-release/semantic-release) commit message format to automate version management and package publishing. This helps maintain a clear and standardized commit history and enables automated releases.

### Commit Message Format

Each commit message consists of a **header**, a **body**, and a **footer**. The header has a special format that includes a **type**, an optional **scope**, and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

#### Type

The type must be one of the following:

- **feat**: A new feature (triggers a MINOR version increment)
- **fix**: A bug fix (triggers a PATCH version increment)
- **docs**: Documentation only changes (no version increment)
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc) (no version increment)
- **refactor**: A code change that neither fixes a bug nor adds a feature (no version increment)
- **perf**: A code change that improves performance (triggers a PATCH version increment)
- **test**: Adding missing tests or correcting existing tests (no version increment)
- **chore**: Changes to the build process or auxiliary tools and libraries (no version increment)

#### Version Increments

- **MAJOR**: Incremented when there are breaking changes (indicated by "BREAKING CHANGE:" in the commit footer)
- **MINOR**: Incremented when new features are added (feat type)
- **PATCH**: Incremented when bugs are fixed (fix type) or performance is improved (perf type)

#### Examples

```
feat(packaging): add support for custom version numbers

fix(auth): resolve issue with auth URL validation

docs(readme): update installation instructions

refactor(utils): simplify command execution logic

BREAKING CHANGE: The installationKey parameter now requires a minimum of 8 characters
```

### Breaking Changes

Breaking changes should be noted in the footer with a `BREAKING CHANGE:` prefix, followed by a description of the breaking change.

```
feat(api): change authentication method

BREAKING CHANGE: The authentication method now requires an API key instead of username/password
```

For more details, see the [semantic-release documentation](https://github.com/semantic-release/semantic-release#commit-message-format).

## 🛠️ Local Development

This action can be developed and tested locally using [act](https://github.com/nektos/act), a tool for running GitHub Actions locally.

### 📋 Prerequisites

1. 🐳 Install Docker (required by act)
2. ⚙️ Install act: `brew install act` (macOS) or follow the [installation instructions](https://github.com/nektos/act#installation)
3. 📥 Clone this repository

### 🚀 Setup for Local Development

1. 📦 Install dependencies:
   ```bash
   npm install
   ```

2. 🔨 Build the action:
   ```bash
   npm run build
   ```

3. 🔑 Create a `.secrets` file in the root of the project with the following content:
   ```
   AUTH_URL=YOUR_AUTH_URL
   ACTION_PAT=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
   ```

4. ▶️ Run the action locally:
   ```bash
   npm start
   ```

This will use the workflow defined in `.github/workflows/local-development.yml` to test the action locally.

### 🔄 Testing with External Salesforce Projects

When developing or testing this action, you'll often need to use a Salesforce project from a different repository. Below is a complete example workflow that demonstrates how to use this action with a Salesforce project located in a separate repository:

```yaml
name: Create Package Version from External Repository

on:
  workflow_dispatch:
    inputs:
      version_number:
        description: 'Version number in format major.minor.patch.build'
        required: false
        default: ''

env:
  PACKAGING_DIRECTORY: ./salesforce-project
  PACKAGE_NAME: MyUnlockedPackage
  TARGET_DEV_HUB: DevHub

jobs:
  create-package-version:
    name: Create package version
    runs-on: ubuntu-latest

    steps:
      # First, checkout this action repository
      - name: Checkout action repository
        uses: actions/checkout@v4

      # Then, checkout the Salesforce project repository into a specific directory
      - name: Checkout Salesforce project repository
        uses: actions/checkout@v4
        with:
          repository: your-username/your-salesforce-project
          token: ${{ secrets.ACTION_PAT }}
          path: ${{ env.PACKAGING_DIRECTORY }}
          ref: main  # Specify branch, tag, or commit SHA

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: '**/package-lock.json'

      # Optional: Install project dependencies if needed
      - name: Install dependencies
        run: |
          cd ${{ env.PACKAGING_DIRECTORY }}
          npm install

      # Create the package version using the action
      - name: Create package version
        uses: ./  # Use the local action
        id: create-package-version
        with:
          auth-url: ${{ secrets.AUTH_URL }}
          packaging-directory: ${{ env.PACKAGING_DIRECTORY }}
          package-name: ${{ env.PACKAGE_NAME }}
          package-type: Unlocked
          target-dev-hub: ${{ env.TARGET_DEV_HUB }}
          installation-key-bypass: true
          code-coverage: true
          timeout: 90
          polling-interval: 30

      # Use the action outputs
      - name: Show package details
        run: |
          echo "Package Version ID: ${{ steps.create-package-version.outputs.package-version-id }}"
          echo "Package Version Number: ${{ steps.create-package-version.outputs.package-version-number }}"
          echo "Package Report: ${{ steps.create-package-version.outputs.package-report }}"
```

### 💡 Key points about this workflow:

1. It checks out two repositories:
   - The action repository itself (current repository)
   - The Salesforce project repository (external repository)

2. The Salesforce project is checked out to the path specified in `PACKAGING_DIRECTORY`

3. The `packaging-directory` parameter in the action configuration points to where the Salesforce project was checked out

## 📦 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Builds the action using Rollup, creating a bundled JavaScript file in the `dist` directory |
| `npm start` | Runs the action locally using act with the local development workflow |

---

💖 **Thank you for contributing to this project!** We appreciate your time and effort.