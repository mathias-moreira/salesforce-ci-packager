import { executeCommand } from '../utils';
import { info } from '@actions/core';

/**
 * Authorizes a Salesforce org using the authentication file
 *
 * @async
 * @function sfOrgLogin
 * @param {Object} params - The parameters for the org login
 * @param {string} params.targetDevHub - The alias to assign to the authenticated org
 * @param {string} params.authFileName - The name of the temporary authentication file
 * @returns {Promise<Object>} The result of the authentication command
 * @property {boolean} success - Indicates if the authentication was successful
 * @property {Object|null} error - Error information if authentication failed, null otherwise
 * @property {Object|null} data - Authentication data if successful, null otherwise
 * @throws {Error} If the authentication file does not exist or if the command execution fails
 *
 * @example
 * // First create the auth file, then authorize the org
 * await createAuthFile({
 *   authUrl: 'force://CLIENT_ID:CLIENT_SECRET:REFRESH_TOKEN@INSTANCE_URL',
 *   authFileName: 'auth.key'
 * });
 * const result = await sfOrgLogin({
 *   targetDevHub: 'DevHub',
 *   authFileName: 'auth.key'
 * });
 * if (result.success) {
 *   console.log('Successfully authenticated to the org');
 * }
 *
 * @remarks
 * The authentication file must exist before calling this function.
 * Typically, you should call createAuthFile() before calling this function.
 * This function uses the Salesforce CLI to authenticate with the org.
 */
const sfOrgLogin = async ({targetDevHub, authFileName}) => {
  info(`authFilePath: ${authFileName}`);
  info(`targetDevHub: ${targetDevHub}`);
  return await executeCommand({command: `npx @salesforce/cli org login sfdx-url -f ./${authFileName} -a ${targetDevHub} -d --json`});
};

export default sfOrgLogin;