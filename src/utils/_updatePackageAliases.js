/**
 * Updates the package aliases in the sfdx-project.json file with the new package version
 *
 * @function updatePackageAliases
 * @param {Object} params - Parameters for updating the package aliases
 * @param {Object} params.sfdxProjectConfig - The sfdx-project.json configuration object
 * @param {string} params.package2Name - The name of the package
 * @param {string} params.versionNumber - The version number of the package
 * @param {string} params.subscriberPackageVersionId - The subscriber package version ID
 * @param {Object} packageResult - The package updated sfdx-project.json configuration object
 * @returns {void}
 *
 * @example
 * // Update package aliases with the package result
 * updatePackageAliases({
 *   sfdxProjectConfig: {
 *     packageAliases: {
 *       'MyPackage@1.0.0.1': '04t...'
 *     }
 *   },
 *   Package2Name: 'MyPackage',
 *   VersionNumber: '1.0.0.1',
 *   SubscriberPackageVersionId: '04t...'
 * });
 */
const updatePackageAliases = ({ sfdxProjectConfig, packageName, versionNumber, packageOrVersionId }) => {
  if (!sfdxProjectConfig.packageAliases) {
    sfdxProjectConfig.packageAliases = {};
  }

  // This is for a new package version
  if (packageName && versionNumber && packageOrVersionId) {
    // This is for a new package version
    sfdxProjectConfig.packageAliases[packageName + '@' + versionNumber] = packageOrVersionId;

  } else if (packageName && packageOrVersionId) {
    // This is for a new package
    sfdxProjectConfig.packageAliases[packageName] = packageOrVersionId;
  }

  return sfdxProjectConfig;
};

export default updatePackageAliases;
