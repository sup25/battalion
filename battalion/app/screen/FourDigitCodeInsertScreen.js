import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useRef, useState } from "react";
import colors from "../config/colors";
import CarthagosButton from "../component/CarthagosButton";
import AddUserData from "../config/Database";

export default function FourDigitCodeInsertScreen() {
  const textInputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [userInput, setUserInput] = useState({
    fourDigitCode: "",
  });

  const focusNext = (index) => {
    if (index < textInputRefs.length - 1) {
      textInputRefs[index + 1].current.focus();
    }
  };

  const handleConfirm = () => {
    const { fourDigitCode } = userInput;
    if (!fourDigitCode || fourDigitCode.length !== 4) {
      console.log("enter valid digit");
      return;
    } else {
      console.log("value saved");
    }
    AddUserData({ fourDigitCode });
    setUserInput({
      fourDigitCode: "",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.heading}>4 digit password</Text>
        <Text style={styles.paragraph}>
          Input the password to unlock the box in the digital display, you can
          change this password later in the settings.
        </Text>
        <View style={styles.textInputContainer}>
          {textInputRefs.map((ref, index) => (
            <TextInput
              key={index}
              ref={ref}
              style={styles.textInput}
              keyboardType="phone-pad"
              maxLength={1}
              onChangeText={(text) => {
                if (text.length === 1) {
                  focusNext(index);
                }
              }}
            />
          ))}
        </View>
        <View style={styles.button}>
          <CarthagosButton
            title="confirm"
            textColor="white"
            width={277}
            onPress={handleConfirm}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    top: 247,
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 500,
    lineHeight: 29,
    letterSpacing: -0.02,
    textAlign: "center",
    color: colors.white,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 19,
    color: "#8F8F8F",
    maxWidth: 300,
    textAlign: "center",
    marginTop: 8,
  },
  textInput: {
    height: 65,
    borderColor: colors.secondary,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 5,
    width: 61,
    borderRadius: 5,
    color: colors.white,
    fontSize: 24,
    display: "flex",
    textAlign: "center",
  },
  textInputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 33,
  },
  wrapper: {
    justifyContent: "center",
    marginTop: 75,
  },
});
