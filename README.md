# android-manifest-visibility

With this module you can define your app's package visibiliy needs that is otherwise not possible on a managed expo app. Package visibiliy is required on apps targeting Android 11+. [You can read more about package visibility here](https://developer.android.com/training/package-visibility).

# Setup

Go to the plugin folder to develop on the plugin. Once you are ready to test your plugin you can setup the expo app in the `app` folder to use the plugin:

 1. bump package.json in the plugin
 2. go to the plugin folder in a terminal, 
 3. run `yarn && yarn build && yarn pack`.
 4. refer to the packed version in the package.json in `app`. E.g. `"android-manifest-visibility" : "../plugin/android-manifest-visibility-v.1.0.0.tgz"`
 5. setup the plugin in app.json in the `app` (see examples below)
 6. build the apk from the `app` and test on your android phone. E.g. use `yarn apk` within the `./app` path

__Examples__

It is possible to define package visibiliy for intents
```
{
  "expo": {
    "plugins": [
      [
        "android-manifest-visibility",
        {
           "packageVisibilityParams": [
                {
                    "type": "intent",
                    "name": "android.intent.action.VIEW",
                    "data": [{ "android:scheme": "geo" }]
                },
                {
                    "type": "intent",
                    "name": "android.intent.action.VIEW",
                    "data": [{ "android:scheme": "smsto" }]
                },
                {
                    "type": "intent",
                    "name": "android.intent.action.SENDTO",
                    "data": [{ "android:scheme": "mailto" }]
                },
                {
                    "type": "intent",
                    "name": "android.intent.action.DIAL"
                }
            ]
        }
      ]
    ]
  }
}
```
and other apps (packages)
```

{
  "expo": {
    "plugins": [
      [
        "android-manifest-visibility",
        {
           "packageVisibilityParams": [
                {
                    "type": "package",
                    "name": "com.some.other.app"
                },
              
            ]
        }
      ]
    ]
  }
}
```
# Installation

This plugin should not be needed for bare apps, as you can just configure the android manifest directy. 

### Add the package to your dependencies using your prefered package manager

```
yarn add android-manifest-visibility
```
or
```
npm install android-manifest-visibility
```


Inspiration to work with expo config plugins can be found here:
* [Examples](https://github.com/expo/config-plugins)
* [Expo guildelines to develop a config plugin](https://github.com/expo/expo/tree/main/packages/expo-module-scripts#expo-module-scripts)
