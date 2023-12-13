import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./app/utils/AuthProvider";
import { AuthNavigator } from "./app/navigation/AuthNavigator";
import { BleProvider } from "./app/utils/BLEProvider";
import { DeviceSettingsProvider } from "./app/utils/DeviceSettingsProvider";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <BleProvider>
          <DeviceSettingsProvider>
            <AuthNavigator />
          </DeviceSettingsProvider>
        </BleProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
