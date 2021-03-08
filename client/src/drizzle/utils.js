/**
 * Extracts the transaction object indexed with
 * key at the index of stackId.
 *
 * @param {*} stackId the index of the element containing the
 * tx temp key from the transactionStack array in drizzle state
 * @param {*} drizzleState
 */
export function getTransactionState(stackId, drizzleState) {
  const { transactions, transactionStack } = drizzleState;
  const txKey = transactionStack[stackId];
  return transactions[txKey];
}

/**
 * Extracts the revert message from the error
 * message received when the error event is
 * triggered on the transaction.
 * web3.js : txObject.on("error")
 * @param {*} error The EVM revert error
 */
export function getVMExceptionMessage(error) {
  // the error is not a VM exception

  if (error.message.indexOf("VM Exception") === -1) return null;
  // if (error.message.indexOf("revert") === -1) return null;

  const errorString = error.message.substring(
    error.message.indexOf("{"),
    error.message.length - 1
  );
  const errorObj = JSON.parse(errorString);
  //extract the revert message
  // const message = errorObj.value.data.message.substring(
  //   errorObj.value.data.message.indexOf("revert") + 6
  // );
  return errorObj.value.data.message;
}
