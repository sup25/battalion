import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import Slider from "@react-native-community/slider";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import colors from "../../config/Colors/colors";
import CarthagosScreen from "../../component/CarthagosScreen/CarthagosScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";
import { useToast } from "react-native-toast-notifications";
import TempOuterCircle from "../../component/TempCircleProgress/comps/OuterCircle";
import TempInnerCircle from "../../component/TempCircleProgress/comps/InnerCircle";

const HalfCircleSlider = ({ navigation }) => {
  const tost = useToast();
  const { temp, setTempValue, getTempValueAndUnit } = useAppSettingContext();
  const { writeTempToDevice } = useBleContext();
  const [sliderValue, setSliderValue] = useState(temp.value);

  const handleValueChange = (value) => {
    setSliderValue(value);
  };

  const radius = 171.5;
  const circumference = 2 * Math.PI * radius;
  const halfCircumference = circumference / 2; // Half of the circle's circumference

  // Use half of the circumference as the strokeDasharray
  const strokeDasharray = `${halfCircumference},${circumference}`;

  const strokeDashoffset =
    halfCircumference - (sliderValue / 100) * halfCircumference;
  return (
    <CarthagosScreen style={styles.container}>
      <View style={styles.IconAndHeadingTxt}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack(null)}>
          <MaterialCommunityIcons
            style={{ alignSelf: "flex-end", paddingBottom: 5 }}
            name="arrow-left"
            size={32}
            color="#B0B0B0"
          />
        </TouchableWithoutFeedback>
        <Text style={styles.Heading}>Temperature</Text>
      </View>
      <TempOuterCircle />
      <TempInnerCircle />
      <View style={styles.IconAndTemp}>
        <Svg width={353} height={375}>
          <G>
            <Circle
              cx={156.5}
              cy={-14.5}
              r={radius}
              fill="transparent"
              stroke={colors.primary}
              strokeWidth={30}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={-strokeDashoffset}
              transform="rotate(270, 171.5, 171.5)"
            />
          </G>
          <View style={styles.tempTextWrapper}>
            <Text style={styles.Temptext}>
              {getTempValueAndUnit({ value: sliderValue, unit: temp.unit })}
            </Text>
          </View>
        </Svg>
      </View>

      <View style={styles.SliderTxtWrapper}>
        <Slider
          maximumTrackTintColor="white"
          style={styles.slider}
          value={sliderValue}
          minimumTrackTintColor={colors.primary}
          thumbTintColor={colors.primary}
          minimumValue={0}
          maximumValue={100}
          step={1}
          onValueChange={(value) => handleValueChange(value)}
          onSlidingComplete={async () => {
            try {
              await writeTempToDevice([sliderValue]);
              setTempValue(sliderValue);
            } catch (error) {
              console.log(error);
              tost.show("Error writing temperature to device", {
                type: "normal",
              });
            }
          }}
        />
      </View>
    </CarthagosScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: colors.black,
    flex: 1,
  },
  IconAndHeadingTxt: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingLeft: 17,
  },

  Heading: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.white,
    marginTop: 35,
    alignSelf: "center",
    paddingLeft: 4,
    textTransform: "uppercase",
  },
  IconAndTemp: {
    position: "absolute",
    top: 206,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  Temptext: {
    fontSize: 38,
    fontWeight: "900",
    color: colors.white,
  },
  tempTextWrapper: {
    position: "absolute",
    right: 0,
    top: 150,
    backgroundColor: "#1B1B1B",
    justifyContent: "center",
    alignItems: "center",
    width: 160,
    paddingVertical: 10,
    borderRadius: 5,
  },
  SliderTxtWrapper: {
    flexDirection: "column",
    width: "100%",
  },
  SliderTxt: {
    alignSelf: "center",
    color: colors.white,
  },
  slider: {
    alignSelf: "center",
    width: 200,
    paddingBottom: 155,
  },
});

export default HalfCircleSlider;
