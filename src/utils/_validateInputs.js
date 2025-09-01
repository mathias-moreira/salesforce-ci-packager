import { getInput, setFailed } from '@actions/core';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Path to the SFDX project configuration file
 * 
 * @constant {string} SFDX_PROJECT_JSON
 */
const SFDX_PROJECT_JSON = 'sfdx-project.json';

/**
 * Validates all input parameters required for the Salesforce packaging action
 *
 * @function validateInputs
 * @returns {Object|null} Object with validated inputs or null if validation fails
 * @property {string} packagingDirectory - Directory containing the packaging files
 * @property {string} authUrl - Salesforce authentication URL
 * @property {string} targetDevHub - Target Dev Hub org alias
 * @property {string} packageName - Package name
 * @property {string} installationKeyBypass - Whether to bypass installation key requirement
 * @property {string} installationKey - Installation key for the package
 * @property {string} skipValidation - Whether to skip validation during package creation
 * @property {string} codeCoverage - Whether to calculate code coverage during package creation
 * @property {number} maxRetries - Maximum number of polling retries (timeout in minutes)
 * @property {number} pollingIntervalMs - Polling interval in milliseconds
 * @property {string} asyncValidation - Whether to use async validation
 * 
 * @example
 * const inputs = validateInputs();
 * if (inputs) {
 *   console.log('All inputs are valid:', inputs);
 *   // Proceed with packaging operation
 * } else {
 *   console.log('Input validation failed');
 * }
 */
const validateInputs = () => {
    const packagingDirectory = getInput('packaging-directory');
  
    // Validate packaging directory if specified
    if (packagingDirectory) {
      const packagingDirPath = join(process.cwd(), packagingDirectory);
      if (!existsSync(packagingDirPath)) {
        setFailed(`Packaging directory does not exist: ${packagingDirPath}`);
        return null;
      }
    }
  
    // Validate sfdx-project.json exists in the current directory
    if (!existsSync(join(process.cwd(), packagingDirectory, SFDX_PROJECT_JSON))) {
      setFailed(`${SFDX_PROJECT_JSON} not found in the current directory`);
      return null;
    }
  
    // Validate auth URL
    const authUrl = getInput('auth-url');
    if (!authUrl) {
      setFailed('Auth URL is required');
      return null;
    }
  
    // Validate target dev hub
    const targetDevHub = getInput('target-dev-hub');
    if (!targetDevHub) {
      setFailed('Target Dev Hub is required');
      return null;
    }
  
    // Validate package name
    const packageName = getInput('package-name');
    if (!packageName) {
      setFailed('Package name is required');
      return null;
    }
      return null;
    }
  
    // Validate installation key parameters
    const installationKeyBypass = getInput('installation-key-bypass');
    const installationKey = getInput('installation-key');
  
    if (!installationKeyBypass && !installationKey) {
      setFailed('Either installation-key or installation-key-bypass must be provided');
      return null;
    }
  
    if (installationKeyBypass && installationKey) {
      setFailed('Cannot provide both installation-key and installation-key-bypass');
      return null;
    }
  
    // Validate skip-validation and code-coverage
    const skipValidation = getInput('skip-validation');
    const codeCoverage = getInput('code-coverage');
  
    if (skipValidation === 'true' && codeCoverage === 'true') {
      setFailed('Cannot specify both skip-validation and code-coverage');
      return null;
    }
  
    // Validate timeout
    const timeout = getInput('timeout');
    const maxRetries = timeout ? parseInt(timeout) : 60; // Default 60 minutes
  
    if (maxRetries <= 0) {
      setFailed('Timeout must be a positive number');
      return null;
    }
  
    // Validate polling interval
    const pollingInterval = getInput('polling-interval');
    const pollingIntervalMs = pollingInterval ? parseInt(pollingInterval) * 1000 : 60000; // Default 60 seconds
  
    if (pollingIntervalMs <= 0) {
      setFailed('Polling interval must be a positive number');
      return null;
    }
  
    // Get additional inputs
    const asyncValidation = getInput('async-validation');
  
    return {
      packagingDirectory,
      authUrl,
      targetDevHub,
      packageName,
      installationKeyBypass,
      installationKey,
      skipValidation,
      codeCoverage,
      maxRetries,
      pollingIntervalMs,
      asyncValidation
    };
  };

export default validateInputs;