import React, { useEffect, useState } from "react";
import { Animated, Image, SafeAreaView, Text, View } from "react-native";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from "./styles";
import { FontAwesome } from "@expo/vector-icons";

const { Value, Text: AnimatedText } = Animated;
const cellCount = 4;
//   Animations init
const animationsColor = [...new Array(cellCount)].map(() => new Value(0));
const animationsScale = [...new Array(cellCount)].map(() => new Value(1));
const animateCell = ({ hasValue, index, isFocused }) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

const FourDigitsCode = ({ defaultValue, submitHandler, isVisible }) => {
  const [value, setValue] = useState(defaultValue.join(""));
  const ref = useBlurOnFulfill({ value, cellCount: cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (value.length === cellCount) {
      console.log("value", value);
      const valAsArr = value.split("").map(Number);
      console.log("value", valAsArr);
      submitHandler(valAsArr);
    }
  }, [value]);

  const renderCell = ({ index, symbol, isFocused }) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({ hasValue, index, isFocused });
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {isVisible || isFocused
          ? symbol
          : <FontAwesome name="circle" size={70} color="white" /> || null}
      </AnimatedText>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={cellCount}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="password"
        renderCell={renderCell}
      />
    </SafeAreaView>
  );
};

export default FourDigitsCode;
