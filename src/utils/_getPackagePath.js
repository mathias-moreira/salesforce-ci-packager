/**
 * Gets the path to the package directory (path that will contain the package contents) from sfdx-project.json file
 *
 * @function getPackagePath
 * @param {Object} params - Parameters for getting the package path
 * @param {Object} params.sfdxProjectConfig - The sfdx-project.json configuration object
 * @param {string} params.packageName - The name of the package to get the path for
 * @returns {string|null} The corresponding path from the project file or null if not found
 */
const getPackagePath = ({sfdxProjectConfig, packageName}) => {
  // Look for a directory with a package name that matches
  if (sfdxProjectConfig.packageDirectories && sfdxProjectConfig.packageDirectories.length > 0) {
    const packageDirectory = sfdxProjectConfig.packageDirectories.find((packageDirectory) => {
      return packageDirectory.name === packageName;
    });

    if (packageDirectory && packageDirectory.path) {
      // Return the path to the package directory
      return packageDirectory.path;
    }
  }

  // No package directory found for the given package name
  return null;
};

export default getPackagePath;
