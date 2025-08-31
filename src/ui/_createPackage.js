import { getPackagePath } from '@utils';
import { sfPackageCreate } from '@sf';

const createPackage = async (sfdxProjectConfig, inputs) => {
  const packagePath = getPackagePath(sfdxProjectConfig, inputs.packageId);
  if (!packagePath) {
    throw new Error(
      'No package directory path found in project file. To create a package, please specify the package directory in the sfdx-project.json file.'
    );
  }

  const { targetDevHub, name, packageType, noNamespace, orgDependent, errorNotificationUsername, apiVersion } = inputs;

  const result = await sfPackageCreate({targetDevHub, name, packageType, noNamespace, orgDependent, errorNotificationUsername, apiVersion});
  if (result.status !== 0) {
    throw new Error('Failed to create package: ' + JSON.stringify(result, null, 2));
  }
};

export default createPackage;
