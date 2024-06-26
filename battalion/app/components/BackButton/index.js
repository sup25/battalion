import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback, View } from "react-native";

const BackButton = ({ style = {} }) => {
  const navigation = useNavigation();
  return (
    <View style={[{ width: 24 }, style]}>
      <TouchableWithoutFeedback onPress={() => navigation.goBack(null)}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#B0B0B0" />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default BackButton;
