import executeCommand from "./execute-command.js";

async function createPackageVersion(
  packageId,
  options
) {
  const command = `sf package version create --package ${packageId} --target-dev-hub ${options.targetDevHub} --installation-key-bypass ${options.installationKeyBypass} --skip-validation ${options.skipValidation} --code-coverage ${options.codeCoverage} --async-validation ${options.asyncValidation} --json`;
  const result = await executeCommand(command);
  return result;
}

export default createPackageVersion;
