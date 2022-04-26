import {
  ConfigPlugin,
  withAndroidManifest,
  AndroidConfig,
} from "@expo/config-plugins";

import {
  intentIsUnique,
  mapToIntentsAndPackages,
  packageIsUnique,
} from "./androidVisibilityUtils";
import {
  PackageVisibilityParams,
  IntentVisibilityFilter,
  Manifest,
  Package,
} from "./types";

const mergeIntents = (
  androidManifest: Manifest,
  intents: IntentVisibilityFilter[]
) => {
  if (!androidManifest.queries) {
    androidManifest.queries = [{}];
  }
  const intentsFromManifest = androidManifest.queries[0].intent;

  if (!intentsFromManifest) {
    androidManifest.queries[0].intent = intents;
  } else {
    for (const userDefinedIntent of intents) {
      if (intentIsUnique(userDefinedIntent, intentsFromManifest)) {
        intentsFromManifest.push(userDefinedIntent);
      }
    }
  }
};

const mergePackages = (androidManifest: Manifest, packages: Package[]) => {
  if (!androidManifest.queries) {
    androidManifest.queries = [{}];
  }

  const packagesFromManifest = androidManifest.queries[0].package;

  if (!packagesFromManifest) {
    androidManifest.queries[0].package = packages;
  } else {
    for (const userDefinedPackage of packages) {
      if (packageIsUnique(userDefinedPackage, packagesFromManifest)) {
        packagesFromManifest.push(userDefinedPackage);
      }
    }
  }
};

export const addPackageFilters = (
  androidConfig: AndroidConfig.Manifest.AndroidManifest,
  packageVisibilityParams: PackageVisibilityParams[]
) => {
  const androidManifest = androidConfig.manifest as Manifest;
  const { intents, packages } = mapToIntentsAndPackages(
    packageVisibilityParams
  );

  mergeIntents(androidManifest, intents);
  mergePackages(androidManifest, packages);

  return androidConfig;
};

const withAndroidVisibilityManifest: ConfigPlugin<{
  packageVisibilityParams: PackageVisibilityParams[];
}> = (config, { packageVisibilityParams }) => {
  if (!packageVisibilityParams) {
    throw Error("packageVisibilityParams must be defined");
  }
  return withAndroidManifest(config, (config) => {
    config.modResults = addPackageFilters(
      config.modResults,
      packageVisibilityParams
    );
    return config;
  });
};

export default withAndroidVisibilityManifest;
