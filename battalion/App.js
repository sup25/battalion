import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./app/utils/AuthProvider";
import { AuthNavigator } from "./app/navigation/AuthNavigator";
import { BleProvider } from "./app/utils/BLEProvider";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <BleProvider>
          <AuthNavigator />
        </BleProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
