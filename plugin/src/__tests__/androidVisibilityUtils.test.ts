import { XML } from "@expo/config-plugins";

import {
  createIntentFilter,
  createPackage,
  intentIsUnique,
  mapToIntentsAndPackages,
  packageIsUnique,
  validatePackageVisibilityParams,
} from "../androidVisibilityUtils";
import {
  IntentVisibilityFilter,
  Package,
  PackageVisibilityParams,
} from "../types";

describe("Android visiblity utils", () => {
  describe("create intent filters signature", () => {
    const navigationIntent = createIntentFilter({
      type: "intent",
      name: "android.intent.action.VIEW",
      data: [
        {
          "android:scheme": "geo",
        },
      ],
    });

    it("should match JS object", () => {
      const expectedJSObject = {
        action: [
          {
            $: { "android:name": "android.intent.action.VIEW" },
          },
        ],
        data: [{ $: { "android:scheme": "geo" } }],
      };

      expect(navigationIntent).toMatchObject(expectedJSObject);
    });

    it("should match XML string", () => {
      const expectedXMLString = `<intent>
  <action android:name="android.intent.action.VIEW"/>
  <data android:scheme="geo"/>
</intent>`;
      expect(XML.format({ intent: navigationIntent })).toBe(expectedXMLString);
    });

    describe("create intent filters signature with category", () => {
      const navigationIntent = createIntentFilter({
        type: "intent",
        name: "android.intent.action.VIEW",
        data: [
          {
            "android:scheme": "geo",
          },
        ],
        category: { "android:name": "android.intent.category.DEFAULT" },
      });

      it("should match JS object", () => {
        const expectedJSObject = {
          action: [
            {
              $: { "android:name": "android.intent.action.VIEW" },
            },
          ],
          data: [{ $: { "android:scheme": "geo" } }],
          category: [
            {
              $: { "android:name": "android.intent.category.DEFAULT" },
            },
          ],
        };

        expect(navigationIntent).toMatchObject(expectedJSObject);
      });

      it("should match XML string", () => {
        const expectedXMLString = `<intent>
  <action android:name="android.intent.action.VIEW"/>
  <data android:scheme="geo"/>
  <category android:name="android.intent.category.DEFAULT"/>
</intent>`;
        expect(XML.format({ intent: navigationIntent })).toBe(
          expectedXMLString
        );
      });
    });
  });

  describe("create package signature", () => {
    const packageExampleStore = createPackage({
      type: "package",
      name: "com.example.store",
    });

    it("should match JS object", () => {
      const expectedJSObject = {
        $: {
          "android:name": "com.example.store",
        },
      };

      expect(packageExampleStore).toMatchObject(expectedJSObject);
    });

    it("should match XML string", () => {
      const expectedXMLString = `<package android:name="com.example.store"/>`;
      expect(XML.format({ package: packageExampleStore })).toBe(
        expectedXMLString
      );
    });
  });

  describe("validate package visibility parameters", () => {
    //validatePackageVisibilityParams
    it("should throw whith no parameter defined", () => {
      // @ts-ignore
      expect(() => validatePackageVisibilityParams(null)).toThrow(
        "Package visibility object is not defined"
      );
    });

    it("should throw whith no type defined", () => {
      expect(() =>
        // @ts-ignore
        validatePackageVisibilityParams({
          name: "test value",
        })
      ).toThrow("Package visibility object has no type defined");
    });

    describe("validate package parameters", () => {
      it("should throw when package has no name", () => {
        const androidPackage: PackageVisibilityParams = {
          name: "",
          type: "package",
        };

        expect(() => validatePackageVisibilityParams(androidPackage)).toThrow(
          "Package must include a name"
        );
      });

      it("should throw when package has data attribute", () => {
        const androidPackage: PackageVisibilityParams = {
          name: "test package",
          type: "package",
          data: [{ "android:scheme": "test" }],
        };

        expect(() => validatePackageVisibilityParams(androidPackage)).toThrow(
          "Package, 'test package', cannot have data attribute"
        );
      });

      it("should throw when package has data attribute", () => {
        const androidPackage: PackageVisibilityParams = {
          name: "test package",
          type: "package",
          category: { "android:name": "test" },
        };

        expect(() => validatePackageVisibilityParams(androidPackage)).toThrow(
          "Package, 'test package', cannot have category attribute"
        );
      });

      it("should pass validation with correct name and type attribute", () => {
        const androidPackage: PackageVisibilityParams = {
          name: "test value",
          type: "package",
        };
        // We don't have to expect anything
        // We just want this method to complete
        expect(validatePackageVisibilityParams(androidPackage)).toBe(
          androidPackage
        );
      });
    });

    describe("validate intents parameters", () => {
      it("should throw when intent has no name", () => {
        const intentWithInvalidNameValue: PackageVisibilityParams = {
          name: "",
          type: "intent",
          data: [{ "android:scheme": "test" }],
        };

        expect(() =>
          validatePackageVisibilityParams(intentWithInvalidNameValue)
        ).toThrow("Intent filters must include a name.");
      });

      it("should throw when intent data is not array ", () => {
        const intentWithInbvalidDataValue: PackageVisibilityParams = {
          name: "test intent",
          type: "intent",
          // @ts-ignore
          data: { "android:scheme": "test" },
        };

        expect(() =>
          validatePackageVisibilityParams(intentWithInbvalidDataValue)
        ).toThrow(
          "The Data of intent filter, 'test intent', must be of type array"
        );
      });

      it("should throw when intent data has invalid attribute", () => {
        const invalidDataAttribute = "android:scheme2";
        const intent: PackageVisibilityParams = {
          name: "test intent",
          type: "intent",
          // @ts-ignore
          data: [{ [invalidDataAttribute]: "test" }],
        };

        expect(() => validatePackageVisibilityParams(intent)).toThrow(
          "A data item of intent filter, 'test intent', does not contain a valid attribute. Valid attributes includes 'android:scheme', 'android:type' or 'android:host'"
        );
      });

      it("should throw when intent category has invalid attribute", () => {
        const invalidCategoryAttribute = "invalid:category";
        const intent: PackageVisibilityParams = {
          name: "test intent",
          type: "intent",
          data: [{ "android:scheme": "test" }],
          // @ts-ignore
          category: { [invalidCategoryAttribute]: "test" },
        };

        expect(() => validatePackageVisibilityParams(intent)).toThrow(
          "Category for intent filter, 'test intent', does not contain a valid attribute. Valid attributes for category includes 'android:name'"
        );
      });

      it("should pass validation with only name and type set", () => {
        const intentWithNameAndType: PackageVisibilityParams = {
          name: "test value",
          type: "intent",
        };
        // We don't have to expect anything
        // We just want this method to complete
        expect(validatePackageVisibilityParams(intentWithNameAndType)).toBe(
          intentWithNameAndType
        );
      });

      it("should pass validation with all properties set", () => {
        const intentWithNameAndType: PackageVisibilityParams = {
          name: "test value",
          type: "intent",
          data: [{ "android:scheme": "test" }],
          category: { "android:name": "test" },
        };
        // We don't have to expect anything
        // We just want this method to complete
        expect(validatePackageVisibilityParams(intentWithNameAndType)).toBe(
          intentWithNameAndType
        );
      });
    });
  });

  describe("intent is unique", () => {
    it("should be unique intent when compare list is empty", () => {
      const intent1 = createIntentFilter({
        type: "intent",
        name: "hello",
        data: [{ "android:scheme": "test" }],
      });

      const intents: IntentVisibilityFilter[] = [];
      expect(intentIsUnique(intent1, intents)).toBe(true);
    });

    it("should be unique intent when compare list has different elements", () => {
      const intent1 = createIntentFilter({
        type: "intent",
        name: "test",
        data: [{ "android:scheme": "test" }],
      });

      const intent2 = createIntentFilter({
        type: "intent",
        name: "test2",
        data: [{ "android:scheme": "test" }],
      });

      const intents: IntentVisibilityFilter[] = [intent2];
      expect(intentIsUnique(intent1, intents)).toBe(true);
    });

    it("should be unique when intent has no data attribute", () => {
      const intent1 = createIntentFilter({
        type: "intent",
        name: "android.intent.action.DIAL",
      });

      const intent2 = createIntentFilter({
        type: "intent",
        name: "android.intent.action.VIEW",
        data: [{ "android:scheme": "https" }],
        category: { "android:name": "android.intent.category.BROWSABLE" },
      });

      const intents: IntentVisibilityFilter[] = [intent2];
      expect(intentIsUnique(intent1, intents)).toBe(true);
    });

    it("should be unique intent when compare list has element with same name, but different data", () => {
      const name = "test";
      const intent1 = createIntentFilter({
        type: "intent",
        name,
        data: [{ "android:scheme": "test" }],
      });

      const intent2 = createIntentFilter({
        type: "intent",
        name,
        data: [{ "android:scheme": "test2" }],
      });

      const intents: IntentVisibilityFilter[] = [intent2];
      expect(intentIsUnique(intent1, intents)).toBe(true);
    });

    it("should NOT be unique intent when compare list has element with same name and same data structure", () => {
      const name = "test";
      const intent1 = createIntentFilter({
        type: "intent",
        name,
        data: [{ "android:scheme": "test" }],
      });

      const intent2 = createIntentFilter({
        type: "intent",
        name,
        data: [{ "android:scheme": "test" }],
      });

      const intents: IntentVisibilityFilter[] = [intent2];
      expect(intentIsUnique(intent1, intents)).toBe(false);
    });

    it("should NOT be unique intent when compare list last element has same name and same data structure", () => {
      const name = "test";
      const intent1 = createIntentFilter({
        type: "intent",
        name,
        data: [{ "android:host": "test2" }, { "android:scheme": "test" }],
      });

      const intent2 = createIntentFilter({
        type: "intent",
        name,
        data: [{ "android:scheme": "not relevant" }],
      });

      const intent3 = createIntentFilter({
        type: "intent",
        name,
        data: [{ "android:host": "test" }, { "android:scheme": "test" }],
      });

      const intents: IntentVisibilityFilter[] = [intent2, intent3];
      expect(intentIsUnique(intent1, intents)).toBe(false);
    });

    it("should NOT be unique intent when compare list last element has same name and same data structure 1", () => {
      const name = "test";
      const intent1 = createIntentFilter({
        type: "intent",
        name,
        data: [{ "android:scheme": "test" }],
      });

      const intent2 = createIntentFilter({
        type: "intent",
        name,
        data: [{ "android:scheme": "not relevant" }],
      });

      const intent3 = createIntentFilter({
        type: "intent",
        name,
        data: [{ "android:host": "test" }, { "android:scheme": "test" }],
      });

      const intents: IntentVisibilityFilter[] = [intent2, intent3];
      expect(intentIsUnique(intent1, intents)).toBe(false);
    });

    it("should NOT be unique intent when compare list last element has same name and same data structure 2", () => {
      const name = "test";
      const intent1 = createIntentFilter({
        type: "intent",
        name,
        data: [{ "android:scheme": "test" }],
      });

      const intent2 = createIntentFilter({
        type: "intent",
        name,
        data: [{ "android:scheme": "not relevant" }],
      });

      const intent3 = createIntentFilter({
        type: "intent",
        name,
        data: [{ "android:scheme": "test" }],
      });

      const intents: IntentVisibilityFilter[] = [intent2, intent3];
      expect(intentIsUnique(intent1, intents)).toBe(false);
    });
  });

  describe("package is unique", () => {
    it("should be unique intent when compare list is empty", () => {
      const package1 = createPackage({
        type: "package",
        name: "test",
      });

      const packages: Package[] = [];
      expect(packageIsUnique(package1, packages)).toBe(true);
    });

    it("should be unique pakcage when all other packages has different name", () => {
      const package1 = createPackage({
        type: "package",
        name: "test",
      });

      const package2 = createPackage({
        type: "package",
        name: "test1",
      });

      const package3 = createPackage({
        type: "package",
        name: "test2",
      });

      const packages: Package[] = [package2, package3];
      expect(packageIsUnique(package1, packages)).toBe(true);
    });

    it("should be unique pakcage when another package has the same name", () => {
      const sameName = "test";

      const package1 = createPackage({
        type: "package",
        name: sameName,
      });

      const package2 = createPackage({
        type: "package",
        name: "test1",
      });

      const package3 = createPackage({
        type: "package",
        name: sameName,
      });

      const packages: Package[] = [package2, package3];
      expect(packageIsUnique(package1, packages)).toBe(false);
    });
  });

  describe("Convert user package params to intents and packages", () => {
    it("should be empty", () => {
      expect(mapToIntentsAndPackages([])).toStrictEqual({
        intents: [],
        packages: [],
      });
    });
    it("should create a package", () => {
      const packageValue: PackageVisibilityParams = {
        name: "test value",
        type: "package",
      };
      const packageVisibilityParams: PackageVisibilityParams[] = [packageValue];
      expect(mapToIntentsAndPackages(packageVisibilityParams)).toStrictEqual({
        intents: [],
        packages: [createPackage(packageValue)],
      });
    });
    it("should create an intent", () => {
      const intent: PackageVisibilityParams = {
        name: "test value",
        type: "intent",
        data: [{ "android:scheme": "test" }],
        category: { "android:name": "test" },
      };

      const intentVisibilityParams: PackageVisibilityParams[] = [intent];
      expect(mapToIntentsAndPackages(intentVisibilityParams)).toStrictEqual({
        intents: [createIntentFilter(intent)],
        packages: [],
      });
    });
    it("should create an intent and a package", () => {
      const intent: PackageVisibilityParams = {
        name: "test value",
        type: "intent",
        data: [{ "android:scheme": "test" }],
        category: { "android:name": "test" },
      };

      const packageValue: PackageVisibilityParams = {
        name: "test value",
        type: "package",
      };

      const packageVisibilityParams: PackageVisibilityParams[] = [
        intent,
        packageValue,
      ];
      expect(mapToIntentsAndPackages(packageVisibilityParams)).toStrictEqual({
        intents: [createIntentFilter(intent)],
        packages: [createPackage(packageValue)],
      });
    });
  });
});
