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
 * @returns {Promise<Object>} A promise that resolves with the parsed command result from Salesforce CLI
 * @throws {Object} Rejects with the parsed error output when command fails with non-zero status
 * @throws {Error} Rejects with parsing error if JSON parsing fails
 * @throws {Error} Rejects with execution error if command execution fails
 * 
 * @example
 * // Execute a Salesforce CLI command
 * try {
 *   const result = await executeCommand('sf package version create --json');
 *   console.log(result);
 * } catch (error) {
 *   console.error('Command failed:', error);
 * }
 * 
 * @remarks
 * This utility is specifically designed to work with Salesforce CLI commands that return JSON output.
 * Always include the --json flag in your commands to ensure proper parsing.
 * The function resolves with the complete parsed JSON output from the CLI command.
 * If the command returns a non-zero status, the promise will reject with the parsed error output.
 */
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        try {
            exec(command, (error, stdout, stderr) => {
                try {
                    const parsedOutput = JSON.parse(stdout);
    
                    if (parsedOutput.status !== 0) {
                        reject(parsedOutput);
                    }
    
                    resolve(parsedOutput);
                } catch (error) {
                    reject(error);
                }
            });
            
        } catch (error) {
            reject(error);      
        }
    });
}

export default executeCommand;