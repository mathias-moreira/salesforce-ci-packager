/**
 * @module packaging
 * @description Provides utilities for creating and managing Salesforce package versions
 */

import { readFileSync, writeFileSync } from 'fs';
import executeCommand from './utils/execute-command.js';

/**
 * @constant {string} SFDX_PROJECT_FILE - Path to the SFDX project configuration file
 */
const SFDX_PROJECT_FILE = 'sfdx-project.json';

/**
 * @constant {number} POLLING_INTERVAL - Time in milliseconds between status check attempts (1 minute)
 */
const POLLING_INTERVAL = 60000; // 1 minute

/**
 * @constant {number} MAX_RETRIES - Maximum number of status check attempts before timing out (1 hour max wait time)
 */
const MAX_RETRIES = 60; // 1 hour max wait time

/**
 * Updates the package aliases in the sfdx-project.json file with the new package version
 *
 * @function updatePackageAliases
 * @param {Object} packageResult - The package creation result object
 * @param {string} packageResult.Package2Name - The name of the package
 * @param {string} packageResult.VersionNumber - The version number of the package
 * @param {string} packageResult.SubscriberPackageVersionId - The subscriber package version ID
 * @returns {void}
 *
 * @example
 * // Update package aliases with the package result
 * updatePackageAliases({
 *   Package2Name: 'MyPackage',
 *   VersionNumber: '1.0.0.1',
 *   SubscriberPackageVersionId: '04t...'
 * });
 */
const updatePackageAliases = (packageResult) => {
  let file = JSON.parse(readFileSync(SFDX_PROJECT_FILE, 'utf8'));

  if (!file.packageAliases) {
    file.packageAliases = {};
  }

  file.packageAliases[packageResult.Package2Name + '@' + packageResult.VersionNumber] =
    packageResult.SubscriberPackageVersionId;
  writeFileSync(SFDX_PROJECT_FILE, JSON.stringify(file, null, 2));
};

/**
 * Creates a new package version for the specified package ID
 *
 * @async
 * @function createPackageVersion
 * @param {string} packageId - The ID or alias of the package to create a version for
 * @param {Object} options - Options for package version creation
 * @param {string} options.targetDevHub - Username or alias of the Dev Hub org
 * @returns {Promise<Object>} The result of the package version creation
 * @property {boolean} success - Indicates if the package version creation was successful
 * @property {Object|null} data - Package version creation data if successful
 * @property {Object|null} error - Error information if creation failed
 *
 * @example
 * // Create a package version
 * const result = await createPackageVersion('0Ho1A0000000001', {
 *   targetDevHub: 'DevHub'
 * });
 * if (result.success) {
 *   console.log('Package version creation started:', result.data.result.Id);
 * }
 */
async function createPackageVersion(packageId, options) {
  const command = `sf package version create --package ${packageId} --target-dev-hub ${options.targetDevHub} --installation-key-bypass --skip-validation --json`;
  const { success, data, error } = await executeCommand(command);

  if (!success) {
    return {
      success: false,
      error: JSON.parse(error.stdout),
    };
  }

  return { success, data };
}

/**
 * Polls the status of a package version creation job until it completes or times out
 *
 * @async
 * @function pollPackageStatus
 * @param {string} jobId - The job ID of the package version creation request
 * @param {number} [retryCount=0] - Current retry attempt (used internally for recursion)
 * @param {number} [pollingInterval=POLLING_INTERVAL] - Time in milliseconds between status checks
 * @param {number} [maxRetries=MAX_RETRIES] - Maximum number of retry attempts
 * @returns {Promise<Object>} The final package version creation result
 * @property {boolean} success - Always true if this function returns (otherwise it throws)
 * @property {string} Id - The job ID
 * @property {string} Status - The status of the package version creation
 * @property {string} Package2Id - The package ID
 * @property {string} Package2VersionId - The package version ID
 * @property {string} SubscriberPackageVersionId - The subscriber package version ID
 * @property {string} VersionNumber - The version number
 * @property {string} InstallationLink - URL to install the package
 * @throws {Error} If the package creation times out or fails
 *
 * @example
 * // Poll for package status after creating a package version
 * const createResult = await createPackageVersion('0Ho1A0000000001', { targetDevHub: 'DevHub' });
 * if (createResult.success) {
 *   try {
 *     const packageResult = await pollPackageStatus(createResult.data.result.Id);
 *     console.log('Package version created successfully:', packageResult.SubscriberPackageVersionId);
 *     console.log('Installation URL:', packageResult.InstallationLink);
 *   } catch (error) {
 *     console.error('Package creation failed:', error.message);
 *   }
 * }
 */
async function pollPackageStatus(jobId, retryCount = 0, pollingInterval = POLLING_INTERVAL, maxRetries = MAX_RETRIES) {
  if (retryCount >= maxRetries) {
    throw new Error('Package creation timed out.');
  }

  const result = await executeCommand(`sf package version create report -i ${jobId} --json`);

  if (!result.success) {
    throw new Error(`Failed to check package status: ${result.error}`);
  }

  const data = result.data.result[0];

  if (data.Status === 'Success') {
    return {
      success: true,
      ...result.data.result[0],
      InstallationLink: `https://login.salesforce.com/packaging/installPackage.apexp?p0=${data.SubscriberPackageVersionId}`,
    };
  } else if (data.Status === 'Error') {
    throw new Error(`Package creation failed: ${data.Error}`);
  }

  console.log(`[${new Date().toLocaleTimeString()}] - Still in progress... Status: ${data.Status}`);
  await new Promise((resolve) => setTimeout(resolve, pollingInterval));
  return pollPackageStatus(jobId, retryCount + 1, pollingInterval, maxRetries);
}

export { updatePackageAliases, createPackageVersion, pollPackageStatus };
