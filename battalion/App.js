import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./app/navigation/AuthNavigator";
import Occupation from "./app/screen/Occupation";
import LogoScreen from "./app/screen/LogoScreen";
export default function App() {
  return (
    <NavigationContainer>
      <LogoScreen />
    </NavigationContainer>
  );
}
