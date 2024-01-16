import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";

function FetchUserProfile(currentUser = false) {
  const [userData, setUserData] = useState();

  useEffect(() => {
    const loadUserProfileData = async () => {
      if (currentUser) {
        console.log("currentUser", currentUser);
        firestore()
          .doc(`users/${currentUser.uid}`)
          .get()
          .then((docSnap) => {
            console.log("docSnap", docSnap.exists);
            if (docSnap.exists) {
              const userData = docSnap.data();
              setUserData(userData);
            } else {
              console.log("User profile data not found in Firestore");
            }
          })
          .catch((error) => {
            console.error(
              "Error loading user profile data from Firestore:",
              error
            );
          });
      }
    };

    loadUserProfileData();
  }, [currentUser]);

  return userData;
}

export default FetchUserProfile;
