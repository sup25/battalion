/**
 * @param{*}setState React setState method for clearing the error message.
 * @param{Number |Boolean } time time in ms-if not passed -default false- will not run setTimeout(see example).
 * @returns void
 * @example
 * //in case of timing
 * handleClearErrorMessage(setErrorMessage,3000) //will fire setTimeout
 * //in case of without timing
 * handleClearErrorMessage(setErrorMessage) //will not fire setTimeout
 */
const handleClearMessage = (setState, time = false) => {
  if (time) {
    setTimeout(() => {
      setState("");
    }, time);
    return;
  }
  setState("");
  return;
};

export default handleClearMessage;
