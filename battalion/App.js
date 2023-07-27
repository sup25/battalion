import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./app/navigation/AuthNavigator";
import { AuthNavigator } from "./app/navigation/AuthNavigator";
import VerifyPhoneManually from "./app/screen/VerifyPhoneManually";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AuthNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
