import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import CarthagosLinkButton from "../../component/CarthagosLinkButton/CarthagosLinkButton";
import colors from "../../config/Colors/colors";
import TextLogoWhite from "../../assets/TextLogoWhite";
import CarthagosScreen from "../../component/CarthagosScreen/CarthagosScreen";
import { addUserToFirestore } from "../../config/UsersCollection/UsersCollection";
import { getAuth } from "firebase/auth";

const Occupation = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [otherOccupation, setOtherOccupation] = useState("");
  const auth = getAuth();

  const Category = [
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
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        let occupations = [];

        if (selectedCategory.length === 0) {
          // If no category is selected, use otherOccupation as the occupation
          occupations = [otherOccupation];
        } else {
          // If categories are selected, use them
          occupations = selectedCategory.map((categoryId) =>
            getCategoryById(categoryId)
          );
        }

        const userData = {
          occupations,
        };

        const success = await addUserToFirestore(userId, userData);

        if (success) {
          navigation.navigate("Phoneverify");
        } else {
          console.log("Failed to add user to Firestore");
        }
      } else {
        console.log("User not authenticated");
      }
    } catch (error) {
      console.error("Error handling continue:", error);
    }
  };

  const getCategoryById = (categoryId) => {
    const category = Category.find((cat) => cat.id === categoryId);
    return category ? category.occupation : "";
  };

  return (
    <CarthagosScreen style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.logoTextContainer}>
          <TextLogoWhite />
          <Text style={styles.textHeading}>What's your Occupation?</Text>
        </View>
        <View style={styles.categoryContainer}>
          {Category.map((cat) => {
            return (
              <View key={cat.id} style={styles.categoryItem}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    const isSelected = selectedCategory.includes(cat.id);
                    if (isSelected) {
                      // If category is already selected, remove it
                      setSelectedCategory((prevSelected) =>
                        prevSelected.filter((id) => id !== cat.id)
                      );
                    } else {
                      // If category is not selected, add it
                      setSelectedCategory((prevSelected) => [
                        ...prevSelected,
                        cat.id,
                      ]);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.category,
                      {
                        backgroundColor: selectedCategory.includes(cat.id)
                          ? "white"
                          : "#2D2D2D",
                        color: selectedCategory.includes(cat.id)
                          ? "black"
                          : colors.white,
                      },
                    ]}
                  >
                    {cat.occupation}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            );
          })}
        </View>
        <View style={styles.InputContainer}>
          <Text style={styles.otherText}>Other</Text>
          <TextInput
            style={styles.input}
            placeholder="Write here"
            placeholderTextColor="#989898"
            onChangeText={setOtherOccupation}
          />
        </View>
        <View style={styles.btnLink}>
          <CarthagosLinkButton
            navigation={navigation}
            title="Continue"
            mainDesc="Already Have an account? "
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

export default Occupation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  wrapper: {
    paddingTop: 30,
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
  },

  categoryContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 18,
    paddingRight: 20,
    marginTop: 46,
    alignItems: "center",
  },
  categoryItem: {
    marginRight: 8,
    marginTop: 8,
  },

  category: {
    color: colors.white,
    backgroundColor: "#2D2D2D",
    height: 47,
    width: "100%",
    padding: 10,
    borderRadius: 20,
    fontSize: 18,
    fontWeight: "400",
    display: "flex",
    alignItems: "center",
  },
  btnLink: {
    alignItems: "center",
  },

  input: {
    height: 37,
    borderRadius: 20,
    width: 273,
    paddingLeft: 15,
    backgroundColor: colors.white,
    fontSize: 18,
    right: 275,
  },

  InputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 34,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  otherText: {
    backgroundColor: "#2D2D2D",
    color: colors.white,
    height: 37,
    borderRadius: 20,
    alignItems: "center",

    fontSize: 18,
    fontWeight: "400",
    paddingLeft: 15,
    width: "100%",
  },

  txtBtnContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 76,
  },
});
