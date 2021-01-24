// TODO : log the error to a logging service
export function handleVMException(error) {
  const errorString = error.message.substring(
    error.message.indexOf("{"),
    error.message.length - 1
  );
  const errorObj = JSON.parse(errorString);
  //extract the revert message
  const message = errorObj.value.data.message.substring(
    errorObj.value.data.message.indexOf("revert") + 6
  );
  console.log(message);
  throw new Error(message);
}
