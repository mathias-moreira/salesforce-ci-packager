import * as core from '@actions/core';
import { join } from 'path';
import { createAuthFile, authorizeOrg, deleteAuthFile } from './auth.js';
import { updatePackageAliases, createPackageVersion, pollPackageStatus } from './packaging.js';

try {
  const packagingDirectory = core.getInput('packaging-directory');

  core.info(`Changing to packaging directory ${packagingDirectory}`);
  process.chdir(join(process.cwd(), packagingDirectory));

  const authUrl = core.getInput('auth-url');

  core.info(`Creating auth file.`);
  createAuthFile(authUrl);

  const targetDevHub = core.getInput('target-dev-hub');

  core.info(`Authenticating org ${targetDevHub}`);
  await authorizeOrg(targetDevHub);

  core.info(`Deleting auth file.`);
  deleteAuthFile();

  const packageId = core.getInput('package');
  const installationKeyBypass = core.getInput('installation-key-bypass');
  const installationKey = core.getInput('installation-key');
  const skipValidation = core.getInput('skip-validation');
  const codeCoverage = core.getInput('code-coverage');
  const asyncValidation = core.getInput('async-validation');
  const path = core.getInput('path');
  const versionName = core.getInput('version-name');
  const versionDescription = core.getInput('version-description');
  const versionNumber = core.getInput('version-number');

  core.info(
    `Creating package version for package ${packageId} on dev hub ${targetDevHub}`
  );

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

  if (!result.success) {
    core.setOutput('message', result.error.message);
    core.setFailed(result.error.message);
  } else {
    const timeout = core.getInput('timeout');
    const pollingInterval = core.getInput('polling-interval');
  
    // Convert timeout from minutes to number of retries
    const maxRetries = timeout ? parseInt(timeout) : 60; // Default 60 minutes
  
    // Convert polling interval from seconds to milliseconds
    const pollingIntervalMs = pollingInterval ? parseInt(pollingInterval) * 1000 : 60000; // Default 60 seconds

    core.info(`Polling package status for package version ${result.data.result.Id}`);
    const packageResult = await pollPackageStatus(result.data.result.Id, 0, pollingIntervalMs, maxRetries);

    core.setOutput('message', 'Package version created successfully');
    core.setOutput('package-version-id', packageResult.Id);
    core.setOutput('package-version-number', packageResult.VersionNumber);
    core.setOutput('package-report', JSON.stringify(packageResult, null, 2));

    updatePackageAliases(packageResult);
  }
} catch (error) {
  core.setOutput('message', error.message);
  core.setFailed(error.message);
}
