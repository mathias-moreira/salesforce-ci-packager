import { getPackagePath, updatePackageAliases } from '@utils';
import { sfPackageCreate } from '@sf';

const createPackage = async (sfdxProjectConfig, inputs) => {
  const packagePath = getPackagePath({sfdxProjectConfig, packageName: inputs.packageName});
  if (!packagePath) {
    throw new Error(
      'No package directory path found in project file. To create a package, please specify the package directory in the sfdx-project.json file.'
    );
  }

  const { targetDevHub, packageName, packageType, noNamespace, orgDependent, errorNotificationUsername, apiVersion } = inputs;

  const result = await sfPackageCreate({targetDevHub, packageName, path: packagePath, packageType, noNamespace, orgDependent, errorNotificationUsername, apiVersion});
  if (result.status !== 0) {
    throw new Error('Failed to create package: ' + JSON.stringify(result, null, 2));
  }

  const updatedSfdxProjectConfig = updatePackageAliases({
    sfdxProjectConfig,
    packageName,
    packageOrVersionId: result.result.Id,
  });

  return { packageResult: result.result, updatedSfdxProjectConfig };
};

export default createPackage;
