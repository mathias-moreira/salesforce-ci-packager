import * as core from "@actions/core";
import * as github from "@actions/github";
import createPackageVersion from "./create-package-version.js";
import pollPackageStatus from "./poll-package-status.js";

try {

  const packageId = core.getInput("package");
  const targetDevHub = core.getInput("target-dev-hub");
  const installationKeyBypass = core.getInput("installation-key-bypass");
  const skipValidation = core.getInput("skip-validation");
  const codeCoverage = core.getInput("code-coverage");
  const asyncValidation = core.getInput("async-validation");

  core.info(`Creating package version for package ${packageId} on dev hub ${targetDevHub} with installation key bypass: ${installationKeyBypass}, skip validation: ${skipValidation}, code coverage: ${codeCoverage}, async validation: ${asyncValidation}`);

  const result = await createPackageVersion(packageId, {
    targetDevHub,
    installationKeyBypass,
    skipValidation,
    codeCoverage,
    asyncValidation
  });
  core.info(`Result: ${JSON.stringify(result)}`);

  core.setOutput('package-version-id', "667F00000000000");

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  core.info(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}