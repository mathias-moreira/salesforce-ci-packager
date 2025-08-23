import * as core from "@actions/core";
import * as github from "@actions/github";
import createPackageVersion from "./create-package-version.js";
import pollPackageStatus from "./poll-package-status.js";
import { join } from 'path';
import { readFileSync, writeFileSync } from "fs";

const updatePackageAliases = (packageResult) => {
  const filename = "sfdx-project.json"
  let file = JSON.parse(readFileSync(filename, 'utf8'));

  if (!file.packageAliases) {
    file.packageAliases = {};
  }

  file.packageAliases[packageResult.Package2Name + '@' + packageResult.VersionNumber] = packageResult.SubscriberPackageVersionId;
  writeFileSync(filename, JSON.stringify(file, null, 2));
}

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
  } else {
    const packageResult = await pollPackageStatus(result.data.result.Id);

    core.setOutput('message', 'Package version created successfully');
    core.setOutput('package-version-id', packageResult.version);
    core.setOutput('package-report', JSON.stringify(packageResult, null, 2));

    updatePackageAliases(packageResult);
  }

 
} catch (error) {
  core.setOutput('message', error.message);
  core.setFailed(error.message);
}