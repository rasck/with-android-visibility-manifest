import { AndroidManifest } from "@expo/config-plugins";

export type SchemeData = Record<"android:scheme", string>;
export type MimeTypeData = Record<"android:scheme", string>;
export type TypeData = Record<"android:type", string>;
export type HostData = Record<"android:host", string>;
export type Category = Record<"android:name", string>;

export type DataType = SchemeData | MimeTypeData | HostData | TypeData;

export interface Schemes {
  navigation: SchemeData;
  mail: SchemeData;
}

export interface PackageVisibilityParams {
  name: string;
  data?: DataType[];
  category?: Category;
  type: "intent" | "package";
}

export type IntentVisibilityFilter = {
  action: { $: { "android:name": string } }[];
  category?: { $: Category }[] | undefined;
  data?: { $: DataType }[] | undefined;
};

export type Package = {
  $: { "android:name": string };
};

export type Manifest = AndroidManifest["manifest"] & {
  queries?: [
    {
      intent?: IntentVisibilityFilter[];
      package?: Package[];
    }
  ];
};
