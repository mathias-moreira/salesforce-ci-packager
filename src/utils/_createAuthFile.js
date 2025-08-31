import { writeFileSync } from "fs";

/**
 * Creates a temporary file containing the Salesforce authentication URL
 * 
 * @function createAuthFile
 * @param {Object} params - Parameters for creating the auth file
 * @param {string} params.authFileName - The name of the temporary authentication file to create
 * @param {string} params.authUrl - The Salesforce authentication URL in sfdx-url format
 * @returns {void}
 * @throws {Error} If file writing fails
 * 
 * @example
 * // Create an authentication file with the provided URL
 * createAuthFile({
 *   authFileName: 'auth.key',
 *   authUrl: 'force://CLIENT_ID:CLIENT_SECRET:REFRESH_TOKEN@INSTANCE_URL'
 * });
 * 
 * @remarks
 * This file is typically used temporarily for authentication and should be deleted after use.
 */
const createAuthFile = ({authFileName, authUrl}) => {
    writeFileSync(authFileName, authUrl);
}

export default createAuthFile;