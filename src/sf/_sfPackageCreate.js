import { executeCommand } from '../utils';

/**
 * Creates a new package in the Dev Hub org
 *
 * @async
 * @function sfPackageCreate
 * @param {Object} params - Parameters for package creation
 * @param {string} params.targetDevHub - Username or alias of the Dev Hub org
 * @param {string} params.name - Name of the package to create
 * @param {string} params.packageType - Type of package ('Managed' or 'Unlocked')
 * @param {boolean} [params.noNamespace] - Create the package with no namespace (for unlocked packages only)
 * @param {boolean} [params.orgDependent] - Depends on unpackaged metadata in the installation org (for unlocked packages only)
 * @param {string} [params.errorNotificationUsername] - Active Dev Hub user designated to receive email notifications for package errors
 * @param {string} [params.apiVersion] - Override the API version used for API requests made by this command
 * @returns {Promise<Object>} The result of the package creation command
 * @property {number} status - The exit code of the command (0 for success)
 * @property {Object} result - The result data containing package information
 * @property {string} result.Id - The ID of the created package (0Ho format)
 * @property {string} result.SubscriberPackageId - The subscriber package ID (033 format)
 * @property {string} result.Name - The name of the created package
 * @property {string} result.Description - The description of the package
 * @property {string} result.NamespacePrefix - The namespace prefix of the package
 * @property {string} result.ContainerOptions - The container options of the package
 * @throws {Object} Rejects with error information if the command fails
 *
 * @example
 * // Create a new unlocked package with no namespace
 * try {
 *   const result = await sfPackageCreate({
 *     targetDevHub: 'DevHub',
 *     name: 'MyUnlockedPackage',
 *     packageType: 'Unlocked',
 *     noNamespace: true
 *   });
 */
const sfPackageCreate = async ({targetDevHub, packageName, packageType, path, noNamespace, orgDependent, errorNotificationUsername, apiVersion}) => {
    let command = `npx @salesforce/cli package create --target-dev-hub ${targetDevHub}`;
    
    // Add required parameters
    if (packageName) {
      command += ` --name ${packageName}`;
    }
    
    if (packageType) {
      command += ` --package-type ${packageType}`;
    }
  
    if (noNamespace === true) {
      command += ` --no-namespace`;
    }
    
    if (orgDependent === true) {
      command += ` --org-dependent`;
    }
    
    if (errorNotificationUsername) {
      command += ` --error-notification-username ${errorNotificationUsername}`;
    }
    
    if (apiVersion) {
      command += ` --api-version ${apiVersion}`;
    }
    
    // Always return JSON output
    command += ` --json`;
    
    return executeCommand({command});
  }

  export default sfPackageCreate;