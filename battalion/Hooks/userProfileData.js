import { useEffect, useState } from "react";
import { db } from "../app/config/Firebase";
import { doc, getDoc } from "firebase/firestore";

function UserProfileData(currentUser) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserProfileData = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserData(userData);
          } else {
            console.log("User profile data not found in Firestore");
          }
        } catch (error) {
          console.error(
            "Error loading user profile data from Firestore:",
            error
          );
        }
      }
    };

    loadUserProfileData();
  }, [currentUser]);

  return userData;
}

export default UserProfileData;
