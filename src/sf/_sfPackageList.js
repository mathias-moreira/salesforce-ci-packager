import { executeCommand } from '../utils';

/**
 * Retrieves a list of packages from the specified Dev Hub org
 *
 * @async
 * @function sfPackageList
 * @param {Object} params - Parameters for listing packages
 * @param {string} params.targetDevHub - Username or alias of the Dev Hub org
 * @returns {Promise<Object>} The result of the package list command
 * @property {number} status - The exit code of the command (0 for success)
 * @property {Array<Object>} result - Array of package objects
 * @property {string} result[].Id - The ID of the package (0Ho format)
 * @property {string} result[].SubscriberPackageId - The subscriber package ID (033 format)
 * @property {string} result[].Name - The name of the package
 * @property {string} [result[].Description] - The description of the package
 * @property {string} [result[].NamespacePrefix] - The namespace prefix of the package
 * @property {string} result[].ContainerOptions - The container options of the package (e.g., "Unlocked")
 * @property {string} [result[].ConvertedFromPackageId] - The ID of the package this was converted from
 * @property {string} result[].Alias - The alias of the package
 * @property {string} result[].IsOrgDependent - Indicates if the package is org dependent ("Yes" or "No")
 * @property {string} [result[].PackageErrorUsername] - The username associated with package errors
 * @property {boolean} result[].AppAnalyticsEnabled - Indicates if app analytics are enabled
 * @property {string} result[].CreatedBy - The ID of the user who created the package
 * @property {Array<Object>} [warnings] - Any warnings returned by the command
 * @throws {Object} Rejects with error information if the command fails
 * 
 * @example
 * // Get all packages in the Dev Hub
 * const packages = await sfPackageList({
 *   targetDevHub: 'MyDevHub'
 * });
 * 
 * if (packages.status === 0) {
 *   console.log(`Found ${packages.result.length} packages:`);
 *   packages.result.forEach(pkg => {
 *     console.log(`- ${pkg.Name} (${pkg.Id})`);
 *   });
 * }
 */
const sfPackageList = async (targetDevHub) => {
    return await executeCommand({command: `npx @salesforce/cli package list --target-dev-hub ${targetDevHub} --verbose --json`});
}

export default sfPackageList;