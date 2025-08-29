/**
 * @module index
 * @description Main entry point for the Salesforce CI Packager (2GP) GitHub Action
 */

import * as core from '@actions/core';
import { join } from 'path';
import { existsSync } from 'fs';
import { createAuthFile, authorizeOrg, deleteAuthFile } from './auth.js';
import { updatePackageAliases, createPackageVersion, pollPackageStatus } from './packaging.js';

/**
 * @constant {string} SFDX_PROJECT_JSON - Path to the SFDX project configuration file
 */
const SFDX_PROJECT_JSON = 'sfdx-project.json';

/**
 * Validates all input parameters for the action
 * 
 * @function validateInputs
 * @returns {Object|null} Object with validated inputs or null if validation fails
 */
const validateInputs = () => {
  const packagingDirectory = core.getInput('packaging-directory');

  // Validate packaging directory if specified
  if (packagingDirectory) {
    const packagingDirPath = join(process.cwd(), packagingDirectory);
    if (!existsSync(packagingDirPath)) {
      core.setFailed(`Packaging directory does not exist: ${packagingDirPath}`);
      return null;
    }
  }

  // Validate sfdx-project.json exists in the current directory
  if (!existsSync(join(process.cwd(), packagingDirectory, SFDX_PROJECT_JSON))) {
    core.setFailed(`${SFDX_PROJECT_JSON} not found in the current directory`);
    return null;
  }

  // Validate auth URL
  const authUrl = core.getInput('auth-url');
  if (!authUrl) {
    core.setFailed('Auth URL is required');
    return null;
  }

  // Validate target dev hub
  const targetDevHub = core.getInput('target-dev-hub');
  if (!targetDevHub) {
    core.setFailed('Target Dev Hub is required');
    return null;
  }

  // Validate package ID
  const packageId = core.getInput('package');
  if (!packageId) {
    core.setFailed('Package ID or alias is required');
    return null;
  }

  // Validate installation key parameters
  const installationKeyBypass = core.getInput('installation-key-bypass');
  const installationKey = core.getInput('installation-key');

  if (!installationKeyBypass && !installationKey) {
    core.setFailed('Either installation-key or installation-key-bypass must be provided');
    return null;
  }

  if (installationKeyBypass && installationKey) {
    core.setFailed('Cannot provide both installation-key and installation-key-bypass');
    return null;
  }

  // Validate skip-validation and code-coverage
  const skipValidation = core.getInput('skip-validation');
  const codeCoverage = core.getInput('code-coverage');
  
  if (skipValidation === 'true' && codeCoverage === 'true') {
    core.setFailed('Cannot specify both skip-validation and code-coverage');
    return null;
  }
  
  // Validate timeout
  const timeout = core.getInput('timeout');
  const maxRetries = timeout ? parseInt(timeout) : 60; // Default 60 minutes
  
  if (maxRetries <= 0) {
    core.setFailed('Timeout must be a positive number');
    return null;
  }
  
  // Validate polling interval
  const pollingInterval = core.getInput('polling-interval');
  const pollingIntervalMs = pollingInterval ? parseInt(pollingInterval) * 1000 : 60000; // Default 60 seconds
  
  if (pollingIntervalMs <= 0) {
    core.setFailed('Polling interval must be a positive number');
    return null;
  }
  
  // Get additional inputs
  const asyncValidation = core.getInput('async-validation');
  const path = core.getInput('path');
  const versionName = core.getInput('version-name');
  const versionDescription = core.getInput('version-description');
  const versionNumber = core.getInput('version-number');
  
  return { 
    packagingDirectory,
    authUrl,
    targetDevHub,
    packageId,
    installationKeyBypass,
    installationKey,
    skipValidation,
    codeCoverage,
    maxRetries,
    pollingIntervalMs,
    asyncValidation,
    path,
    versionName,
    versionDescription,
    versionNumber
  };
};

/**
 * Main function that orchestrates the package version creation process.
 * 
 * @function main
 * @returns {Promise<void>}
 */
const main = async () => {
  try {
    // Validate all inputs
    const inputs = validateInputs();
    if (!inputs) return;
    
    // Extract validated inputs
    const { 
      packagingDirectory,
      authUrl,
      targetDevHub,
      packageId,
      installationKeyBypass,
      installationKey,
      skipValidation,
      codeCoverage,
      maxRetries,
      pollingIntervalMs,
      asyncValidation,
      path,
      versionName,
      versionDescription,
      versionNumber
    } = inputs;
    
    // Change to packaging directory if specified
    if (packagingDirectory) {
      core.info(`Changing to packaging directory ${packagingDirectory}`);
      process.chdir(join(process.cwd(), packagingDirectory));
    }

    core.info('Creating authentication file');
    createAuthFile(authUrl);

    core.info(`Authenticating org ${targetDevHub}`);
    await authorizeOrg(targetDevHub);

    core.info('Deleting authentication file');
    deleteAuthFile();

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

    // Polling configuration already validated and extracted in validateInputs()

    core.info(`Polling package status for package version ${result.result.Id}`);
    core.info(`Using polling interval of ${pollingIntervalMs/1000} seconds with a maximum timeout of ${maxRetries} minutes`);
    const packageResult = await pollPackageStatus(result.result.Id, 0, pollingIntervalMs, maxRetries);

    core.setOutput('message', 'Package version created successfully');
    core.setOutput('package-version-id', packageResult.Id);
    core.setOutput('package-version-number', packageResult.VersionNumber);
    core.setOutput('package-report', JSON.stringify(packageResult, null, 2));

    updatePackageAliases(packageResult);
  } catch (error) {
    // Log detailed error for debugging
    core.debug(`Full error details: ${JSON.stringify(error, null, 2)}`);
    
    // Set more user-friendly error message
    const errorMessage = error.message || 'Unknown error occurred during package creation';
    core.setOutput('message', errorMessage);
    core.setFailed(errorMessage);
  }
};

// Execute the main function
main();
