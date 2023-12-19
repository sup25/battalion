import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./app/utils/AuthProvider";
import { AuthNavigator } from "./app/navigation/AuthNavigator";
import { BleProvider } from "./app/utils/BLEProvider";
import { AppSettingProvider } from "./app/context/AppSettingContext";
import { ToastProvider } from "react-native-toast-notifications";

export default function App() {
  return (
    <NavigationContainer>
      <ToastProvider
        placement="top"
        duration={3000}
        offset={100}
        animationType="slide-in"
      >
        <AuthProvider>
          <AppSettingProvider>
            <BleProvider>
              <AuthNavigator />
            </BleProvider>
          </AppSettingProvider>
        </AuthProvider>
      </ToastProvider>
    </NavigationContainer>
  );
}
