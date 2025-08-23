import executeCommand from "./execute-command.js";

async function createPackageVersion(
  packageId,
  options
) {

  const command = `sf package version create --package ${packageId} --target-dev-hub ${options.targetDevHub} --installation-key-bypass --skip-validation --json`;
  const {success, data,error} = await executeCommand(command);

  if (!success) {
    return {
      success: false,
      error: JSON.parse(error.stdout)
    };
  }

  return {success, data};
}

export default createPackageVersion;
