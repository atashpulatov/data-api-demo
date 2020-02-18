export function removeTimestampFromTableName(tableName) {
  return tableName.replace(/\d{13}\b/, 'TIMESTAMP') // searches for 13 digits at the end of the string and replaces them with "TIMESTAMP" - this is to make the string universal for testing purposes
}
