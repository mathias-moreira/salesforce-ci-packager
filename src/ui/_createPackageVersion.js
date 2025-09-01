import { sfPackageVersionCreate } from '@sf';
import { pollPackageStatus, updatePackageAliases } from '@utils';

const createPackageVersion = async (sfdxProjectConfig, inputs) => {
  const {
    packageName,
    targetDevHub,
    installationKeyBypass,
    installationKey,
    skipValidation,
    codeCoverage,
    asyncValidation,
    pollingIntervalMs,
    maxRetries,
  } = inputs;

  const result = await sfPackageVersionCreate({
    packageName,
    targetDevHub,
    installationKeyBypass,
    installationKey,
    skipValidation,
    codeCoverage,
    asyncValidation,
  });

  if (result.status !== 0) {
    throw new Error('Failed to create package version: ' + JSON.stringify(result, null, 2));
  }

  const {Id} = result.result;

  const packageResult = await pollPackageStatus({jobId: Id, retryCount: 0, pollingInterval: pollingIntervalMs, maxRetries: maxRetries});

  // Update the package aliases in the sfdx-project.json file.
  const updatedSfdxProjectConfig = updatePackageAliases({
    sfdxProjectConfig,
    packageName: packageResult.Package2Name,
    versionNumber: packageResult.VersionNumber,
    subscriberPackageVersionId: packageResult.SubscriberPackageVersionId,
  });

  return { packageResult, updatedSfdxProjectConfig };
};

export default createPackageVersion;
