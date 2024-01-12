import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";

function FetchUserProfile(currentUser) {
  const [userData, setUserData] = useState();

  useEffect(() => {
    const loadUserProfileData = async () => {
      if (currentUser) {
        const userDocRef = firestore().doc(`users/${currentUser.uid}`);
        userDocRef
          .get()
          .then((docSnap) => {
            if (docSnap.exists()) {
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
