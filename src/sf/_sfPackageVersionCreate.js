import { executeCommand } from '../utils';
/**
 * Creates a new Salesforce package version for the specified package ID
 *
 * @async
 * @function sfPackageVersionCreate
 * @param {Object} params - Parameters for package version creation
 * @param {string} params.packageId - The ID or alias of the package to create a version for
 * @param {string} params.targetDevHub - Username or alias of the Dev Hub org
 * @param {string} [params.installationKeyBypass] - If 'true', bypass the installation key requirement
 * @param {string} [params.installationKey] - Installation key for the package version (required if installationKeyBypass is not 'true')
 * @param {string} [params.skipValidation] - If 'true', skip validation during package version creation
 * @param {string} [params.codeCoverage] - If 'true', calculate code coverage during package version creation
 * @param {string} [params.asyncValidation] - If 'true', return a new package version before completing package validations
 * @returns {Promise<Object>} The result of the package version creation command
 * @property {number} status - The exit code of the command (0 for success)
 * @property {Object} result - The result data containing job information
 * @property {string} result.Id - The job ID for tracking the package version creation
 * @property {string} result.Status - Initial status of the package creation job
 * @throws {Object} Rejects with error information if the command fails
 * 
 * @remarks
 * The path, version name, version description, and version number are read from sfdx-project.json.
 * This function starts the package version creation process asynchronously. To get the final
 * package version details, you need to poll the status using sfPackageVersionCreateReport.
 *
 * @example
 * // Create a package version with installation key
 * const result = await sfPackageVersionCreate({
 *   packageId: '0Ho1A0000000001',
 *   targetDevHub: 'DevHub',
 *   installationKey: 'MySecureKey123',
 *   codeCoverage: 'true'
 * });
 */
async function sfPackageVersionCreate({packageId, targetDevHub, installationKeyBypass, installationKey, skipValidation, codeCoverage, asyncValidation}) {
    let command = `npx @salesforce/cli package version create --package ${packageId} --target-dev-hub ${targetDevHub}`;
    
    // Add installation key bypass option if provided
    if (installationKeyBypass === 'true') {
      command += ` --installation-key-bypass`;
    }
    
    // Add installation key if provided
    if (installationKey) {
      command += ` --installation-key ${installationKey}`;
    }
    
    // Add skip validation option if provided
    if (skipValidation === 'true') {
      command += ` --skip-validation`;
    }
    
    // Add code coverage option if provided
    if (codeCoverage === 'true') {
      command += ` --code-coverage`;
    }
    
    // Add async validation option if provided
    if (asyncValidation === 'true') {
      command += ` --async-validation`;
    }
  
    // Always return JSON output
    command += ` --json`;
  
    return await executeCommand({command});
  }

  export default sfPackageVersionCreate;