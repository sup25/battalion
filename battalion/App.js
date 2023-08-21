import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./app/utils/AuthProvider";
import { AuthNavigator } from "./app/navigation/AuthNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AuthNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
