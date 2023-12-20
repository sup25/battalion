import * as LocalAuthentication from "expo-local-authentication";

export const UseBioMetric = async () => {
  try {
    const hasBiometricHardware = await LocalAuthentication.hasHardwareAsync();

    if (hasBiometricHardware) {
      const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (isBiometricEnrolled) {
        const biometricResult = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate to sign in",
        });

        if (biometricResult.success) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
