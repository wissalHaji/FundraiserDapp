export function getTransactionState(stackId, drizzleState) {
  const { transactions, transactionStack } = drizzleState;
  const txKey = transactionStack[stackId];
  return transactions[txKey];
}
