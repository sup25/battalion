import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./app/utils/AuthProvider";
import { AuthNavigator } from "./app/navigation/AuthNavigator";
import { BleProvider } from "./app/utils/BLEProvider";
import { AppSettingProvider } from "./app/context/AppSettingContext";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AppSettingProvider>
          <BleProvider>
            <AuthNavigator />
          </BleProvider>
        </AppSettingProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
