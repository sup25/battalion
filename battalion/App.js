import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./app/utils/AuthProvider/AuthProvider";
import { RoutesNavigator } from "./app/navigation/RoutesNavigator";
import { BleProvider } from "./app/utils/BLEProvider/BLEProvider";
import { AppSettingProvider } from "./app/context/AppSettingContext/AppSettingContext";
import { ToastProvider } from "react-native-toast-notifications";

export default function App() {
  return (
    <NavigationContainer>
      <ToastProvider
        placement="top"
        duration={5000}
        offset={100}
        animationType="slide-in"
      >
        <AuthProvider>
          <AppSettingProvider>
            <BleProvider>
              <RoutesNavigator />
            </BleProvider>
          </AppSettingProvider>
        </AuthProvider>
      </ToastProvider>
    </NavigationContainer>
  );
}
