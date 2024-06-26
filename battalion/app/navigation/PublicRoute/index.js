import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../../screens/public/main";
import Login from "../../screens/public/auth/login";
import Register from "../../screens/public/auth/register";
import ForgotPassword from "../../screens/public/auth/forgotPassword";
import PhoneCodeVerification from "../../screens/public/auth/phoneCodeVerification";
import PhoneCodeVerificationRequest from "../../screens/public/auth/phoneCodeVerificationRequest";
import SelectUserOccupations from "../../screens/public/auth/selectUserOccupations";

const Stack = createNativeStackNavigator();
const PublicRoute = () => {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="selectUserOccupations"
        component={SelectUserOccupations}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="phoneCodeVerificationRequest"
        component={PhoneCodeVerificationRequest}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="phoneCodeVerification"
        component={PhoneCodeVerification}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default PublicRoute;
