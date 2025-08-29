import * as core from '@actions/core';
import { join } from 'path';
import { existsSync } from 'fs';
import { createAuthFile, authorizeOrg, deleteAuthFile } from './auth.js';
import { updatePackageAliases, createPackageVersion, pollPackageStatus } from './packaging.js';

const SFDX_PROJECT_JSON = 'sfdx-project.json';

/**
 * Main function that orchestrates the package version creation process.
 * 
 * @function main
 * @returns {Promise<void>}
 */
const main = async () => {
  try {
    const packagingDirectory = core.getInput('packaging-directory');

    // Only change directory if packaging directory is specified
    if (packagingDirectory) {
      const packagingDirPath = join(process.cwd(), packagingDirectory);

      // Validate that the directory exists if specified
      if (!existsSync(packagingDirPath)) {
        core.setFailed(`Packaging directory does not exist: ${packagingDirPath}`);
        return;
      }

      core.info(`Changing to packaging directory ${packagingDirectory}`);
      process.chdir(packagingDirPath);
    }

    // Validate sfdx-project.json exists in the current directory
    if (!existsSync(SFDX_PROJECT_JSON)) {
      core.setFailed(`${SFDX_PROJECT_JSON} not found in the current directory`);
      return;
    }

    const authUrl = core.getInput('auth-url');
    console.log('authUrl', authUrl);
    if (!authUrl) {
      core.setFailed('Auth URL is required');
      return;
    }

    core.info(`Creating auth file.`);
    createAuthFile(authUrl);

    const targetDevHub = core.getInput('target-dev-hub');
    if (!targetDevHub) {
      core.setFailed('Target Dev Hub is required');
      return;
    }

    core.info(`Authenticating org ${targetDevHub}`);
    await authorizeOrg(targetDevHub);

    core.info(`Deleting auth file.`);
    deleteAuthFile();

    const packageId = core.getInput('package');
    if (!packageId) {
      core.setFailed('Package ID or alias is required');
      return;
    }

    const installationKeyBypass = core.getInput('installation-key-bypass');
    const installationKey = core.getInput('installation-key');

    // Validate installation key or bypass is provided
    if (!installationKeyBypass && !installationKey) {
      core.setFailed('Either installation-key or installation-key-bypass must be provided');
      return;
    }

    // Validate that both installation key and bypass are not provided together
    if (installationKeyBypass && installationKey) {
      core.setFailed('Cannot provide both installation-key and installation-key-bypass');
      return;
    }

    const skipValidation = core.getInput('skip-validation');
    const codeCoverage = core.getInput('code-coverage');

    // Validate that skip-validation and code-coverage are not both provided
    if (skipValidation === 'true' && codeCoverage === 'true') {
      core.setFailed('Cannot specify both skip-validation and code-coverage');
      return;
    }

    const asyncValidation = core.getInput('async-validation');
    const path = core.getInput('path');
    const versionName = core.getInput('version-name');
    const versionDescription = core.getInput('version-description');
    const versionNumber = core.getInput('version-number');

    core.info(`Creating package version for package ${packageId} on dev hub ${targetDevHub}`);

    const result = await createPackageVersion(packageId, {
      targetDevHub,
      installationKeyBypass,
      installationKey,
      skipValidation,
      codeCoverage,
      asyncValidation,
      path,
      versionName,
      versionDescription,
      versionNumber,
    });

    const timeout = core.getInput('timeout');
    const pollingInterval = core.getInput('polling-interval');

    // Convert timeout from minutes to number of retries
    const maxRetries = timeout ? parseInt(timeout) : 60; // Default 60 minutes

    // Validate timeout is a positive number
    if (maxRetries <= 0) {
      core.setFailed('Timeout must be a positive number');
      return;
    }

    // Convert polling interval from seconds to milliseconds
    const pollingIntervalMs = pollingInterval ? parseInt(pollingInterval) * 1000 : 60000; // Default 60 seconds

    // Validate polling interval is a positive number
    if (pollingIntervalMs <= 0) {
      core.setFailed('Polling interval must be a positive number');
      return;
    }

    core.info(`Polling package status for package version ${result.result.Id}`);
    const packageResult = await pollPackageStatus(result.result.Id, 0, pollingIntervalMs, maxRetries);

    core.setOutput('message', 'Package version created successfully');
    core.setOutput('package-version-id', packageResult.Id);
    core.setOutput('package-version-number', packageResult.VersionNumber);
    core.setOutput('package-report', JSON.stringify(packageResult, null, 2));

    updatePackageAliases(packageResult);
  } catch (error) {
    core.error(JSON.stringify(error, null, 2));
    core.setOutput('message', error.message);
    core.setFailed(error.message);
  }
};

main();
