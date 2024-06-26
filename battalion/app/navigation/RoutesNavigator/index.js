import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrivateRoute from "../PrivateRoute";
import PublicRoute from "../PublicRoute";
import { FontsLoad } from "../../utils/FontsLoad";
import { useEffect } from "react";
const Stack = createNativeStackNavigator();
export const RoutesNavigator = () => {
  useEffect(() => {
    FontsLoad();
  }, []);
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
