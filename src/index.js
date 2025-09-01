/**
 * @module index
 * @description Main entry point for the Salesforce CI Packager (2GP) GitHub Action
 */

import { writeFileSync, unlinkSync } from 'fs';
import { info, setOutput, setFailed } from '@actions/core';
import { join } from 'path';
import {
  readJsonFile,
  checkIfPackageExists,
  createAuthFile,
  validateInputs,
} from '@utils';
import { sfOrgLogin } from '@sf';
import { createPackage, createPackageVersion } from '@ui';

const AUTH_FILE_NAME = './authFile.txt';
const SFDX_PROJECT_JSON = 'sfdx-project.json';

const setup = async () => {
  // Validate all inputs
  const inputs = validateInputs();

  const { packagingDirectory, authUrl, targetDevHub } = inputs;

  // Change to packaging directory if specified
  if (packagingDirectory) {
    info(`Changing to packaging directory ${packagingDirectory}`);
    process.chdir(join(process.cwd(), packagingDirectory));
  }

  info('Creating authentication file');
  createAuthFile({ authUrl, authFileName: AUTH_FILE_NAME });

  info(`Authenticating org ${targetDevHub}`);

  await sfOrgLogin({ targetDevHub, authFileName: AUTH_FILE_NAME });

  info('Deleting authentication file');
  unlinkSync(AUTH_FILE_NAME);

  const sfdxProjectConfig = readJsonFile({ filePath: SFDX_PROJECT_JSON });

  return {
    sfdxProjectConfig,
    inputs,
  };
};

/**
 * Main function that orchestrates the package version creation process.
 *
 * @function main
 * @returns {Promise<void>}
 */
const main = async () => {
  try {
    // Setup the environment: validate inputs, change to the packaging directory, retrieve the sfdx project config and authenticate the org.
    let { sfdxProjectConfig, inputs} = await setup();

    // Check if the package exists
    const exists = await checkIfPackageExists({ packageName: inputs.packageName, targetDevHub: inputs.targetDevHub });
    if (!exists) {
      // Create the package because it doesn't exist.
      const { packageResult, updatedSfdxProjectConfig } = await createPackage(sfdxProjectConfig, inputs);
      sfdxProjectConfig = updatedSfdxProjectConfig;
    }

    // Create the package version for an existing package or for the newly created package.
    const { packageResult, updatedSfdxProjectConfig } = await createPackageVersion(sfdxProjectConfig, inputs);

    writeFileSync(SFDX_PROJECT_JSON, JSON.stringify(updatedSfdxProjectConfig, null, 2));

    setOutput('message', 'Package version created successfully');
    setOutput('package-version-id', packageResult.Id);    
    setOutput('package-version-number', packageResult.VersionNumber);
    setOutput('package-report', JSON.stringify(packageResult, null, 2));

  } catch (error) {
    // Log detailed error for debugging
    info(`Full error details: ${JSON.stringify(error, null, 2)}`);

    // Set more user-friendly error message
    const errorMessage = error.message || 'Unknown error occurred during package creation';
    setOutput('message', errorMessage);
    setFailed(errorMessage);
  }
};

// Execute the main function
main();
