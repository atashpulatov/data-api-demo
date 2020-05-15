
export function calculateNumberOfFiltersActive({
  projects, types, dateSetByUser, certified, owners
}, myLibrary) {
  let result = 0;
  if (!myLibrary) {
    result += projects && projects.length > 0 ? 1 : 0;
    result += types && types.length > 0 ? 1 : 0;
  }
  result += dateSetByUser ? 1 : 0;
  result += certified ? 1 : 0;
  result += owners && owners.length > 0 ? 1 : 0;
  return result;
}
