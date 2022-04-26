import {
  DataType,
  PackageVisibilityParams,
  IntentVisibilityFilter,
  Package,
} from "./types";

const intentName = "android:name";

const validDataNames = ["android:scheme", "android:type", "android:host"];

const hasNoValidDataName = (dataType: DataType) =>
  !(
    validDataNames[0] in dataType ||
    validDataNames[1] in dataType ||
    validDataNames[2] in dataType
  );

const intentValidation = ({
  name,
  data,
  category,
}: PackageVisibilityParams) => {
  if (!name) {
    throw Error("Intent filters must include a name.");
  }
  if (data) {
    if (!data.length) {
      throw Error(
        `The Data of intent filter, '${name}', must be of type array`
      );
    }

    data.map((dataItem) => {
      if (hasNoValidDataName(dataItem)) {
        throw Error(
          `A data item of intent filter, '${name}', does not contain a valid attribute. Valid attributes includes '${validDataNames[0]}', '${validDataNames[1]}' or '${validDataNames[2]}'`
        );
      }
    });
  }

  if (category) {
    if (!("android:name" in category)) {
      throw Error(
        `Category for intent filter, '${name}', does not contain a valid attribute. Valid attributes for category includes 'android:name'`
      );
    }
  }
};

const packageValidation = ({
  name,
  data,
  category,
}: PackageVisibilityParams) => {
  if (!name) {
    throw Error("Package must include a name");
  }
  if (data) {
    throw Error(`Package, '${name}', cannot have data attribute`);
  }
  if (category) {
    throw Error(`Package, '${name}', cannot have category attribute`);
  }
};

export const validatePackageVisibilityParams = (
  packageVisiblityParams: PackageVisibilityParams
): PackageVisibilityParams => {
  if (!packageVisiblityParams) {
    throw Error("Package visibility object is not defined");
  }

  if (!packageVisiblityParams.type) {
    throw Error("Package visibility object has no type defined");
  }

  switch (packageVisiblityParams.type) {
    case "intent":
      intentValidation(packageVisiblityParams);
      break;
    case "package":
      packageValidation(packageVisiblityParams);
      break;
    default:
      throw Error(
        `The provided type '${packageVisiblityParams.type}' is not yet supported.`
      );
  }

  return packageVisiblityParams;
};

export const createIntentFilter = ({
  name,
  data,
  category,
}: PackageVisibilityParams): IntentVisibilityFilter => ({
  action: [
    {
      $: {
        [intentName]: name,
      },
    },
  ],
  // Conditionally add properties if they are Truthy
  ...(data && { data: data.map((item) => ({ $: item })) }),
  ...(category && { category: [{ $: category }] }),
});

export const createPackage = ({ name }: PackageVisibilityParams): Package => ({
  $: {
    [intentName]: name,
  },
});

const selectName = (intent: IntentVisibilityFilter) =>
  intent.action[0].$[intentName];

const selectData = (intent: IntentVisibilityFilter) =>
  intent.data ? intent.data.map((d) => d.$) : undefined;

const dataIsSameConstruct =
  (compareDataArray: DataType[]) => (otherData: DataType) =>
    compareDataArray.some(
      (compareData) => JSON.stringify(compareData) === JSON.stringify(otherData)
    );

export const intentIsUnique = (
  intent: IntentVisibilityFilter,
  intents: IntentVisibilityFilter[]
) => {
  const name = selectName(intent);
  const intentData = selectData(intent);
  const dublicateIntentCandidates = intents.filter(
    (intent) => selectName(intent) === name
  );

  if (!intentData) {
    return dublicateIntentCandidates.length < 1;
  }

  const dataIsSame = dataIsSameConstruct(intentData);

  const isIntentDublicate = dublicateIntentCandidates.some((dublicateIntent) =>
    dublicateIntent?.data?.some((di) => dataIsSame(di.$))
  );

  return !isIntentDublicate;
};

export const packageIsUnique = (
  androidPackage: Package,
  packages: Package[]
) => {
  const name = androidPackage.$["android:name"];
  const dublicatePackge = packages.find(
    (androidPackage) => androidPackage.$["android:name"] === name
  );
  return !dublicatePackge;
};

export const mapToIntentsAndPackages = (
  packageVisibilityParams: PackageVisibilityParams[]
) =>
  packageVisibilityParams.reduce<{
    intents: IntentVisibilityFilter[];
    packages: Package[];
  }>(
    (queries, current) => {
      validatePackageVisibilityParams(current);

      switch (current.type) {
        case "intent":
          queries.intents.push(createIntentFilter(current));
          break;
        case "package":
          queries.packages.push(createPackage(current));
          break;
        default:
          throw Error(`Unexpected package visibility type '${current.type}'`);
      }
      return queries;
    },
    { intents: [], packages: [] }
  );
