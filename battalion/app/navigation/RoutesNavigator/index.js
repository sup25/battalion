import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import PublicRoute from "../PublicRoute/PublicRoute";
const Stack = createNativeStackNavigator();
export const RoutesNavigator = () => {
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
