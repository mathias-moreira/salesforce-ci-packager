import executeCommand from "./execute-command.js";

async function createPackageVersion(
  packageId,
  options
) {

  const command = `sf package version create --package ${packageId} --target-dev-hub ${options.targetDevHub} --installation-key-bypass --code-coverage --json`;
  const {success, error} = await executeCommand(command);

  if (!success) {
    return {
      success: false,
      error: JSON.parse(error.stdout)
    };
  }

  return result;
}

export default createPackageVersion;
