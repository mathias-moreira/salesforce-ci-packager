/**
 * Package Status Pooler
 *
 * A utility script that polls the status of a Salesforce package version creation job.
 * This script continuously checks the status of a package creation job until it 
 * completes or fails, providing real-time status updates.
 *
 * Usage:
 * ```bash
 * node package-status-pooler.js -p <packageId>
 * node package-status-pooler.js --package <packageId>
 * ```
 *
 * Configuration:
 * - POLLING_INTERVAL: Time between status checks (default: 60000ms / 1 minute)
 * - MAX_RETRIES: Maximum number of polling attempts (default: 60 attempts / 1 hour)
 * 
 * @example
 * node package-status-pooler.js -p 08cRQ0000007nTpYAI
 *
 * @returns { Object } On success, returns:
 * {
 *   success: true,
 *   version: "04tXXXXXXXXXXXXX", // Subscriber Package Version Id
 *   versionNumber: "1.0.0.1",    // Package version number
 *   status: "Success"            // Final status
 * }
 */

import executeCommand from './execute-command.js';

const POLLING_INTERVAL = 60000; // 1 minute
const MAX_RETRIES = 60; // 1 hour max wait time

async function pollPackageStatus(jobId, retryCount = 0, pollingInterval = POLLING_INTERVAL, maxRetries = MAX_RETRIES) {
    if (retryCount >= maxRetries) {
        throw new Error('Package creation timed out after 1 hour');
    }

    const command = `sf package version create report -i ${jobId} --json`;
    const result = await executeCommand(command);

    if (!result.success) {
        throw new Error(`Failed to check package status: ${result.error}`);
    }

    const data = result.data.result[0];

    if (data.Status === 'Success') {
        return {
            success: true,
            ...result.data.result[0],
            InstallationLink: `https://login.salesforce.com/packaging/installPackage.apexp?p0=${data.SubscriberPackageVersionId}`
        };
    } else if (data.Status === 'Error') {
        throw new Error(`Package creation failed: ${data.Error}`);
    }

    console.log(`[${new Date().toLocaleTimeString()}] - Still in progress... Status: ${data.Status}`);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    await new Promise(resolve => setTimeout(resolve, pollingInterval));
    return pollPackageStatus(jobId, retryCount + 1, pollingInterval, maxRetries);
}

export default pollPackageStatus;