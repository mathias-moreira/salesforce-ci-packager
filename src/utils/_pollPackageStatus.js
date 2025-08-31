/**
 * @module packaging-poll
 * @description Provides utilities for polling and monitoring Salesforce package version creation status
 */

import { sfPackageVersionCreateReport } from '@sf';
import { info } from '@actions/core';

/**
 * Default time in milliseconds between status check attempts (1 minute)
 * 
 * @constant {number} POLLING_INTERVAL
 */
const POLLING_INTERVAL = 60000; // 1 minute

/**
 * Default maximum number of status check attempts before timing out (1 hour max wait time)
 * 
 * @constant {number} MAX_RETRIES
 */
const MAX_RETRIES = 60; // 1 hour max wait time

/**
 * Polls the status of a package version creation job until it completes or times out
 *
 * @async
 * @function pollPackageStatus
 * @param {Object} params - The parameters for polling package status
 * @param {string} params.jobId - The job ID of the package version creation request
 * @param {number} [params.retryCount=0] - Current retry attempt (used internally for recursion)
 * @param {number} [params.pollingInterval=POLLING_INTERVAL] - Time in milliseconds between status checks
 * @param {number} [params.maxRetries=MAX_RETRIES] - Maximum number of retry attempts
 * @returns {Promise<Object>} The final package version creation result
 * @property {string} Id - The job ID
 * @property {string} Status - The status of the package version creation (always "Success" if function returns)
 * @property {string} Package2Id - The package ID
 * @property {string} Package2VersionId - The package version ID
 * @property {string} SubscriberPackageVersionId - The subscriber package version ID (04t format)
 * @property {string} VersionNumber - The version number in format major.minor.patch.build
 * @property {string} InstallationLink - URL to install the package in a Salesforce org
 * @throws {Error} If the package creation times out after maxRetries attempts
 * @throws {Error} If the package creation fails with an error status
 *
 * @example
 * // Poll for package status after creating a package version
 * const createResult = await sfPackageVersionCreate({
 *   packageId: '0Ho1A0000000001',
 *   targetDevHub: 'DevHub'
 * });
 */
async function pollPackageStatus({jobId, retryCount = 0, pollingInterval = POLLING_INTERVAL, maxRetries = MAX_RETRIES}) {
  if (retryCount >= maxRetries) {
    throw new Error('Package creation timed out.');
  }

  const result = await sfPackageVersionCreateReport({jobId});

  const data = result.result[0];

  if (data.Status === 'Success') {
    return {
      ...result.result[0],
      InstallationLink: `https://login.salesforce.com/packaging/installPackage.apexp?p0=${data.SubscriberPackageVersionId}`,
    };
  } else if (data.Status === 'Error') {
    throw new Error(`Package creation failed: ${data.Error}`);
  }

  info(`[${new Date().toLocaleTimeString()}] - Still in progress... Status: ${data.Status}`);
  await new Promise((resolve) => setTimeout(resolve, pollingInterval));
  return pollPackageStatus({jobId, retryCount: retryCount + 1, pollingInterval, maxRetries});
}



export default pollPackageStatus;
