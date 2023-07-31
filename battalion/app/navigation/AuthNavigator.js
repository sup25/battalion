import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
const Stack = createNativeStackNavigator();
export const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="privateRoute"
        options={{ gestureEnabled: false, headerShown: false }}
        component={PrivateRoute}
      />
      <Stack.Screen
        name="publicRoute"
        options={{ gestureEnabled: false, headerShown: false }}
        component={PublicRoute}
      />
    </Stack.Navigator>
  );
};
