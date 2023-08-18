import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./app/utils/AuthProvider";
import { AuthNavigator } from "./app/navigation/AuthNavigator";
import FourDigitCodeInsertScreen from "./app/screen/FourDigitCodeInsertScreen";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        {/*   <AuthNavigator /> */}
        <FourDigitCodeInsertScreen />
      </AuthProvider>
    </NavigationContainer>
  );
}
