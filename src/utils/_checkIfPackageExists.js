import { sfPackageList } from '@sf';

/**
 * Checks if a package exists in the specified Dev Hub org
 *
 * @async
 * @function checkIfPackageExists
 * @param {Object} params - Parameters for checking package existence
 * @param {string} params.packageId - The ID, name, or alias of the package to check
 * @param {string} params.targetDevHub - The Dev Hub org alias or username to check against
 * @returns {Promise<boolean>} True if the package exists, false otherwise
 * @throws {Error} If package list retrieval fails or if the command execution fails
 * 
 * @example
 * // Check if a package exists by ID
 * try {
 *   const exists = await checkIfPackageExists({
 *     packageId: '0Ho1A0000000001',
 *     targetDevHub: 'DevHub'
 *   });
 */
const checkIfPackageExists = async ({ packageId, targetDevHub }) => {
    const packages = await sfPackageList(targetDevHub);
  
    if (packages.status !== 0) {
      throw new Error('Failed to get packages');
    }
  
    return packages.result.some((pkg) => pkg.Id === packageId || pkg.Name === packageId || pkg.Alias === packageId );
  };

export default checkIfPackageExists;