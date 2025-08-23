import * as core from "@actions/core";
import * as github from "@actions/github";
import createPackageVersion from "./create-package-version.js";
import pollPackageStatus from "./poll-package-status.js";
import { join } from 'path';

try {

  const packagingDirectory = core.getInput("packaging-directory");
  const packageId = core.getInput("package");
  const targetDevHub = core.getInput("target-dev-hub");
  const installationKeyBypass = core.getInput("installation-key-bypass");
  const skipValidation = core.getInput("skip-validation");
  const codeCoverage = core.getInput("code-coverage");
  const asyncValidation = core.getInput("async-validation");

  process.chdir(join(process.cwd(), packagingDirectory))

  core.info(`Creating package version for package ${packageId} on dev hub ${targetDevHub} with installation key bypass: ${installationKeyBypass}, skip validation: ${skipValidation}, code coverage: ${codeCoverage}, async validation: ${asyncValidation}`);

  const result = await createPackageVersion(packageId, {
    targetDevHub,
    installationKeyBypass,
    skipValidation,
    codeCoverage,
    asyncValidation
  });

  if (!result.success) {
    core.setOutput('message', result.error.message);
    core.setFailed(result.error.message);
  }

  const packageResult = await pollPackageStatus(result.data.result.Id);
  core.info('packageResult', packageResult);
  core.setOutput('package-version-id', packageResult.version);  
} catch (error) {
  console.log('THIS error', error);
  core.setFailed(error.message);
}