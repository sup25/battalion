
import {Keyboard, TouchableWithoutFeedback} from 'react-native';
const DismissMyKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default DismissMyKeyboard