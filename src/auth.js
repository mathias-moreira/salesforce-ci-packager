/**
 * @module auth
 * @description Provides utilities for Salesforce org authentication using URL-based authentication files
 */

import { writeFileSync, unlinkSync } from "fs";
import executeCommand from "./utils/execute-command.js";

/**
 * @constant {string} AUTH_FILE - The name of the temporary authentication file
 */
const AUTH_FILE = "authFile.txt";

/**
 * Creates a temporary file containing the Salesforce authentication URL
 * 
 * @function createAuthFile
 * @param {string} authUrl - The Salesforce authentication URL
 * @returns {void}
 * 
 * @example
 * // Create an authentication file with the provided URL
 * createAuthFile('force://CLIENT_ID:CLIENT_SECRET:REFRESH_TOKEN@INSTANCE_URL');
 */
const createAuthFile = (authUrl) => {
    writeFileSync(AUTH_FILE, authUrl);
}

/**
 * Authorizes a Salesforce org using the authentication file
 * 
 * @async
 * @function authorizeOrg
 * @param {string} targetDevHub - The alias to assign to the authenticated org
 * @returns {Promise<Object>} The result of the authentication command
 * @property {boolean} success - Indicates if the authentication was successful
 * @property {Object|null} error - Error information if authentication failed, null otherwise
 * @property {Object|null} data - Authentication data if successful, null otherwise
 * @throws {Error} If the authentication file does not exist
 * 
 * @example
 * // First create the auth file, then authorize the org
 * createAuthFile('force://CLIENT_ID:CLIENT_SECRET:REFRESH_TOKEN@INSTANCE_URL');
 * const result = await authorizeOrg('DevHub');
 * if (result.success) {
 *   console.log('Successfully authenticated to the org');
 * }
 * 
 * @remarks
 * The authentication file (AUTH_FILE) must exist before calling this function.
 * Typically, you should call createAuthFile() before calling this function.
 */
const authorizeOrg = async (targetDevHub) => {
  return await executeCommand(`sf org login sfdx-url -f ./${AUTH_FILE} -a ${targetDevHub} -d --json`);
}

/**
 * Deletes the temporary authentication file
 * 
 * @function deleteAuthFile
 * @returns {void}
 * 
 * @example
 * // Delete the authentication file after successful authentication
 * deleteAuthFile();
 */
const deleteAuthFile = () => {
  unlinkSync(AUTH_FILE);
}

export { createAuthFile, authorizeOrg, deleteAuthFile };
