import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, StatusBar } from "react-native";
import colors from "../../config/Colors/colors";
import TextLogo from "../../assets/TextLogo";
import auth from "@react-native-firebase/auth";

import CarthagosLinkButton from "../../component/CarthagosLinkButton/CarthagosLinkButton";

import {
  addUserToFirestore,
  createUser,
} from "../../config/UsersCollection/UsersCollection";

import { useToast } from "react-native-toast-notifications";
import { useAuth } from "../../utils/AuthProvider/AuthProvider";
import { FontsLoad } from "../../utils/FontsLoad";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const { currentUser, modifyUser } = useAuth();
  useEffect(() => {
    FontsLoad();
  }, []);

  useEffect(() => {
    console.log("currentUser", currentUser);
    if (currentUser && !currentUser.phoneNumber && currentUser.email) {
      navigation.navigate("selectUserOccupations");
    }
  }, []);

  useEffect(() => {
    console.log("name:", name, ". email:", email);
  }, [name, email]);
  // Handle user state changes
  const onAuthStateChanged = async (user) => {
    try {
      await auth().currentUser.updateProfile({ displayName: name });

      const addedToFirestore = await createUser(user.uid, {
        name,
        email,
      });
      modifyUser({ uid: user.uid, name, email });
      if (addedToFirestore) {
        console.log(
          "User data added to Firestore successfully.",
          addedToFirestore
        );
        navigation.navigate("selectUserOccupations");
      } else {
        setIsLoading(false);
        console.error("Failed to add user data to Firestore.");
      }

      toast.show("Successfully registered", {
        type: "normal",
      });
    } catch (error) {
      console.log(error);
      toast.show("Registration error", {
        type: "normal",
      });
    }
  };

  useEffect(() => {
    const sub = auth().onAuthStateChanged(async (user) => {
      if (user) {
        if (email === "" && name === "") {
          console.log("signout");
          const signout = await auth().signOut();
          console.log("signout", signout);
        } else {
          await onAuthStateChanged(user);
        }
      }
    });
    return sub;
  }, [name, email]);

  const handleRegister = async (setIsLoading) => {
    setIsLoading(true);

    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      toast.show("Please fill all the fields", {
        type: "normal",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      setIsLoading(false);
      toast.show("Password didnot matched.", {
        type: "normal",
      });
      return;
    } else {
    }

    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      setIsLoading(false);
      if (error.code === "auth/email-already-in-use") {
        toast.show("User already exists.", {
          type: "normal",
        });
      } else if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/missing-password"
      ) {
        toast.show("Please fill all the fields", {
          type: "normal",
        });
        setIsLoading(false);
      } else {
        toast.show("Registration error", {
          type: "normal",
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <TextLogo />
        <Text style={styles.title}>Create Your Account</Text>
      </View>
      <View style={styles.inputTextContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#656565"
          placeholder="Name"
          onChangeText={(text) => setName(text)}
          value={name}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#656565"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#656565"
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#656565"
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmpassword}
          secureTextEntry
        />
      </View>
      <View style={styles.btnLink}>
        <CarthagosLinkButton
          navigation={navigation}
          onPress={(setIsLoading) => handleRegister(setIsLoading)}
          isLoading={isLoading}
          title="Continue"
          mainDesc="Already have an account? "
          desc="Login"
          width={277}
          loginRoute="Login"
          textColor="white"
        />
      </View>
      <StatusBar translucent backgroundColor="transparent" />
    </View>
  );
}

const styles = StyleSheet.create({
  btnLink: {
    alignItems: "center",
    marginTop: 139,
  },
  container: {
    backgroundColor: colors.black,
    flex: 1,
    paddingHorizontal: 15,
  },
  errorText: {
    color: colors.primary,
    marginBottom: 10,
    fontSize: 14,
  },

  input: {
    height: 50,
    borderColor: colors.secondary,
    borderWidth: 1,
    marginBottom: 10,
    padding: 15,
    width: 283,
    /* width: "100%", */
    borderRadius: 5,
    color: colors.white,
    fontSize: 18,
  },
  inputTextContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 36,
  },
  logoContainer: {
    marginTop: 66,
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    color: "green",
    marginBottom: 10,
    fontSize: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: "500",
    fontFamily: "SF-Pro-Display",
    color: colors.white,
    marginTop: 18,
  },
});
