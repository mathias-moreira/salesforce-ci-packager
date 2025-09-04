import { executeCommand } from '@cli';

/**
 * Retrieves the status of a package version creation job
 *
 * @async
 * @function sfPackageVersionCreateReport
 * @param {Object} params - Parameters for retrieving package version status
 * @param {string} params.jobId - The job ID of the package version creation request
 * @returns {Promise<Object>} The result of the status check command
 * @property {number} status - The exit code of the command (0 for success)
 * @property {Array<Object>} result - Array containing the package version creation status
 * @property {string} result[0].Id - The job ID
 * @property {string} result[0].Status - The status of the package version creation (Success, Error, InProgress)
 * @property {string} [result[0].Package2Id] - The package ID
 * @property {string} [result[0].Package2VersionId] - The package version ID
 * @property {string} [result[0].SubscriberPackageVersionId] - The subscriber package version ID (04t format)
 * @property {string} [result[0].VersionNumber] - The version number
 * @property {string} [result[0].Error] - Error message if status is Error
 * @throws {Object} Rejects with error information if the command fails
 * 
 * @example
 * // Check status of a package version creation job
 * const status = await sfPackageVersionCreateReport({
 *   jobId: '08c...'
 * });
 */
const sfPackageVersionCreateReport = async ({jobId}) => {
  return await executeCommand({command: `npx @salesforce/cli package version create report -i ${jobId} --json`});
}

export default sfPackageVersionCreateReport;