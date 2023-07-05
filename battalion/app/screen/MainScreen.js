import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
} from "react-native";

import colors from "../config/colors";

import CarButton from "../component/CarButton";

export default function MainScreen({ navigation }) {
  return (
    <>
      <ImageBackground
        style={styles.background}
        source={require("../assets/background.png")}
      >
        <StatusBar style="auto" />
        <View style={styles.headingTextConatiner}>
          <Text style={[styles.headingText, { lineHeight: 52 }]}>
            make hard work easier
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.textandButton}>
        <View style={styles.textContainer}>
          <Text style={styles.textWelcome}>WELCOME TO BATTALION</Text>
          <Text style={styles.textParagraph}>
            We are specialists in developing resilient tools and accessories
            suitable for all-around construction needs.
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <CarButton
            title="new member"
            color="white"
            width={168}
            onPress={() => navigation.navigate("Register")}
            textColor="black"
          />
          <CarButton
            title="sign in"
            onPress={() => navigation.navigate("Login")}
            width={145}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headingTextConatiner: {
    position: "absolute",
    top: 70,
  },
  headingText: {
    maxWidth: 324,
    textTransform: "uppercase",
    fontWeight: "900",
    color: colors.white,
    alignItems: "center",
    fontSize: 45,
  },
  logo: {
    width: 100,
    height: 100,
  },

  textandButton: {
    backgroundColor: colors.black,
    paddingBottom: 50,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000a8",
  },
  textParagraph: {
    fontWeight: 400,
    fontSize: 16,
    color: "#8F8F8F",
    maxWidth: 300,
    textAlign: "center",
  },
  textWelcome: {
    fontWeight: 400,
    fontSize: 20,
    color: colors.white,
  },
});
