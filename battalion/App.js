import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./app/navigation/AuthNavigator";
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
