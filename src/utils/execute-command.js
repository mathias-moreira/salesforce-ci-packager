/**
 * @module execute-command
 * @description A utility module that provides a Promise-based wrapper specifically for executing Salesforce CLI commands that return JSON output
 */

import { exec } from 'child_process';

/**
 * Executes a Salesforce CLI command and processes its JSON output
 * 
 * @async
 * @function executeCommand
 * @param {string} command - The Salesforce CLI command to execute (must include --json flag)
 * @returns {Promise<Object>} A promise that resolves with the parsed command result
 * @property {boolean} success - Indicates if the command executed successfully
 * @property {Object|null} error - Error information if command failed, null otherwise
 * @property {Object|null} data - Parsed JSON output from the SF command if successful, null otherwise
 * @throws {Object} Rejection object with success, error and data properties when command fails or JSON parsing fails
 * 
 * @example
 * // Execute a Salesforce CLI command
 * const result = await executeCommand('sf package version create --json');
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error);
 * }
 * 
 * @remarks
 * This utility is specifically designed to work with Salesforce CLI commands that return JSON output.
 * Always include the --json flag in your commands to ensure proper parsing.
 */
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        try {
            exec(command, (error, stdout, stderr) => {
                try {
                    const parsedOutput = JSON.parse(stdout);
    
                    if (parsedOutput.status !== 0) {
                        reject({ success: false, error: parsedOutput, data: null });
                    }
    
                    resolve({ success: true, error: null, data: parsedOutput });
                } catch (error) {
                    reject({ success: false, error, data: null });
                }
            });
            
        } catch (error) {
            reject({ success: false, error, data: null });      
        }
    });
}

export default executeCommand;