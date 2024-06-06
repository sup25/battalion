import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import colors from "../../config/Colors/colors";

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },

  cell: {
    width: 60,
    height: 60,
    lineHeight: 50,
    fontSize: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 5,
    textAlign: "center",
    color: colors.white,
    backgroundColor: "#000000",
  },
  focusCell: {
    borderColor: "#000",
  },
});

const CELL_COUNT = 4;

const FourDigitsCode = ({
  defaultValue,
  submitHandler = false,
  isVisible,
  passwordError = false,
  editable = true,
}) => {
  const [value, setValue] = useState(defaultValue.join(""));
  const [isSaved, setIsSaved] = useState(false);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (editable) {
      ref.current.focus();
    }
  }, [editable]);

  return (
    <SafeAreaView style={styles.root}>
      <CodeField
        editable={editable}
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={value}
        onChangeText={async (val) => {
          setValue(val);
          if (val.length < 4) setIsSaved(false);
          if (val.length === CELL_COUNT) {
            const valAsArr = val.split("").map(Number);
            if (submitHandler) {
              let res = await submitHandler(valAsArr);
            }
          }
        }}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[styles.cell]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            {isVisible ? (
              isFocused ? (
                <Cursor />
              ) : (
                symbol
              )
            ) : isFocused ? (
              <Cursor />
            ) : (
              <FontAwesome name="circle" size={24} color="white" /> || null
            )}
          </Text>
        )}
      />
      {passwordError && (
        <Text style={{ color: "white", fontSize: 14 }}>{passwordError}</Text>
      )}
      {isSaved && !passwordError && (
        <Text style={{ color: "white", fontSize: 14 }}>Saved!</Text>
      )}
    </SafeAreaView>
  );
};

export default FourDigitsCode;
