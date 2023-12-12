import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./app/utils/AuthProvider";
import { AuthNavigator } from "./app/navigation/AuthNavigator";
import { BleProvider } from "./app/utils/BLEProvider";
import { TemperatureProvider } from "./app/context/TempContex";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <BleProvider>
          <TemperatureProvider>
            <AuthNavigator />
          </TemperatureProvider>
        </BleProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
