import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import CarthagosLinkButton from "../../component/CarthagosLinkButton/CarthagosLinkButton";
import colors from "../../config/Colors/colors";
import TextLogoWhite from "../../assets/TextLogoWhite";
import CarthagosScreen from "../../component/CarthagosScreen/CarthagosScreen";
import { addUserToFirestore } from "../../config/UsersCollection/UsersCollection";
import auth from "@react-native-firebase/auth";
import { useToast } from "react-native-toast-notifications";
import { FontsLoad } from "../../utils/FontsLoad";
const SelectUserOccupations = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [otherOccupation, setOtherOccupation] = useState("");

  useEffect(() => {
    FontsLoad();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      function () {
        return true; // Return false from the callback function
      }
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, []);

  const toast = useToast();

  const Categories = [
    { id: 1, occupation: "Electrician" },
    { id: 2, occupation: "Construction Manager" },
    { id: 3, occupation: "Plumber" },
    { id: 4, occupation: "Carpenter" },
    { id: 5, occupation: "Worker" },
    { id: 6, occupation: "Civil Engineer" },
    { id: 7, occupation: "Architect" },
    { id: 8, occupation: "Operator" },
    { id: 9, occupation: "Bricklayer" },
    { id: 10, occupation: "Technician" },
    { id: 11, occupation: "Roofer" },
    { id: 12, occupation: "Engineer" },
    { id: 13, occupation: "Pipefitter" },
    { id: 14, occupation: "Foreman" },
    { id: 15, occupation: "Heavy equipment operator" },
  ];

  const handleContinue = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        if (selectedCategory.length === 0 && !otherOccupation.trim()) {
          toast.show(
            "Please select an occupation or provide Other occupation.",
            {
              type: "normal",
            }
          );
          return;
        }

        const userId = user.uid;
        const occupations =
          selectedCategory.length === 0
            ? [otherOccupation]
            : selectedCategory.map((categoryId) => {
                const options = Categories.find((cat) => cat.id === categoryId);
                return options ? options.occupation : "";
              });

        const userData = {
          occupations,
        };

        const success = await addUserToFirestore(userId, userData, true);

        if (success) {
          toast.show("User occupations updated successfully", {
            type: "normal",
          });
          navigation.navigate("Phoneverify");
        } else {
          toast.show("Failed to add user data", {
            type: "normal",
          });
        }
      } else {
        toast.show("User not authenticated", {
          type: "normal",
        });
      }
    } catch (error) {
      console.error("Error handling continue:", error);
    }
  };

  return (
    <CarthagosScreen style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.logoTextContainer}>
          <TextLogoWhite />
          <Text style={styles.textHeading}>What's Your Occupation?</Text>
        </View>
        <View style={styles.categoryContainer}>
          {Categories.map((cat) => {
            return (
              <TouchableWithoutFeedback
                key={cat.id}
                onPress={() => {
                  setSelectedCategory((prevSelected) => {
                    if (prevSelected?.length) {
                      if (!prevSelected.includes(cat.id)) {
                        return [...prevSelected, cat.id];
                      }
                      return prevSelected.filter((id) => id !== cat.id);
                    }
                    return [cat.id];
                  });
                }}
              >
                <View
                  style={[
                    styles.categoryItem,
                    {
                      backgroundColor: selectedCategory.includes(cat.id)
                        ? "white"
                        : "#2D2D2D",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.category,
                      {
                        color: selectedCategory.includes(cat.id)
                          ? "black"
                          : colors.white,
                      },
                    ]}
                  >
                    {cat.occupation}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
        <View style={styles.InputContainer}>
          <View style={styles.otherText}>
            <Text
              style={{
                fontSize: 16,
                height: "100%",
                lineHeight: 45,
                color: colors.white,
                fontFamily: "SF-Pro-Display",
              }}
            >
              Other
            </Text>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Write here"
              value={otherOccupation}
              placeholderTextColor="#989898"
              onChangeText={setOtherOccupation}
            />
          </View>
        </View>
        <View style={styles.btnLink}>
          <CarthagosLinkButton
            navigation={navigation}
            title="Continue"
            mainDesc="Already have an account? "
            desc="Login"
            width={277}
            loginRoute="Login"
            textColor="white"
            onPress={handleContinue}
          />
        </View>
      </View>
    </CarthagosScreen>
  );
};

export default SelectUserOccupations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  wrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },

  logoTextContainer: {
    width: "100%",
    alignItems: "center",
  },
  textHeading: {
    color: colors.white,
    marginTop: 18,
    fontSize: 24,
    fontWeight: "500",
    fontFamily: "SF-Pro-Display",
  },

  categoryContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 18,
    paddingRight: 20,
    marginTop: 30,
    alignItems: "center",
  },
  categoryItem: {
    marginRight: 10,
    marginTop: 10,
    color: colors.white,
    backgroundColor: "#2D2D2D",
    height: 44,
    width: "fit-content",

    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  category: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "400",
  },
  btnLink: {
    marginTop: 25,
    alignItems: "center",
  },

  inputView: {
    borderEndEndRadius: 50,
    borderStartEndRadius: 50,
    borderTopEndRadius: 50,
    borderBottomEndRadius: 50,
    paddingLeft: 15,
    backgroundColor: colors.white,
    fontSize: 16,
    flex: 1,
    lineHeight: 45,
    border: 0,
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    color: "#000",
    fontSize: 16,
    padding: 0,
    lineHeight: 16,
  },

  InputContainer: {
    flexDirection: "row",

    borderRadius: 50,
    marginTop: 34,
    marginBottom: 20,
    height: 45,
    marginHorizontal: 15,
    backgroundColor: "#2D2D2D",
  },
  otherText: {
    color: colors.white,
    fontSize: 16,
    borderRadius: 50,
    fontWeight: "400",
    paddingHorizontal: 15,
  },

  txtBtnContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 76,
  },
});
