import React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";

const url = "https://dr.dk";
const number = "12344321";
const mail = "test@test.gmail.dk";
const address = "Prinsensgade 10, 9000 Aalborg";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    marginTop: 45,
  },
  button: {
    padding: 15,
    margin: 4,
    backgroundColor: "#C8E6C9",
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: "#424242",
    textAlign: "center",
  },
  crumpText: {
    fontSize: 18,
    color: "black",
    paddingVertical: 12,
  },
  headline: {
    fontSize: 25,
  },
});

const mapPrefix = Platform.select({
  ios: `maps:0,0?q=`,
  android: `geo:0,0?q=`,
});

const AndroidVisibilityTest = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Package visibility permissions</Text>
      <Text style={styles.crumpText}>
        On Android you need to set package visibility permissions to open other
        apps. These components test that. Test this on a build android apk.
      </Text>
      <ScrollView>
        <Pressable
          style={styles.button}
          onPress={() => WebBrowser.openBrowserAsync(url)}
        >
          <Text style={styles.text}>open browser {url}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => Linking.openURL(url)}>
          <Text style={styles.text}>open url {url}</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => Linking.openURL(`sms:${number}`)}
        >
          <Text style={styles.text}>send sms to {number}</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => Linking.openURL(`tel:${number}`)}
        >
          <Text style={styles.text}>call {number}</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => Linking.openURL(`mailto:${mail}`)}
        >
          <Text style={styles.text}>write mail to {mail}</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => Linking.openURL(`${mapPrefix}:${address}`)}
        >
          <Text style={styles.text}>open maps at {address}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default AndroidVisibilityTest;
