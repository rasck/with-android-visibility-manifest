import { AndroidConfig, XML } from "@expo/config-plugins";
import fs from "fs";
import { resolve, dirname } from "path";

import { PackageVisibilityParams } from "../types";
import { addPackageFilters } from "../withAndroidVisibilityManifest";

const sampleQueryIntents: PackageVisibilityParams[] = [
  {
    type: "intent",
    name: "android.intent.action.VIEW",
    data: [
      {
        "android:scheme": "geo",
      },
    ],
  },
  {
    type: "intent",
    name: "android.intent.action.SENDTO",
    data: [{ "android:scheme": "mailto" }],
  },
  {
    type: "package",
    name: "com.example.store",
  },
];

const { readAndroidManifestAsync } = AndroidConfig.Manifest;

const __dirname__ = resolve(dirname(""));

const sampleManifestPath = resolve(
  __dirname__,
  "src/__tests__/fixtures/AndroidManifest.xml"
);

const sampleManifestExpectedPath = resolve(
  __dirname__,
  "src/__tests__/fixtures/AndroidManifestExpected.xml"
);

const sampleManifestWithQueriesPath = resolve(
  __dirname__,
  "src/__tests__/fixtures/AndroidManifestWithQueries.xml"
);

const sampleManifestWithQueriesExpectedPath = resolve(
  __dirname__,
  "src/__tests__/fixtures/AndroidManifestWithQueriesExpected.xml"
);

describe("addPackageFilters to manifest", () => {
  describe("add intent queries to mainifest without queries", () => {
    let androidManifest;

    beforeAll(async () => {
      androidManifest = await readAndroidManifestAsync(sampleManifestPath);
      androidManifest = addPackageFilters(androidManifest, sampleQueryIntents);
    });

    it(`should match JS object`, () => {
      expect(androidManifest.manifest["queries"]).toStrictEqual([
        {
          intent: [
            {
              action: [
                {
                  $: {
                    "android:name": "android.intent.action.VIEW",
                  },
                },
              ],
              data: [{ $: { "android:scheme": "geo" } }],
            },
            {
              action: [
                {
                  $: {
                    "android:name": "android.intent.action.SENDTO",
                  },
                },
              ],
              data: [{ $: { "android:scheme": "mailto" } }],
            },
          ],
          package: [
            {
              $: {
                "android:name": "com.example.store",
              },
            },
          ],
        },
      ]);
    });

    it(`should match XML string`, () => {
      expect(XML.format(androidManifest)).toEqual(
        fs.readFileSync(sampleManifestExpectedPath, "utf8")
      );
    });
  });

  describe("add intent queries to mainifest with queries", () => {
    let androidManifest;

    beforeAll(async () => {
      androidManifest = await readAndroidManifestAsync(
        sampleManifestWithQueriesPath
      );
      androidManifest = addPackageFilters(androidManifest, sampleQueryIntents);
    });

    it(`should match JS object`, () => {
      expect(androidManifest.manifest["queries"]).toStrictEqual([
        {
          intent: [
            {
              action: [
                {
                  $: {
                    "android:name": "android.intent.action.SENDTO",
                  },
                },
              ],
              data: [{ $: { "android:scheme": "mailto" } }],
            },
            {
              action: [
                {
                  $: {
                    "android:name": "android.intent.action.SEND_MULTIPLE",
                  },
                },
              ],
              category: [
                {
                  $: {
                    "android:name": "android.intent.category.DEFAULT",
                  },
                },
              ],
              data: [{ $: { "android:mimeType": "*/*" } }],
            },
            {
              action: [
                {
                  $: {
                    "android:name": "android.intent.action.VIEW",
                  },
                },
              ],
              data: [{ $: { "android:scheme": "geo" } }],
            },
          ],
          package: [
            {
              $: {
                "android:name": "com.example.store",
              },
            },
          ],
        },
      ]);
    });

    it(`should match XML string`, () => {
      expect(XML.format(androidManifest)).toEqual(
        fs.readFileSync(sampleManifestWithQueriesExpectedPath, "utf8")
      );
    });
  });
});
